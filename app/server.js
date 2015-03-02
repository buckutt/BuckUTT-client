var static = require('node-static');
var http = require('http');

var file = new static.Server('./public');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response, function (err, result) {
            if (err) {
            	var urlContent = request.url.split('/');
            	if(urlContent[1] == 'api') {
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    http.get("http://127.0.0.1:8081"+request.url, function(api_res) {
                        var body = '';
                        api_res.on('data', function(d) {
                            body += d;
                        });
                        api_res.on('end', function() {
                            response.end(body);
                        });
                    });
            	} else {
    	            console.log("Error serving " + request.url + " - " + err.message);

    	            response.writeHead(err.status, err.headers);
    	            response.end("Error");
                }
            }
        });
    }).resume();
}).listen(8082);