import { Client } from "ssh2";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REMOTE = "/var/www/fastuser/data/www/stackcv.bakha.me";
const ARCHIVE = path.join(ROOT, "stackcv-deploy.tar.gz");

const HOST = "46.17.102.145";
const USER = "root";
const PASS = process.env.DEPLOY_PASSWORD;
const DOMAIN = "stackcv.bakha.me";
const PORT = 3010;

if (!PASS) {
  console.error("Set DEPLOY_PASSWORD environment variable");
  process.exit(1);
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      let errOut = "";
      stream
        .on("close", (code) => {
          if (code !== 0) reject(new Error(`Command failed (${code}): ${cmd}\n${errOut || out}`));
          else resolve(out);
        })
        .on("data", (d) => {
          out += d.toString();
          process.stdout.write(d);
        })
        .stderr.on("data", (d) => {
          errOut += d.toString();
          process.stderr.write(d);
        });
    });
  });
}

function connect() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => resolve(conn))
      .on("error", reject)
      .connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 30000 });
  });
}

function upload(conn, local, remote) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const read = fs.createReadStream(local);
      const write = sftp.createWriteStream(remote);
      write.on("close", resolve);
      write.on("error", reject);
      read.on("error", reject);
      read.pipe(write);
    });
  });
}

async function main() {
  console.log("📦 Creating archive...");
  if (fs.existsSync(ARCHIVE)) fs.unlinkSync(ARCHIVE);

  const excludes = [
    "--exclude=node_modules",
    "--exclude=.next",
    "--exclude=.git",
    "--exclude=stackcv-deploy.tar.gz",
    "--exclude=.env.local",
    "--exclude=prisma/dev.db",
    "--exclude=prisma/dev.db-journal",
  ];

  execSync(
    `tar -czf "${ARCHIVE}" ${excludes.join(" ")} -C "${ROOT}" .`,
    { stdio: "inherit", shell: true },
  );

  console.log("🔌 Connecting to server...");
  const conn = await connect();

  try {
    console.log("📁 Preparing remote directory...");
    await exec(conn, `mkdir -p ${REMOTE}`);

    console.log("⬆️  Uploading project...");
    await upload(conn, ARCHIVE, `${REMOTE}/stackcv-deploy.tar.gz`);

    const secret = execSync("node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"").toString().trim();

    const remoteScript = `
set -e
cd ${REMOTE}
echo "Extracting..."
tar -xzf stackcv-deploy.tar.gz
rm -f stackcv-deploy.tar.gz

echo "Writing production .env..."
cat > .env << ENVEOF
DEEPSEEK_API_KEY=${process.env.DEEPSEEK_API_KEY || "your-deepseek-api-key"}
DATABASE_URL="file:${REMOTE}/prisma/prod.db"
NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=https://${DOMAIN}
GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID || ""}
GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET || ""}
ENVEOF

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "Node: $(node -v) npm: $(npm -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing PM2..."
  npm install -g pm2
fi

echo "Installing dependencies..."
npm install

echo "Prisma..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "Building..."
npm run build

echo "Pruning dev dependencies..."
npm prune --omit=dev

echo "Starting PM2 on port ${PORT}..."
pm2 delete stackcv 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "Configuring Nginx for ${DOMAIN} only (FastPanel + SSL)..."
SITE="/etc/nginx/fastpanel2-sites/fastuser/${DOMAIN}.conf"
BACKUP="$SITE.bak-stackcv-$(date +%Y%m%d)"
[ -f "$SITE" ] && cp "$SITE" "$BACKUP"

SSL_CERT=$(grep ssl_certificate "$BACKUP" 2>/dev/null | grep -v key | head -1 | awk '{print $2}' | tr -d ';')
SSL_KEY=$(grep ssl_certificate_key "$BACKUP" 2>/dev/null | head -1 | awk '{print $2}' | tr -d ';')
LISTEN80=$(grep "listen.*:80" "$BACKUP" 2>/dev/null | head -1 | sed 's/^[[:space:]]*//')
LISTEN443=$(grep "listen.*:443" "$BACKUP" 2>/dev/null | head -1 | sed 's/^[[:space:]]*//')

[ -z "$SSL_CERT" ] && SSL_CERT="/var/www/httpd-cert/${DOMAIN}_2026-06-04-03-56_26.crt"
[ -z "$SSL_KEY" ] && SSL_KEY="/var/www/httpd-cert/${DOMAIN}_2026-06-04-03-56_26.key"
[ -z "$LISTEN80" ] && LISTEN80="listen 46.17.102.145:80;"
[ -z "$LISTEN443" ] && LISTEN443="listen 46.17.102.145:443 ssl;"

cat > "$SITE" << NGINXEOF
server {
    server_name ${DOMAIN} www.${DOMAIN} ;

    $LISTEN80
    $LISTEN443

    ssl_certificate "$SSL_CERT";
    ssl_certificate_key "$SSL_KEY";

    charset utf-8;
    gzip on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/css image/x-ico application/pdf image/jpeg image/png image/gif application/javascript application/x-javascript application/x-pointplus;
    gzip_comp_level 1;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_cache_bypass \\$http_upgrade;
        proxy_read_timeout 86400;
    }

    include "/etc/nginx/fastpanel2-sites/fastuser/${DOMAIN}.includes";
    include /etc/nginx/fastpanel2-includes/*.conf;

    error_log /var/www/fastuser/data/logs/${DOMAIN}-frontend.error.log;
    access_log /var/www/fastuser/data/logs/${DOMAIN}-frontend.access.log;
}
NGINXEOF

nginx -t
systemctl reload nginx

echo "DONE — StackCV on http://127.0.0.1:${PORT} -> https://${DOMAIN}"
`;

    console.log("🚀 Running remote setup...");
    await exec(conn, remoteScript);

    console.log("\n✅ Deploy complete: https://" + DOMAIN);
  } finally {
    conn.end();
    if (fs.existsSync(ARCHIVE)) fs.unlinkSync(ARCHIVE);
  }
}

main().catch((e) => {
  console.error("\n❌ Deploy failed:", e.message);
  process.exit(1);
});
