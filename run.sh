
version=`date "+%Y%m%d"`

node ./build/build-index.js $version

node ./build/build-css.js 
