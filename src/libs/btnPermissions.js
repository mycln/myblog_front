import Vue from 'vue'
/**权限指令**/
const has = Vue.directive('has', {
 bind: function (el, binding, vnode) {
  let className = binding.value.class;
  // 获取按钮权限
  if(vnode.context.$route.meta.btnPermissions!=null && vnode.context.$route.meta.btnPermissions!="" && vnode.context.$route.meta.btnPermissions!=undefined){
      if(vnode.context.$route.meta.btnPermissions=='all'){
          el.parentNode.appendChild(el);
      }else{
          let btnPermissions = vnode.context.$route.meta.btnPermissions.split(",");
          if(btnPermissions.indexOf(className) > -1 ){
            el.parentNode.appendChild(el);
          }else{
            el.parentNode.removeChild(el);
          }
      }  
    }else{
      el.parentNode.removeChild(el);
   }
//   if (!Vue.prototype.$_has(btnPermissions)) {
//    el.parentNode.removeChild(el);
//   }
 }
});
// 权限检查方法
Vue.prototype.$_has = function (value) {
 let isExist = false;
 let btnPermissionsStr = sessionStorage.getItem("btnPermissions");
 if (btnPermissionsStr == undefined || btnPermissionsStr == null) {
  return false;
 }
console.log(btnPermissionsStr)
console.log(value.indexOf(btnPermissionsStr))
 if (value.indexOf(btnPermissionsStr) > -1) {
  isExist = true;
 }
 return isExist;
};
export {has}
