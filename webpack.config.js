const { resolve } = require('path') //把路径改为绝对路径
const autoprefixer  = require('autoprefixer') // 兼容性前缀
const  HtmlWebpackPlugin  = require('html-webpack-plugin')  

/* 
  一般情况下，loader不用引进来，plugin需要引进来

*/

module.exports = {
  // 模式： 开发、生产
  mode:'development',
  // source-map
  devtool:'source-map',
  optimization:{
    minimize:false
  },
  // 多文件入口 多页面就需要用{}括起来，单页面就直接写
  entry:{
    // resolve可以将相对路径改成绝对路径，__dirname当前路径
    index:resolve(__dirname,'./src/js/index.js'),
    detail:resolve(__dirname,'./src/js/detail.js'),
    collections:resolve(__dirname,'./src/js/collections.js')
  },
  // 输出的路径
  output:{
    // 输出路径
    path:resolve(__dirname,'./dist/'),
    // 打包后的文件名
    filename: 'js/[name].js' 
    //在dist文件夹下面的js下的[变量名]，其实其实就是入口文件的文件名
  },
  // 模块设置
  module:{
    // 模块的匹配规则
    rules:[
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude:resolve(__dirname,'node-modules'),//打包过程中，需要忽略的文件
        query:{
          'presets':['latest']
        }
      },
      {
        test:/\.tpl$/,
        loader:'ejs-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer('last 5 versions')];
              }
            }
          }
        ]
      },
      {
        test:/\.scss$/, //放多个loader
        use:[
          'style-loader',//把解析的css放入HTML页面中
          /* {
            // 将解析的css单独做成一个文件
            loader:miniCssExtractPlugin.loader,
            options:{
              // 配置：在开发环境下，进行css热更新
              hmr: process.env.NODE_ENV === 'development'
            }
          }, */
          'css-loader',
          {
            loader:'postcss-loader',  //加兼容性前缀
            options:{ //配置插件
              plugins:function(){
                return [autoprefixer('last 5 version')]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test:/\.(png|jpg|jpeg|gif|ico|woff|eot|svg)$/i,
        loader:'url-loader?limit=1024&name=img/[name]-[hash:16].[ext]'
        // 图片小于1024以下的，转化成base64格式
        //大于1024时 name=img/[name]-[hash:16].[ext]  打包后的图片放在img下，
        // 名字是由本身的名字+"-"16位哈希值+"."+本身的文件后缀
      }
    ]
  },
  // 插件处理  即配置
  plugins:[
    // new unglify(), 对文件进行压缩丑化处理
    /* 
    //当需要将解析出来的css单独放一个文件的话，除了上面的loader配置，plugin也要进行如下配置
    new miniCssExtractPlugin({
      filename:'CSS/[name].css',//文件名称
    }), */
    new HtmlWebpackPlugin({//对HTML页面进行配置
      filename:'index.html',//HTML页面的名称 
      template:resolve(__dirname,'src/index.html'),//在哪里找到这个打包的模板
      title:"新闻头条",//就是HTML里的标题   可以配合ejs使用 htmlWebpackPlugin.options.title
      chunks:['index'],
      chunksSortMode:'manual',
      //当有多个页面组件(模块)需要引入时，就需要排序。webpack会根据上面的chunks里的数组，从左到右进行排序
      excludeChunks:['node_modules'],//排除哪些模块
      hash:true,//防止缓存用的 
      minify:{//对文件进行压缩
        removeComments:true,//删除所有注释
        collapseWhitespace:true//把所有的空格换行都去掉
      }
    }),
    new HtmlWebpackPlugin({
      filename:'detail.html',
      template:resolve(__dirname,'src/detail.html'),
      title:"新闻详情",
      chunks:['detail'],
      chunksSortMode:'manual',
      excludeChunks:['node_modules'],
      hash:true,
      minify:{
        removeComments:true,
        collapseWhitespace:true
      }
    }),
    new HtmlWebpackPlugin({
      filename:'collections.html',
      template:resolve(__dirname,'src/collections.html'),
      title:"我的收藏",
      chunks:['collections'],
      chunksSortMode:'manual',
      excludeChunks:['node_modules'],
      hash:true,
      minify:{
        removeComments:true,
        collapseWhitespace:true
      }
    })
  ],
  // 开发服务器的配置
  devServer:{
    watchOptions:{
      ignored:'/nede_modules/'
    },
    open:true,//运行的时候打开浏览器
    host:'localhost',
    port:3000
  }
}