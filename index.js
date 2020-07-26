var app = require('express')();
const path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;

var userCnt = 0;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/style.css', (req, res) => {
	res.sendFile(__dirname + '/style.css');
});
app.get('/canvas.js', (req, res) => {
	res.sendFile(__dirname + '/canvas.js');
});

io.on('connection', (socket) => {
	userCnt += 1;
	room = userCnt;
	socket.join(room);
	io.to(room).emit('pass', room);
	socket.on('pass', (pass) => {
		socket.join(pass);
		room = pass;
		socket.emit('pass', pass);
	});
		
	socket.on('move', (point) => {
		socket.to(point.id).emit('move', point);
	});
});

http.listen(PORT, () => {
	console.log('listening on *:3000');
});

