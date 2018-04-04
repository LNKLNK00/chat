var fork = require('child_process').fork;

var cupNum = require('os').cpus().length,
	workerArr = [],
	roomInfo = [];
var connectNum = 0;

for (var i = 0; i < cupNum; i++) {
	workerArr.push(fork('./fork_server.js', [6001 + i]));

	workerArr[i].on('message', function(msg) {
		if (msg.cmd && msg.cmd === 'client login') {
			connectNum++;
			console.log('服务端连接数:' + connectNum);
		}
		if (msg.cmd && msg.cmd === 'client logout') {
			connectNum--;
			console.log('服务端连接数:' + connectNum);
		}
	});


}