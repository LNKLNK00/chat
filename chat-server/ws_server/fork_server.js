var process = require('process');

var io = require('socket.io')();

//在线用户数
var onlineCount = 0;

var redis = require('redis');
var redisClient = redis.createClient;
var pub = redisClient(6379, '127.0.0.1');
var sub = redisClient(6379, '127.0.0.1');

var roomSet = {};


//获取父进程传递端口
var port = parseInt(process.argv[2]);
// var roomid = null;

io.on('connection', function(socket) {

	//客户端请求ws URL:  http://127.0.0.1:6001?roomid=k12_webcourse_room_1
	//var roomId = socket.handshake.query.roomId;
	//var roomId = null;

	//用户进入房间
	socket.on('login', function(data) {
		var roomId = data.roomId;
		console.log('新用户连接服务，pid: ' + process.pid + ' 房间号: ' + roomId);
		//加入房间
		socket.join(roomId); 

		//如果房间不存在，则创建该房间
		if (!roomSet[roomId]) {
			roomSet[roomId] = {};
			console.log('创建房间' + roomId);
			sub.subscribe(roomId);
		}

		if(!roomSet[roomId][data.userId]){
			reportConnect();
		}
		
		roomSet[roomId][data.userId] = data;
		console.log(data.userName + ' 进入房间, 客户端IP: ' + socket.client.conn.remoteAddress);
		pub.publish(roomId, JSON.stringify({
			"event": 'login',
			"data": {
				"onlineUsers": roomSet[roomId],
				"onlineCount": Object.keys(roomSet[roomId]).length,
				"user": roomSet[roomId][data.userId]
			}
		}));
	});

	//用户发消息
	socket.on('message', function(data) {
		console.log("接收消息: " + data);
		pub.publish(data.roomId, JSON.stringify({
			"event": 'message',
			"data": data
		}));
	});

	//用户修改信息
	socket.on('changeUserInfo', function(data) {
		console.log("用户修改信息: " + data);

		roomSet[data.roomId][data.userId] = data;
		
		pub.publish(data.roomId, JSON.stringify({
			"event": 'changeUserInfo',
			"data": data
		}));
	});


	socket.on('logout', function(data) {
		var roomId =  data.roomId;
		onlineCount--;
		console.log('用户退出房间，进程pid: ' + process.pid + ' 在线用户数:' + onlineCount);
		process.send({
			cmd: 'client logout'
		});

		if (roomSet[roomId] && roomSet[roomId][data.userId] && roomSet[roomId][data.userId].userId) {
			console.log(roomSet[roomId][data.userId].userName + ' 退出房间');

			delete roomSet[roomId][data.userId];

			pub.publish(roomId, JSON.stringify({
				"event": 'logout',
				"data": {
					"onlineUsers": roomSet[roomId],
					"onlineCount": Object.keys(roomSet[roomId]).length,
					"user": data
				}
			}));
		}
		

	});
});

/**
 * 订阅redis 回调
 * @param  {[type]} channel [频道]
 * @param  {[type]} count   [数量]  
 * @return {[type]}         [description]
 */
sub.on("subscribe", function(channel, count) {
	console.log('进程pid: ' + process.pid + ' 订阅频道: ' + channel);
});


/**
 * 接收订阅频道的消息
 * [description]
 * @param  {[type]} channel  [description]
 * @param  {[type]} message
 * @return {[type]}          [description]
 */
sub.on("message", function(channel, message) {
	console.log("消息频道： " + channel + "消息: " + message);
	message = JSON.parse(message);
	//将消息推送给房间内所有人
	var event = message.event;
	if(event === "login"){
		io.to(channel).emit('login', message.data);
	}else if(event === "message"){
		io.to(channel).emit('message', message.data);
	}else if(event === "changeUserInfo"){
		io.to(channel).emit('changeUserInfo', message.data);
	}else if(event === "logout"){
		io.to(channel).emit('logout', message.data);
	}
});

/**
 * 上报连接到master进程 
 * @return {[type]} [description]
 */
var reportConnect = function() {
	onlineCount ++;
	console.log('用户进入房间，进程pid: ' + process.pid + ' 在线用户数:' + onlineCount);
	process.send({
		cmd: 'client login'
	});
};


io.listen(port);

console.log('开启进程pid: ' + process.pid + ' 监听端口:' + port);