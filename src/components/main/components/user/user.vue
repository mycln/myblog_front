<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <!-- <Avatar :src="userAvator"/> -->
        <span style="color: #19be6b">{{userName}}</span>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="changepass">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import './user.less'
import { mapActions } from 'vuex'
import Axios from 'axios'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.$store.commit('setAvator', '');
      this.$store.commit('setUserName','');
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({
        name: 'login'
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    changePass(){
      this.$emit('childEvent',true);
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'changepass': this.changePass()
          break
      }
    },
  }
}
</script>
