define(['jquery', 'socketio', 'chat/frontend'], function($, io, frontend) {
    var socket; // Socket
    var room; // Room
    var messageReceivedCallback;

    frontend(chat, messageEntered, function chatReceived(callback) {
        messageReceivedCallback = callback;
    });

    function chat() {
        if (socket) {
            return;
        }

        socket = io.connect('http://localhost:3000');
        socket.on('connect', function() {
            // socket connected
            console.log('connected');

            // Check if room is provided
            var loc = window.location.hash.indexOf('iris-room=');
            if (loc > -1) {
                var start = loc + 'iris-room='.length;
                var room = window.location.hash.slice(start, start + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.length);
                console.log(room);
                socket.emit('subscribe', {room: room});
            } else {
                socket.emit('subscribe');
            }

            
        });
        socket.on('start', function(data) {
            console.log(data);
            room = data.room;
            // server emitted a custom event
        });
        socket.on('chat', function(data) {
            console.log(data);
            messageReceived(data.message);
        });
        socket.on('disconnect', function() {
            // socket disconnected
            console.log('yoconnected');
        });
    }

    function messageEntered(message) {
        socket.emit('chat', {
            message: message,
            room: room
        });
    }

    function messageReceived(message) {
        messageReceivedCallback(message);
    }
});