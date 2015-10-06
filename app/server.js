var http = require('http'),
httpProxy = require('http-proxy');
var static = require('node-static');
var config = require('./config.json');

var file = new static.Server('./app/public');

var proxy = httpProxy.createProxyServer();
http.createServer(function(req,res){
	toAPI(req,res);
}).listen(config.port);

function toAPI(req, res) {
	var urlContent = req.url.split('/');

	var path = urlContent.slice(2,urlContent.length).join('/');

	if(urlContent[1] == config.backend.requiredPath) {
		req.url = req.url.replace(config.backend.requiredPath, config.backend.path);
		proxy.web(req, res, {
			target: 'http://'+config.backend.host+':'+config.backend.port
		}, function(e) {
			console.log("Connection to API failed");
		});
	} else if(urlContent[1] == config.pay.requiredPath && (config.pay.whitelist.length == 0 || config.pay.whitelist.indexOf(path) > -1)) {
		req.url = req.url.replace(config.pay.requiredPath, config.pay.path);
		proxy.web(req, res, {
			target: 'http://'+config.pay.host+':'+config.pay.port
		}, function(e) {
			console.log("Connection to pay failed");
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
