import { Client } from "ssh2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PASS = process.env.DEPLOY_PASSWORD;
const DOMAIN = "stackcv.bakha.me";
const PORT = 3010;

if (!PASS) process.exit(1);

const nginxConf = `server {
    server_name ${DOMAIN} www.${DOMAIN} ;

    listen 46.17.102.145:80;
    listen 46.17.102.145:443 ssl;

    ssl_certificate "/var/www/httpd-cert/stackcv.bakha.me_2026-06-04-03-56_26.crt";
    ssl_certificate_key "/var/www/httpd-cert/stackcv.bakha.me_2026-06-04-03-56_26.key";

    charset utf-8;

    gzip on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/css image/x-ico application/pdf image/jpeg image/png image/gif application/javascript application/x-javascript application/x-pointplus;
    gzip_comp_level 1;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    include "/etc/nginx/fastpanel2-sites/fastuser/${DOMAIN}.includes";
    include /etc/nginx/fastpanel2-includes/*.conf;

    error_log /var/www/fastuser/data/logs/${DOMAIN}-frontend.error.log;
    access_log /var/www/fastuser/data/logs/${DOMAIN}-frontend.access.log;
}
`;

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
      stream.on("close", (code) => (code ? reject(new Error(errOut || `exit ${code}`)) : resolve()));
    });
  });
}

function upload(conn, content, remote) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const ws = sftp.createWriteStream(remote);
      ws.on("close", resolve);
      ws.on("error", reject);
      ws.end(content);
    });
  });
}

const conn = new Client();
conn.on("ready", async () => {
  try {
    const tmp = "/tmp/stackcv.bakha.me.conf";
    const site = `/etc/nginx/fastpanel2-sites/fastuser/${DOMAIN}.conf`;
    await upload(conn, nginxConf, tmp);
    await exec(
      conn,
      `cp "${site}" "${site}.bak-before-proxy" && mv "${tmp}" "${site}" && nginx -t && systemctl reload nginx && curl -skI https://${DOMAIN}/ | head -10`,
    );
    console.log("\n✅ Nginx proxy + SSL configured");
  } catch (e) {
    console.error("Failed:", e.message);
    process.exit(1);
  } finally {
    conn.end();
  }
}).connect({ host: "46.17.102.145", username: "root", password: PASS });
