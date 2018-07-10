#!/bin/bash

APP_NAME="vote-wx"
TEMP_DIR="tmpl"

SERVER_DIR='/home/data/code/laravelAdmin/resources'

SSH_USER="root"
# 默认qc
SSH_IP="39.104.75.70"

node build/build.js || { echo "webpack complie failed"; exit 1; }

tar -czf $APP_NAME-fe.tar.gz dist || { echo "store failed"; exit 1; }

scp $APP_NAME-fe.tar.gz $SSH_USER@$SSH_IP:$TEMP_DIR || { echo "security copy failed"; exit 1; }

ssh $SSH_USER@$SSH_IP <<EOF
cd
cd tmpl
tar -xzvf $APP_NAME-fe.tar.gz || { echo "extract failed"; exit 1; }
cd ./dist || { echo "extract failed"; exit 1; }

cp -r ./static/* $SERVER_DIR/static/ || { echo "copy static failed"; exit 1; }

cp index.html $SERVER_DIR/views/index.blade.php || {  echo "copy html failed"; exit 1;  }
cd ..
rm -rf dist || { echo "delete dist failed"; exit 1; }
rm $APP_NAME-fe.tar.gz || { echo "command failed"; exit 1; }
EOF

rm -rf $APP_NAME-fe.tar.gz || { echo "command failed"; exit 1; }
