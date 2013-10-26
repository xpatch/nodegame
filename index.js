


var couchdb_ip = 'localhost';
var couchdb_port = 5984;

var amqp_ip = 'localhost';
var amqp_port = 5672;

var version = '1.0';
var listen_ip = '0.0.0.0';
var listen_tcp_port = 8080;
var socket_timeout_in_ms = 7000;

var subscribers = [];
var total_subscribers = 0;

var WebSocketServer = require('websocket').server;
var restify = require('restify');
var couchdb = require('couchdb-api');
var colors = require('colors');
var http = require('http');

var amqp = require('amqp').createConnection({ host: amqp_ip });

colors.setTheme({ info: 'green', help: 'cyan', warn: 'yellow', debug: 'blue', error: 'red' });

var cserver = couchdb.srv();
var db = cserver.db('users');



var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

server.listen( listen_tcp_port, function() {
	//console.log((new Date()) + ' Server is listening on port 8080');
	console.log("Game v0.0.1 "+listen_ip+":"+listen_tcp_port);
});


wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	console.log(origin);
	return true;
}


wsServer.on('request', function(request) {

	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}
    
	var connection = request.accept('echo-protocol', request.origin);


	console.log((new Date()) + ' ' + connection.remoteAddress + ' Connection accepted.');
	subscribers[connection.remoteAddress] = connection;
	//console.log(subscribers);


	connection.on('message', function(message) {

		if (message.type === 'utf8') {

			//console.log('Received Message: ' + message.utf8Data);
			
			if( message.utf8Data.indexOf('game.initState') == 0 ) {
				connection.sendUTF(JSON.stringify(initial_state));
			} else {
				var cData = JSON.parse( message.utf8Data );
				console.log( cData );





				if( cData.type != undefined && cData.type.indexOf('cmd') == 0 ) {
					//console.log("Executing command:"+cData.cmd);

					//child = exec(cData.cmd, function ( error, stdout, stderr ) {
				

					
				}
				//connection.sendUTF('{"empty":"garbage"}');
			}


		} else if (message.type === 'binary') {
			console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
			connection.sendBytes(message.binaryData);
		}

	});

	connection.on('close', function(reasonCode, description) {
		console.log((new Date()) + ' ' + connection.remoteAddress + ' disconnected.');
		delete subscribers[connection.remoteAddress];
	});
});











amqp_connection.addListener('ready', function() {
	console.log(amqp.serverProperties.product+" "+amqp_ip+":"+amqp_port);

	amqp_connection.exchange('nmapq', { type: 'topic',  confirm: false }, function(exchange) {
		console.log('Exchange ' +exchange.name+ ' is open');

		//auto que name generation
		amqp_connection.queue('', function (queue) {

			console.log('Queue ' + queue.name + ' is open');
			queue.bind( exchange, 'registration.success.*.*' );
			queue.subscribe( { ack: false }, function( json, headers, deliveryInfo, m ) {

				var reg = new Object();
				reg.user_agent = json['User-Agent'];
				reg.jsonAll = json;
				
				for( i in subscribers ) subscribers[i].send( JSON.stringify( reg ) );

			});
		});
	});
});















var rserver = restify.createServer();
rserver.use(restify.bodyParser());

rserver.post('/auth', function( req, res, next ) {

	var data = req.body;
	
	
	

});


