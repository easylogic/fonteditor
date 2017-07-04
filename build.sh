#!/bin/bash

# 时间戳
version=`date "+%Y%m%d"`

# build首页版本
build_index() {
    node "./build/build-index.js" $version
}

# build静态资源
build_asset() {
    edp build --stage=release --force
    if [ $? != 0 ]; then
        echo "edp build failed!"
        exit 1
    fi
    echo "asset path：./release"
}


# 移动文件到指定目录
move_asset() {
    mv ./release/src ./release/$version

    cat ./release/index.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/index.html.tmp
    mv ./release/index.html.tmp ./release/index.html

    cat ./release/simple.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/simple.html.tmp
    mv ./release/simple.html.tmp ./release/simple.html

    cat ./release/index-en.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/index-en.html.tmp
    mv ./release/index-en.html.tmp ./release/index-en.html

    cat ./release/simple-en.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/simple-en.html.tmp
    mv ./release/simple-en.html.tmp ./release/simple-en.html

    cat ./release/index-cn.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/index-cn.html.tmp
    mv ./release/index-cn.html.tmp ./release/index-cn.html

    cat ./release/simple-cn.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/simple-cn.html.tmp
    mv ./release/simple-cn.html.tmp ./release/simple-cn.html

    cat ./release/editor.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/editor.html.tmp
    mv ./release/editor.html.tmp ./release/editor.html
}

build_index
build_asset
move_asset
