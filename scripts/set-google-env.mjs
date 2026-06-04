import { Client } from "ssh2";

const PASS = process.env.DEPLOY_PASSWORD;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REMOTE = "/var/www/fastuser/data/www/stackcv.bakha.me";

if (!PASS || !CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set DEPLOY_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET");
  process.exit(1);
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let errOut = "";
      stream.on("data", (d) => process.stdout.write(d));
      stream.stderr.on("data", (d) => {
        errOut += d.toString();
        process.stderr.write(d);
      });
      stream.on("close", (code) => (code ? reject(new Error(errOut)) : resolve()));
    });
  });
}

const conn = new Client();
conn.on("ready", async () => {
  try {
    const safeId = CLIENT_ID.replace(/'/g, "'\\''");
    const safeSecret = CLIENT_SECRET.replace(/'/g, "'\\''");

    await exec(
      conn,
      `
set -e
cd ${REMOTE}
cp .env .env.bak-google-$(date +%Y%m%d)

if grep -q '^GOOGLE_CLIENT_ID=' .env; then
  sed -i 's|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=${safeId}|' .env
else
  echo 'GOOGLE_CLIENT_ID=${safeId}' >> .env
fi

if grep -q '^GOOGLE_CLIENT_SECRET=' .env; then
  sed -i 's|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=${safeSecret}|' .env
else
  echo 'GOOGLE_CLIENT_SECRET=${safeSecret}' >> .env
fi

sed -i 's|^NEXTAUTH_URL=.*|NEXTAUTH_URL=https://stackcv.bakha.me|' .env

pm2 restart stackcv --update-env
pm2 list
`,
    );
    console.log("\n✅ Google OAuth updated on server");
  } catch (e) {
    console.error("Failed:", e.message);
    process.exit(1);
  } finally {
    conn.end();
  }
}).connect({ host: "46.17.102.145", username: "root", password: PASS });
