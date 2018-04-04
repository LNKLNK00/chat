<template>
  <div class="head-wrapper">
    <div class="-left">
      <div>
        <i class="iconfont icon-back">返回</i>
      </div>
    </div>
    <div class="-mid">
      <p class="group-name" v-if="CHAT.user">房间号:{{CHAT.user.roomId}} ({{CHAT.onlineCount}})</p>
    </div>
    <div class="-right"  v-link="'/groupinfo'">
      <i class="iconfont icon-group"></i>
    </div>
    
  </div>
</template>

<script>
import Login from './login'
import CHAT from '../api/client'
export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: '',
      CHAT:CHAT,

    }
  },
  updated(){
  },
  components: {
    Login
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.head-wrapper{
  background-color: #34352c;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;

  .-left{
    display: flex;
    flex-shrink: 0;
    height: 100%；
    width；70px;
    min-width: 70px;
    align-items: center;
    justify-content: space-around;
    .icon-back{
      font-size: 14px !important;
      color: #fff;
    }
  }
  .-mid{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
  }
  .-right{
    display: flex;
    align-items: center;
    height: 100%;
    width: 50px;
    justify-content: center;
    .icon-group{
      font-size: 30px !important;
      color: #fff;
    }
  }
}
</style>