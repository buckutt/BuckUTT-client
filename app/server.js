var http = require('http'),
httpProxy = require('http-proxy');
var static = require('node-static');

var file = new static.Server('./public');

var proxy = httpProxy.createProxyServer();
http.createServer(function(req,res){
	toAPI(req,res);
}).listen(8082);

function toAPI(req, res) {
	var urlContent = req.url.split('/');
	if(urlContent[1] == 'api') {
		proxy.web(req, res, {
			target: 'http://127.0.0.1:8081'
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