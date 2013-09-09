var http = require("http");
var july = require("../../webserver.js");
var webApplication = july.WebApplicationFactory.create("localhost", "app1", "/");
webApplication.start();

var server = http.createServer(function(request, response){
    if(request.url == "/favicon.ico")
    {
        response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
        response.end();
        return;
    }

    webApplication.dispatch(request, response);
});

server.listen(80, "localhost");
console.log("[Server]: Server start on port: 80");