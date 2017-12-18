var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// array mimetypes
var mimeType = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : "image/jpg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
}

// create server
http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('loading'+uri);
	var stats;

	try {
		stats = fs.lstatSync(fileName);
	}catch(e) {
		res.writeHead(404,{'Content-Type': 'text/plain'});
		res.write('404 not found\n');
		res.end();
		return;
	}

	if(stats.isFile()){
		var mimet = mimeType[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200,{'Content-Type': mimet});
		var filestream = fs.createReadStream(fileName);
		filestream.pipe(res);
	}
	else if(stats.isDirectory()){
		res.writeHead(302,{ 'location': 'register.html'});
		res.end();
	}
	else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('internal error\n');
		res.end();
	}
}).listen(5000, '127.0.0.1');