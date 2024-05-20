#!/bin/sh
SERVER_PORT=6001
DB_PASSWORD="Secure@2023%3F"

installModules () {
    echo "Installing frontend node modules ..."
    npm --prefix ./Frontend install

    echo "Installing backend node modules ..."
    npm --prefix ./Backend install
}


configure(){
    rm  ./Backend/prisma/seeder/foreignWrapper.seed.ts
    cp ./staging/foreignWrapper.seed.ts ./Backend/prisma/seeder/

    rm ./Frontend/next.config.js
    cp ./staging/next.config.js ./Frontend
}

migrate() {
    cd Backend
    echo "creating/updating the env file ..."
    echo "PORT=$SERVER_PORT\nDATABASE_URL=\"postgresql://postgres:$DB_PASSWORD@localhost:5432/ptms?schema=public\"" > .env
    npx prisma migrate deploy
    cd ..
}


buildThem(){
    echo "building backend ..."
    npm --prefix ./Backend run build

    echo "building frontend ..."
    npm --prefix ./Frontend run build
}

startServices(){

    pm2 delete "ptms-back"
    pm2 delete "ptms-front"

    cd ./Backend

    pm2 start npm --name "ptms-back" -- start
    cd ../Frontend
    pm2 start npm --name "ptms-front" -- start

    cd ..
    pm2 list
}

git pull
installModules
configure
migrate
buildThem
startServices


echo "Done!"
