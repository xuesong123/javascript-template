var http = require("http");
var july = require("../../webserver.js");

/**
 * create webApplication
 */
var webApplication = july.WebApplicationFactory.create("localhost", "webapp", "/");
webApplication.start();

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.on("exit", function(){
    webApplication.shutdown();
});

var server = http.createServer(function(request, response){
    if(request.url == "/favicon.ico")
    {
        response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
        response.end();
        return;
    }

    webApplication.dispatch(request, response);
});

process.on("exit", function(){
    console.log("[Server]: Server stopping...");
    webServer.shutdown();
    console.log("[Server]: Server stopping...");
    server.close(function(){
        console.log("[Server]: Server stoped!");
    });
});

server.listen(80, "localhost");
console.log("[Server]: Server start on port: 80");