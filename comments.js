// Create web server
// Usage: node comments.js

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var comments = [];

var server = http.createServer(function(req, res) {
    var urlParsed = url.parse(req.url, true);
    console.log(urlParsed);

    if (urlParsed.pathname == '/echo' && urlParsed.query.message) {
        res.setHeader('Cache-control', 'no-cache');
        res.end(urlParsed.query.message);
    } else if (urlParsed.pathname == '/comments' && req.method == 'GET') {
        res.setHeader('Cache-control', 'no-cache');
        res.end(JSON.stringify(comments));
    } else if (urlParsed.pathname == '/comments' && req.method == 'POST') {
        var body = '';

        req.on('readable', function() {
            var buf = req.read();
            if (buf != null) {
                body += buf;
            }
        });

        req.on('end', function() {
            var params = querystring.parse(body);
            comments.push(params);
            res.end('ok\n');
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found\n');
    }
});

server.listen(1337, '