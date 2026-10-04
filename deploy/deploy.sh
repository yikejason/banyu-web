#!/usr/bin/env bash
# 一键发版：构建静态包并 rsync 到服务器（可重复执行，增量上传）
# 用法：npm run deploy
# 首次使用前：
#   1. 服务器上装好 nginx 并放好配置（见同目录 nginx.conf 头部注释）
#   2. 可选：ssh-copy-id root@${SERVER_IP} 配免密，不配则每次输密码
set -euo pipefail

SERVER_IP="47.109.47.66"
REMOTE_DIR="/var/www/banyu-web"

cd "$(dirname "$0")/.." # 定位到项目根目录

# Next 16 构建需要 node >= 20.9；默认 node 太老时切到 nvm 里的 v22
node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt 20 ]; then
  export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
fi
if [ "$(node_major)" -lt 20 ]; then
  echo "构建需要 node >= 20.9，当前是 $(node -v 2>/dev/null || echo 未安装)" >&2
  exit 1
fi

echo "==> node $(node -v)"
echo "==> 构建静态包（out/）..."
npm run build:static

if [ ! -d out ]; then
  echo "构建产物 out/ 不存在，检查 next.config.ts 是否配置 output: \"export\"" >&2
  exit 1
fi

echo "==> 上传到 root@${SERVER_IP}:${REMOTE_DIR}/ ..."
# rsync 不建父目录，先确保远端目录存在；--delete 保证远端与 out/ 完全一致
ssh "root@${SERVER_IP}" "mkdir -p ${REMOTE_DIR}"
rsync -avz --delete out/ "root@${SERVER_IP}:${REMOTE_DIR}/"

echo "==> 完成：http://${SERVER_IP}/"
