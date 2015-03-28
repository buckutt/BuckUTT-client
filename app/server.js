var http = require('http'),
httpProxy = require('http-proxy');
var static = require('node-static');
var config = require('./config.json');

var file = new static.Server('./public');

var proxy = httpProxy.createProxyServer();
http.createServer(function(req,res){
	toAPI(req,res);
}).listen(config.port);

function toAPI(req, res) {
	var urlContent = req.url.split('/');
	if(urlContent[1] == config.backend.path) {
		proxy.web(req, res, {
			target: config.backend.host+':'config.backend.port
		});
	} else {
		file.serve(req, res, function (err, result) {
			if(err) {
				res.writeHead(err.status, err.headers);
				res.end("Error");
			}
		});
	}
}