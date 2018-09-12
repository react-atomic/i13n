#!/bin/sh


conf='{"resetVendor":[]}'

production(){
    echo "Production Mode";
    npm run build
    CONFIG=$conf NODE_ENV=production webpack -p --optimize-minimize
}

analyzer(){
    echo "Analyzer Mode";
    npm run build
    CONFIG=$conf BUNDLE='{}' webpack
}

develop(){
    echo "Develop Mode";
    npm run build
    CONFIG=$conf webpack
}


case "$1" in
  p)
    production
    ;;
  a)
    analyzer 
    ;;
  *)
    develop
    exit
esac

exit $?
