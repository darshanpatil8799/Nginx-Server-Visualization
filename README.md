# nginx-server-visual

An animated, interactive, beginner-friendly diagram that explains how to **install, configure and host a website with NGINX on an AWS EC2 instance**, told through Ravi, a shop owner launching his online shop. It is inspired by the "Nginx Server Visual" page by divyapriya250413 and adds a request simulator, a live page preview and a live access log.

**#Buildwithvinit** · Plain HTML, CSS and JavaScript · No dependencies · No build step

## What is extra

- **Try it simulator** (steps 7 to 9): send `GET /`, `GET /missing` or `GET /api/shows` and watch the request travel.
- **Reverse proxy demo**: `/api/` is forwarded to an app server; turn the app OFF to see a **502 Bad Gateway**.
- **Live preview** of the page NGINX serves (an original demo page called ShowTime) that changes with each response (200, 404, JSON, 502).
- **Live access.log** that fills in as you click, plus the matching error.log reason in the log panel.
- Light/dark mode, keyboard-friendly buttons, reduced-motion support.

## Analogies

| Technical term | Ravi's world |
|---|---|
| AWS | Cloud city |
| EC2 | Rented shop building |
| NGINX | Receptionist |
| Public IPv4 | Shop address |
| Port 80 | Entrance for HTTP visitors |
| Security Group | Door guard |
| Internet Gateway | Main entrance to the network |
| Web root | Website storage shelf |
| index.html | Shop welcome page |
| systemctl | Power controls |
| access.log / error.log | Visitor register / problem register |

## The 9 steps

1. **AWS Cloud and EC2**: VPC, public subnet, Internet Gateway, EC2 on Amazon Linux 2023.
2. **Connect and install NGINX**: SSH, then `dnf install nginx`.
3. **Start and enable NGINX**: systemctl, listening on port 80.
4. **Create the website file**: `index.html` in `/usr/share/nginx/html/`.
5. **Configure the Security Group**: HTTP 80 open, SSH 22 limited to your IP.
6. **Visitor opens the public IP**: the request crosses the Internet Gateway.
7. **NGINX serves the page**: server block, `location /`, 200 OK, live preview.
8. **Routes and reverse proxy**: 200, 404 and 502 in the simulator.
9. **Logs and the full picture**: access.log, error.log, troubleshooting order, optional HTTPS and domain.

## Commands

```bash
ssh -i my-key.pem ec2-user@PUBLIC-IP
sudo dnf install nginx -y
nginx -v
sudo systemctl enable --now nginx
sudo systemctl status nginx
sudo ss -tlnp | grep ':80'
echo '<h1>Welcome to ShowTime</h1>' | sudo tee /usr/share/nginx/html/index.html
curl -i http://localhost
sudo nginx -t && sudo systemctl reload nginx
sudo journalctl -u nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Example config (inside a `server` block, for instance in `/etc/nginx/conf.d/`):

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ =404; }
  location /api/ { proxy_pass http://127.0.0.1:3000; }
}
```

## Moving-object legend

Envelope = HTTP request · Document = HTML file · Green check = 200 response · Package = installation or app reply · Lock = security filtering · Red cross = error or blocked.

## Run locally

```bash
cd nginx-server-visual
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push these files to the `main` branch of a GitHub repository.
2. Open **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
3. Your site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Project structure

```
nginx-server-visual/
  index.html      layout, simulator, preview and log panels
  css/style.css   themes, layout, glow, responsive rules
  js/app.js       diagram components, paths, simulator, step text
  .nojekyll
  LICENSE         MIT
  README.md
```

## Customization

Edit `STEPS` (text and commands), `COMPS` (diagram parts), `PATHS` (routes in the 1100 x 620 viewBox), `OUT` and `SITES` (simulator outcomes and preview pages) in `js/app.js`.

ShowTime is an original demo page and is not affiliated with any streaming service.

## License

MIT. Built with #Buildwithvinit.
