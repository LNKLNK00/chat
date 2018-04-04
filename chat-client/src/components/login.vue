<template>
  <div class="login-wrapper" transition="loginslide">
    <div class="header">
      
    </div>
    <div class="body">
      <div class="-title">
        江湖聊天室
      </div>
      <div class="-name">
        <label>群昵称：</label>
        <input type="text" v-model="user.userName" placeholder="10字以内">
      </div>
      <div class="-name">
        <label>房间号：</label>
        <input type="text" v-model="user.roomId" placeholder="房间号">
      </div>
      <div class="-weichat">
        <label>微信号：</label>
        <input type="text"v-model="user.wechat" placeholder="方便私聊（选填）">
      </div>
      <div class="-login">
        <span class="-btn" @click="login()">登录</span>
      </div>
    </div>
    <div class="foot">

    </div>
  </div>
</template>

<script>
import CHAT from '../api/client'
import {randomColor,getUid} from '../util/index'
export default {
  data () {
    return {
      user:{
        roomId:null,
        userName:null,
        userId:null,
        color:null,
        wechat:null,
      },
    }
  },
  ready(){
    
  },
  methods:{
    login(){
      if (!this.user.userName.trim()) {
        alert("昵称不能为空！")
        return
      }
      if (!this.user.roomId.trim()) {
        alert("房间号不能为空！")
        return
      }
      this.user.userName = this.user.userName.slice(0,10)
      this.user.userId = getUid()
      this.user.color = randomColor()

      if (localStorage) {
        localStorage.setItem('USER',JSON.stringify(this.user))
      }
      this.$router.go('/')
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

.login-wrapper{
  background-color: #fff;
  position: absolute;
  top: 0;
  left: -100%;
  right: 100%;
  bottom: 0;
  .header{
    width: 100%;
    height: 30%;
    max-height: 300px;
    background: url(../assets/1.jpg);
    background-size: contain;
  }
  .body{
    display: flex;
    flex-direction: column;
    padding: 20px;
    .-title{
      height: 80px;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bolder;
      color: #999;
    }
    .-name,.-weichat{
      /*background-color: #eee;*/
      display: flex;
      height: 40px;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #999;
      border-top: solid 1px rgba(0,0,0,0.05);
      lable{
        color: #999;
      }
      input{
        box-sizing: border-box;
        height: 25px;
        border: none;
        outline: none;
        padding: 5px;
        color: #666;
        background-color: rgba(0,0,0,0.02);
      }
      

    }
    .-login{
      display: flex;
      height: 80px;
      align-items: center;
      font-size: 16px;
      color: #999;
      .-btn{
        background-color: #3CAF36;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        height: 40px;
        margin: 10px auto;
        color: #fff;
        font-weight: bolder;
      }
    }
  }
  .foot{
    /*position: absolute;
    bottom: 0;*/
    /*background-color: #098;*/
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 13px;
    color: #999;
    span{
      display: inline-block;
    }
    span:first-child{
      font-size: 15px;
    }
  }
  a{
    color: #999;
  }
}
/* 必需 */
.loginslide-transition {
  transition: all .3s ease;
  transform: translate(100%,0);
}

/* .loginslide-enter 定义进入的开始状态 */
/* .loginslide-leave 定义离开的结束状态 */
.loginslide-leave, .loginslide-enter {
  transform: translate(0%,0);
}
</style>