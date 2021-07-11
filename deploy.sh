#!/bin/bash

BUNDLE_FILE_BASE=fundoo-backend
BUNDLE_FILE=$BUNDLE_FILE_BASE-$BUILD_NUMBER.tar.gz
SERVER_IP=18.119.109.3
APPS_HOME=/home/ec2-user/apps
FOLDER_NAME=fd-backend

tar czf $BUNDLE_FILE app config logger swagger test utils package.json package-lock.json server.js
scp -i $EC2_SSH_KEY $BUNDLE_FILE ec2-user@$SERVER_IP:$APPS_HOME/$BUNDLE_FILE_BASE.tar.gz
rm -rf $BUNDLE_FILE

ssh -i $EC2_SSH_KEY ec2-user@$SERVER_IP << 'ENDSSH'
BUNDLE_FILE=fundoo-backend.tar.gz
SERVER_IP=18.119.109.3
APPS_HOME=/home/ec2-user/apps
FOLDER_NAME=fd-backend

cd $APPS_HOME
pm2 stop server
rm -rf $FOLDER_NAME
mkdir $FOLDER_NAME
tar -xf $BUNDLE_FILE -C $FOLDER_NAME
cp .env.backend.prod $FOLDER_NAME/.env.prod
cd $FOLDER_NAME
npm i
NODE_ENV=production pm2 start server.js --update-env
ENDSSH