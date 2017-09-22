Fontmoa Fonteditor
==========

TTF 포맷 기반의 폰트 에디터 입니다. 

https://github.com/ecomfe/fonteditor 를 기반으로 편집하는 방식을 재구성하고 필요한 ttf  관련된 스펙을 재작성하는 방식으로 구성되었습니다. 

[한글](http://www.fontmoa.com/editor/v1/simple.html), [English](http://www.fontmoa.com/editor/v1/simple-en.html), [线上地址](http://www.fontmoa.com/editor/v1/simple-cn.html)  3가지 버전이 존재합니다. 


### 설치 및 실행 

* clone

```
git clone https://github.com/fontmoa/fonteditor
```

* install 

```
npm install -g edp 
```

* run server 

```
npm run start 
```

* build 

기본 html 파일이 템플릿 형태로 되어 있기 때문에  바로 사용하실 수가 없습니다. 항상 빌드를 통해서생성된 html 만 로드하실 수 있습니다. 

```
npm run build 
or
npm run build-index
npm run build-css 

```

### 제공하는 기능들

* TTF 폰트 에디터 
* TTF 기반으로 WOFF, SVG, EOT 웹폰트 생성 
* 만들어진 폰트 미리보기 기능
* 초보자를 위한 Simple 모드와 전문가를 위한 Advanced Mode 지원 
* 기존 ttf 폰트 불러오기 
* SVG 파일 폰트로 불러오기 
* 아이콘 폰트 만들때 글자 이름으로  CSS 생성해주기 
* bitmap 이미지를 벡터형태로 변환해서 글자로 만들어주기 
* 한글 자소 템플릿 생성 (230 자 정도)
* 자소 템플릿으로 한글 11,172 자 전체 문자 만들어주기  

### 아이콘 폰트 만들기 

다양한 디바이스를 대응하기 위해 최근 아이콘 폰트를 많이 사용하게 되는데 아이콘 폰트는  특정 유니코드에  글자의 이름이 있고 그 글자의 이름으로  css  를 만들어주어서 해당 유니코드가 표현되게 하는 기법이다. 

폰트 에디터에서도 동일하게 글자마다 이름을 줄 수 있고  특정 유니코드를 지정해놓고  css  까지 모두 만들어준다. 


### 한글 자소 템플릿과  11,172 한글 글자 만들기 

http://learning.hangeul.go.kr/write/theory/

한글은 초성 + 중성 또는  초성 + 중성 + 종성으로 이루어진다. 

한글 폰트를 만들기 위해서는 11,172 자의 많은 글자를 그려야 하는 부분이 있는데 자소 템플릿을 만들어  11,172 자의 글자를 좀 더 쉽게 만들 수 있는 방식을 제공한다.  

### Manual 

에디터 사용방법은 메뉴얼을 참고해주세요. 

https://fontmoa.gitbooks.io/fontmoa-fonteditor/


### 관련링크 

* [fonteditor](https://github.com/ecomfe/fonteditor)


### LICENSE 

Code released under the MIT License. 

