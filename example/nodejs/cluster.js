var fs = require("fs");
var path = require("path");
var http = require("http");
var july = require("../../webserver.js");

var webServer = july.Bootstrap.create("localhost|127\\.0\\.0\\.1", ".");
webServer.start();

function startServer()
{
    var server = (function(){
        return http.createServer(function(request, response){
            if(request.url == "/favicon.ico")
            {
                response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
                response.end();
                return;
            }
            webServer.dispatch(request, response);
        });
    })();

    server.listen(80, "localhost");
};

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.on("exit", function(){
    console.log("[Server]: Server stopping...");
    webServer.shutdown();
    // server.close();
    console.log("[Server]: Server stoped!");
});

var cluster = require("cluster");
var cpus = require("os").cpus().length;

console.log("cpus: " + cpus);

if(cluster.isMaster)
{
    // Fork workers.
    for(var i = 0; i < cpus; i++)
    {
        cluster.fork();
    }

    cluster.on("exit", function(worker, code, signal){
        console.log("worker " + worker.process.pid + " died!");
    });
}
else
{
    startServer();
}


console.log("[Server]: Server start on port: 80");
