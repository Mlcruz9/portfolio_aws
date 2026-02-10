#!/usr/bin/env bash
set -euo pipefail

# ========= Config =========
APP_NAME="portfolio"
SERVER_NAME="_"          # set your domain, e.g. "miguellacruz.es"
PORT="80"
WEB_ROOT="/var/www/${APP_NAME}"
BUILD_DIR="/tmp/${APP_NAME}-vite"

# Resolve repository location from this script path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Input files/folders in repo
PORTFOLIO_FILE="${SCRIPT_DIR}/portfolio.tsx"
IMG_DIR="${SCRIPT_DIR}/img"
CV_DIR="${SCRIPT_DIR}/cv"

NGINX_SITE="/etc/nginx/conf.d/${APP_NAME}.conf"

need_cmd() { command -v "$1" >/dev/null 2>&1; }

install_pkgs() {
  if need_cmd dnf; then
    sudo dnf -y update
    sudo dnf -y install nginx curl rsync ca-certificates tar gzip
  elif need_cmd yum; then
    sudo yum -y update
    sudo yum -y install nginx curl rsync ca-certificates tar gzip
  else
    echo "ERROR: Neither dnf nor yum found. This script targets Amazon Linux."
    exit 1
  fi
}

ensure_node() {
  if need_cmd node; then
    local node_major
    node_major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
    if [ "${node_major}" -ge 20 ]; then
      return
    fi
  fi

  echo "==> Installing Node.js 20.x..."
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

  if need_cmd dnf; then
    sudo dnf -y install nodejs
  else
    sudo yum -y install nodejs
  fi
}

echo "==> Validating input..."
if [ ! -f "$PORTFOLIO_FILE" ]; then
  echo "ERROR: ${PORTFOLIO_FILE} not found. Ensure portfolio.tsx is next to run.sh."
  exit 1
fi

echo "==> Installing system dependencies for Amazon Linux..."
install_pkgs

ensure_node

echo "==> Node: $(node -v) | npm: $(npm -v)"

echo "==> Creating Vite React+TS project in ${BUILD_DIR}..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
cd /tmp

npm create vite@latest "${APP_NAME}-vite" -- --template react-ts
cd "$BUILD_DIR"

echo "==> Installing dependencies..."
npm install

echo "==> Installing required libraries..."
npm install framer-motion lucide-react react-github-calendar

echo "==> Copying portfolio.tsx into src/Portfolio.tsx..."
cp -f "$PORTFOLIO_FILE" "$BUILD_DIR/src/Portfolio.tsx"

echo "==> Writing src/main.tsx to render Portfolio..."
cat > "$BUILD_DIR/src/main.tsx" <<'EOF_MAIN'
import React from "react";
import ReactDOM from "react-dom/client";
import Portfolio from "./Portfolio";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);
EOF_MAIN

echo "==> Preparing static assets (public/img, public/cv)..."
mkdir -p "$BUILD_DIR/public/img" "$BUILD_DIR/public/cv"

if [ -d "$IMG_DIR" ]; then
  echo "==> Copying img -> public/img ..."
  rsync -av --delete "$IMG_DIR"/ "$BUILD_DIR/public/img"/
else
  echo "==> No img folder found (ok)."
fi

if [ -d "$CV_DIR" ]; then
  echo "==> Copying cv -> public/cv ..."
  rsync -av --delete "$CV_DIR"/ "$BUILD_DIR/public/cv"/
else
  echo "==> No cv folder found (ok)."
fi

echo "==> Building..."
npm run build

if [ ! -d "$BUILD_DIR/dist" ]; then
  echo "ERROR: dist/ not found after build."
  exit 1
fi

echo "==> Deploying dist/ to ${WEB_ROOT}..."
sudo mkdir -p "$WEB_ROOT"
sudo rsync -av --delete "$BUILD_DIR/dist"/ "$WEB_ROOT"/

echo "==> Writing Nginx config..."
sudo tee "$NGINX_SITE" >/dev/null <<EOF_NGINX
server {
  listen ${PORT};
  server_name ${SERVER_NAME};

  root ${WEB_ROOT};
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location ~* \\.(?:css|js|mjs|map|jpg|jpeg|png|gif|svg|webp|ico|woff2|woff|ttf)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
    try_files \$uri =404;
  }

  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options SAMEORIGIN;
  add_header Referrer-Policy strict-origin-when-cross-origin;
}
EOF_NGINX

echo "==> Testing Nginx config..."
sudo nginx -t

echo "==> Enabling and restarting Nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "✅ Done"
echo "   Served from: ${WEB_ROOT}"
echo "   Open: http://<EC2_PUBLIC_IP>/"
echo
echo "Notes:"
echo " - Open inbound port 80 in your EC2 Security Group"
