## 文件目录说明

### 文件说明：

>1. `plugin.json`  --uTools项目配置
>2. `index.html`   --不使用uTools默认的模板配置文件，而是在【plugin.json】中使用此模板，定制化自己的uTools页面
>3. `index.js`     --Vue的入口文件，相当于vue项目的main.js，初始化vue项目
>4. `preload.js`   --当你在 plugin.json 中配置了 preload 属性，将载入对应的预加载脚本，它是一个特殊且单独的文件，不需要与其他业务代码编译在一起，在此文件中可以访问 nodejs、electron、uTools 提供的 api，并挂载到 window 对象中，你其他的普通 javascript 代码就可以访问这些 api。

### 文件夹说明

>1. `lib文件夹`    --里面放入外部引入的依赖文件(也可以自己npm下载)，这里直接从官网下载对象的js文件放到这里，主要用到vue.js
>2. `model文件夹`  --里面放置自己封装的uTools初始化DB数据库的js代码
>3. `utils文件夹`  --里面放置自己封装的工具函数
>4. `views文件夹`  --里面放置vue组件，定制化界面的
>5. `config文件夹` --里面放置项目通用配置，一些常见的需要统一修改的数据就放到这里面，方便统一修改

