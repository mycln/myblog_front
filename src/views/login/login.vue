<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Main from '@/components/main'
import LoginForm from '_c/login-form'
import routers from '@/router/routers'
import lazyLoading from '@/common/lazyLoading.js';
import { mapActions } from 'vuex'
import {initRouter} from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  data(){
      return {
        form: {
                username: '',
                pass: ''
            },
      }
  },
  methods: {
   /**
    * @param data 要得到的数据
    * @param data5 每次的children 数据
    * @param isRoot 是否是根节点
    * @description 深度优先遍历
    */
    deepTraversal (data, data5,isRoot) {
      if (data) {
        if(isRoot){
            if(data.nodes){//一级菜单
                    data5.push(
                        {
                        "path":data.code,
                        "meta":{
                            "icon":data.menuIcon,
                            "title":data.menuName,
                            "ismenu":data.ismenu,
                        },
                        "name":data.code,
                        "component":"main",
                        "children":[],
                        }
                    )
            }else{
                    data5.push(
                        {
                        "path":data.code,
                        "meta":{
                            "icon":data.menuIcon,
                            "title":data.menuName,
                            "ismenu":data.ismenu,
                        },
                        "name":data.code,
                        "component":"main",
                        "children":[
                            {
                                "path": data.code,
                                "meta":{
                                    "title":data.menuName,
                                    "icon":data.menuIcon,
                                    "ismenu":data.ismenu,
                                },
                                "name":data.menuUrl.split("/").length==0?data.menuUrl:data.menuUrl.split("/")[1],
                                "component":data.menuUrl,
                                "btnPermissions":data.btnPermissions,    
                            }
                        ],
                        }
                    )
            }
        }else{//不是根节点
            data5.push(
                {
                    "path": data.code,
                    "meta":{
                        "title":data.menuName,
                        "icon":data.menuIcon,
                        "ismenu":data.ismenu,
                    },
                    "name":data.code,
                    "component":data.menuUrl,
                    "btnPermissions":data.btnPermissions,
                    "children":[],
                }
            )
        }
       
        if (data.nodes && data.nodes.length > 0) {
          var children = data.nodes
          for (var i = 0; i < children.length; i++) {
            //每次递归的时候将需要遍历的节点和节点所存储的数组传下去
            let noRoot =  false
            if(children[i].ismenu == 1){
                this.deepTraversal(children[i], data5[data5.length - 1].children,noRoot)
            }
          }
        }
      }
      return data5
    },
   /**
    * @description 登录 保存菜单到sessionStorge
    * 注意是当为一级菜单的时候menurl 必须有/
    */
   handleSubmit ({ userName, password }) {
      this.form.username = userName
      this.form.pass = password
      this.$axios.post(this.$GLOBAL.C01,
          this.$qs.stringify(this.form)
      ).then((res)=>{
        if(res.data.code== 0){
            let loginData = {
            username: this.form.username,
            apiAuth: res.data.content,
        }
        let router = [];
        if(res.data.content.userMenus!=null){
            let menus  = res.data.content.userMenus
            for(var j=0;j<menus.length;j++){//调用递归生成菜单
                if(menus[j].nodes){
                    let nodes = menus[j].nodes.filter(item =>item.ismenu==1)
                     menus[j].nodes=nodes
                }
                this.deepTraversal(menus[j],router,true)
            }
    }
    // 调用方法，动态生成路由
    sessionStorage.setItem('menu',JSON.stringify(router))
    // 调用方法，动态生成路由
    initRouter(this);
    sessionStorage.setItem('username',this.form.username)
    // sessionStorage.setItem('pass',this.form.pass)
    // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg')
    this.$store.commit('setUserName',this.form.username)
    // this.$store.commit('login', loginData);
    sessionStorage.setItem("apiAuth", res.data.content.token);
    this.$router.push({
        name: 'home'
    });
    }else{
        this.$Message.error(res.data.message);
    }
        })
    }
  }
}
</script>

<style>

</style>
