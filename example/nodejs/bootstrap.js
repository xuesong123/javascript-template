var fs = require("fs");
var path = require("path");
var http = require("http");
var july = require("../../webserver.js");

function startServer()
{
    var webServer = july.Bootstrap.create("localhost|127\\.0\\.0\\.1", ".");
    webServer.start();

    var server = http.createServer(function(request, response){
        if(request.url == "/favicon.ico")
        {
            response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
            response.end();
            return;
        }

        if(request.url == "/exit.do")
        {
            response.writeHead(200, "OK", {"Content-Type": "text/html"});
            response.write("<h1>Server stoped !</h1>");
            response.end();
            quit();
            return;
        }

        webServer.dispatch(request, response);
    });

    var status = 1;

    var quit = function(){
        if(status == 0)
        {
            return;
        }

        console.log("[Server]: " + process.pid + " - Server stopping...");
        webServer.shutdown();
        console.log("[Server]: " + process.pid + " - Server stopping...");

        server.close(function(){
            console.log("[Server]: " + process.pid + " - Server stoped!");
        });

        status = 0;
        process.exit(0);
    };

    process.on("uncaughtException", function(error){
        console.log("Caught exception: " + error);
        console.trace();
    });

    server.listen(80, "localhost");
    console.log("[Server]: " + process.pid + " - Server start on port: 80");
};

startServer();