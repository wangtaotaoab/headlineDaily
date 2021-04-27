import FastClick from './fastclick'

// 初始化fastclick

/* 
  window.addEventListener('load')用来监听

  整个文档的一个根就是,在DOM中可以使用document.documentElement来访问它，它就是整个节点树的根节点。而body是子节点，要访问到body标签，在脚本中应该写：document.body。
*/
window.addEventListener('load',function(){
   //页面的全部资源加载完后才会执行 包括 图片 视频等
   FastClick.attach(document.body);
},false)

document.documentElement.addEventListener('touchmove',function(){
  if(e.touches.leng > 1){
    e.preventDefault();
  }
},false);

document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px'; // 这里是获取屏幕宽度 / 3.75  也就是苹果6的宽度