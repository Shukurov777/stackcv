import { Client } from "ssh2";
const PASS = process.env.DEPLOY_PASSWORD;
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`
echo "=== includes ==="
cat /etc/nginx/fastpanel2-sites/fastuser/stackcv.bakha.me.includes 2>/dev/null || echo empty
echo "=== current site conf ==="
cat /etc/nginx/fastpanel2-sites/fastuser/stackcv.bakha.me.conf
echo "=== curl with Host header ==="
curl -sI -H "Host: stackcv.bakha.me" http://46.17.102.145/ | head -12
echo "=== curl https ==="
curl -skI https://stackcv.bakha.me/ | head -12
echo "=== apache? ==="
systemctl is-active apache2 2>/dev/null || systemctl is-active httpd 2>/dev/null || echo no-apache
echo "=== index.html in root? ==="
ls -la /var/www/fastuser/data/www/stackcv.bakha.me/index.html 2>/dev/null || echo no-index
head -3 /var/www/fastuser/data/www/stackcv.bakha.me/index.html 2>/dev/null || true
`, (e, s) => {
    s.on("data", (d) => process.stdout.write(d));
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "46.17.102.145", username: "root", password: PASS });
