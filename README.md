# base_front
vue 后台管理系统脚手架 

#### 安装
```push
npm install
```
### 运行项目项目之前
1：脚手架兼容ie9 以上的版本 在项目中尽量避免location.href 
2: 脚手架所有请求api 都在libs下global.js文件中对应的是接口编号;
    并修改config下url.js中的默认项目接口请求前缀
3：项目打包时候请修改根目录下vue.config.js  BASE_URL常量
### 运行

#### 测试运行
```push
npm run dev
```

#### 打包编译
```push
npm run build
```