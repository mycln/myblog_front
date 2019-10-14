<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-name="userName" :message-unread-count="unreadCount" :user-avator="userAvator" @childEvent="parentMethod"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Modal v-model="modal1" title="修改密码" width="800px">
      <Form :rules="updateRules" :model="update" ref="update">
          <Row>
              <i-col span="16">
              <Form-item label="旧密码" :label-width="100" prop="oldPass">
                  <Input type="password"  v-model="update.oldPass" placeholder="请输入旧密码"/>
              </Form-item>
              </i-col>
              <i-col span="16">
              <Form-item label="新密码" :label-width="100" prop="newPass">
                  <Input type="password"  v-model="update.newPass" placeholder="请输入新密码"/>
              </Form-item>
              </i-col>
              <i-col span="16">
              <Form-item label="确认密码" :label-width="100" prop="newPass2">
                  <Input type="password"  v-model="update.newPass2" placeholder="请输入确认密码"/>
              </Form-item>
              </i-col>
          </Row>
      </Form>
      <div slot="footer">
          <Button type="text" size="large" @click="modal1=false">取消</Button>
          <Button type="primary" size="large"  @click="changeSubmit">确定</Button>
      </div>
  </Modal> 
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      /**
       * @description 修改密码需要的参数
       */
      modal1: false,
      update:{
        id:"",
        oldPass:"",
        newPass:"",
        newPass2:"",
     },
     updateRules:{
        newPass2:[
            { required: true, validator: this.myValidator2, trigger: 'blur' }
        ],
        oldPass:[
            { required: true, message: '旧密码不能为空', trigger: 'blur' },
            { required: true,max:15, message: '旧密码不能超过15个字符', trigger: 'blur' }
        ],
        newPass:[
            { required: true, validator: this.myValidator, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    userName () {
      return this.$store.state.user.userName
    },
    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    },
    menuList () {
      return this.$store.state.app.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    /**
     * @description 修改密码相关的method
     */
    myValidator(rule, value, callback){
                let update = this.update
                if(update.newPass == ""){
                    callback(new Error('新密码不能为空'))
                }else if(update.newPass.length<6){
                    callback(new Error('新密码不能少于6位'))
                }else if(update.newPass.length>15){
                    callback(new Error('新密码不能大于15位'))
                }else if(update.newPass == update.oldPass){
                    callback(new Error('新密码和旧密码不能相同'))
                }else{
                    callback()
                }
            },
            myValidator2(rule, value, callback){
                let update = this.update
                if(update.newPass2==""){
                    callback(new Error('确认密码不能为空'))
                }else if(update.newPass2 != update.newPass){
                    callback(new Error('新密码和确认密码不相同'))
                }else{
                    callback()
                }
            },
    changeSubmit(){
      this.$refs.update.validate((valid)=>{
        if(valid){
            let form = {
                oldPass:this.update.oldPass,
                newPass:this.update.newPass,
            }
            this.$axios.post(this.$GLOBAL.S0205,this.$qs.stringify(form))
            .then(res=>{
                if(res.data.code == 0){
                    this.$Message.success("修改成功")
                    this.modal1 = false
                }else{
                    this.$Message.error(res.data.message)
                }
            })
        }
      })
    },
    parentMethod(msg) {
      if(msg == true){
          this.modal1 = true
       }
      },
    /**修改方法end */
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
