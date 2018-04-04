<template>
	<div class="sys-wrap">
		<div class="sys-msg" v-if="type == 'login' ">
			{{msg}} 加入群聊
		</div>
		<div class="sys-msg" v-if="type == 'logout' ">
			{{msg}} 退出群聊
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		data(){
			return {
			}
		},
		props:['msg','type']
	}
</script>
<style lang='less'>
	.sys-wrap{
		/*background-color: #fff;*/
		padding: 3px;
		display: flex;
		justify-content: center;
		align-items: center;
		.sys-msg{
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgba(0,0,0,0.05);
			border-radius: 10px;
			min-width: 40%;
			color: #999;
			font-size: 12px;
			padding: 3px;
		}

	}
</style>