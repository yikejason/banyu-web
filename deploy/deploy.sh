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

# Next 16 构建需要 node >= 20.9；默认 node 太老时从 nvm 里挑一个满足要求的版本
node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt 20 ]; then
  best_dir=""
  best_key=0
  for d in "$HOME"/.nvm/versions/node/v*/; do
    n="${d##*/node/v}"
    n="${n%/}"
    major="${n%%.*}"
    [ "${major:-0}" -ge 20 ] || continue
    if [ -x "${d}bin/node" ] || [ -f "${d}bin/node.exe" ]; then
      key="$(echo "$n" | awk -F. '{printf "%d%03d%03d", $1, $2, $3}')"
      if [ "${key:-0}" -gt "$best_key" ]; then
        best_key="$key"
        best_dir="${d}bin"
      fi
    fi
  done
  if [ -n "$best_dir" ]; then
    export PATH="$best_dir:$PATH"
  fi
fi
if [ "$(node_major)" -lt 20 ]; then
  echo "构建需要 node >= 20.9，当前是 $(node -v 2>/dev/null || echo 未安装)，且 nvm 里没有可用版本" >&2
  exit 1
fi

echo "==> node $(node -v)"

# 发版版本号：构建时经 NEXT_PUBLIC_DEPLOY_V 烙进 JS 包，部署后写进 out/version.json。
# DeployVersionCheck 拿两者对比，包内旧 ≠ 服务器新 ⇒ 当前页是旧包，自动刷新进最新版
DEPLOY_V=$(node -e 'console.log(Date.now())')

echo "==> 构建静态包（out/，版本号 ${DEPLOY_V}）..."
NEXT_PUBLIC_DEPLOY_V="${DEPLOY_V}" npm run build:static

if [ ! -d out ]; then
  echo "构建产物 out/ 不存在，检查 next.config.ts 是否配置 output: \"export\"" >&2
  exit 1
fi

echo "==> 写入版本号 out/version.json（v=${DEPLOY_V}）..."
node -e "require('fs').writeFileSync('out/version.json', JSON.stringify({ v: ${DEPLOY_V} }))"

echo "==> 上传到 root@${SERVER_IP}:${REMOTE_DIR}/ ..."
# 有 rsync 走 rsync；没有（Windows Git Bash 默认不带）则 tar 经 ssh 流式上传，
# 远端先解到 .new 目录再原子换名，效果等同 rsync --delete，且保留 .old 便于回滚
if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete out/ "root@${SERVER_IP}:${REMOTE_DIR}/"
else
  ssh "root@${SERVER_IP}" "mkdir -p ${REMOTE_DIR}"
  tar czf - -C out . | ssh "root@${SERVER_IP}" "
    set -e
    rm -rf ${REMOTE_DIR}.new ${REMOTE_DIR}.old
    mkdir -p ${REMOTE_DIR}.new
    tar xzf - -C ${REMOTE_DIR}.new
    mv ${REMOTE_DIR} ${REMOTE_DIR}.old
    mv ${REMOTE_DIR}.new ${REMOTE_DIR}
  "
fi

echo "==> 完成：http://${SERVER_IP}/"
