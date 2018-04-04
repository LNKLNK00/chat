import io from 'socket.io-client'
const CHAT={
	msgObj:document.getElementsByClassName("body-wrapper")[0],
	user:{
		roomId:null,
		userName:null,
		userId:null,
		color:null,
		wechat:null,
	},
	socket:null,
	onlineCount:0,
	onlineUsers:null,
	msgArr:[],
	//让浏览器滚动条保持在最低部
	scrollToBottom:function(){
		// window.scrollTo(0, 900000);
	},
	login:function(user){
		this.socket.emit('login', user);
	},
	//退出，本例只是一个简单的刷新
	logout:function(){
		this.socket.emit('logout', this.user);
		localStorage.removeItem('USER')
		this.socket.disconnect();
	},
	//提交聊天消息内容
	submit:function(msg){
		if(msg != ''){
			let obj = {
				userId: this.user.userId,
				roomId: this.user.roomId,
				userName: this.user.userName,
				msg: msg,
				color: this.user.color
			};
			this.socket.emit('message', obj);
		}else{
			console.log('msg is null')
		}
		
		return false;
	},
	changeInfo(){
		this.socket.emit('changeUserInfo', this.user);
	},
	init:function(){
		/*
		客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
		实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
		*/

		this.user = JSON.parse(localStorage.getItem('USER'));
		
		//连接websocket后端服务器
		this.socket = io.connect('http://192.168.30.229:3000');

		if (this.user && this.user.userId) {
			CHAT.login(this.user);
		}
		//心跳包，30s左右无数据浏览器会断开连接Heartbeat
		setInterval(() => {
			this.socket.emit('heartbeat', 1);
		},10000)

		//监听新用户登录
		this.socket.on('login', function(obj){
			//当前在线用户列表
			CHAT.onlineUsers = obj.onlineUsers;
			//当前在线人数
			CHAT.onlineCount = obj.onlineCount;
			let message = {
				login: true,
				user: obj.user
			};
			CHAT.msgArr.push(message);	
		});
		
		this.socket.on('changeUserInfo', function(obj){
			CHAT.onlineUsers[obj.userId] = obj
		});

		//监听用户退出
		this.socket.on('logout', function(obj){
			//当前在线用户列表
			CHAT.onlineUsers = obj.onlineUsers;
			//当前在线人数
			CHAT.onlineCount = obj.onlineCount;

			let message = {
				logout: true,
				user: obj.user
			};
			CHAT.msgArr.push(message);
		});
		
		//监听消息发送
		this.socket.on('message', function(obj){
			CHAT.msgArr.push(obj);	
		});

	}
}	
export default CHAT