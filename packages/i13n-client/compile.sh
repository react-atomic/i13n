#!/bin/sh
DIR="$( cd "$(dirname "$0")" ; pwd -P )"

conf='{"resetVendor":[], "maxChunks": 1}'
webpack='npm run webpack --'

production(){
    echo "Production Mode";
    npm run build
    CONFIG=$conf NODE_ENV=production $webpack 
    mkdir -p dist
    cp assets/simple.bundle.js dist/simple.js 
}

analyzer(){
    echo "Analyzer Mode";
    npm run build
    CONFIG=$conf BUNDLE='{}' $webpack
}

develop(){
    echo "Develop Mode";
    npm run build
    CONFIG=$conf $webpack
}

startServer(){
    echo "Start server";
    npm run start
}

killBy(){
    ps auxwwww | grep $1 | grep -v grep | awk '{print $2}' | xargs -I{} kill -9 {}
}

stop(){
    DIR="$( cd "$(dirname "$0")" ; pwd -P )"
    killBy ${DIR}/node_modules/.bin/babel 
}

watch(){
    stop 
    npm run build:cjs -- --watch &
    npm run build:es -- --watch &
}


case "$1" in
  watch)
    watch 
    ;;
  stop)
    stop 
    ;;
  p)
    production
    ;;
  a)
    analyzer 
    ;;
  s)
    startServer 
    ;;
  *)
    develop
    exit
esac

exit $?
