var fs = require("fs");
var path = require("path");
var http = require("http");
var july = require("./webserver.js");

function startServer()
{
    var webServer = july.Bootstrap.create("localhost|127\\.0\\.0\\.1", ".");
    webServer.start();

    var server = http.createServer(function(request, response){
        webServer.dispatch(request, response);
    });

    var quit = function(){
        console.log("[Server]: " + process.pid + " - Server stopping...");
        webServer.shutdown();
        console.log("[Server]: " + process.pid + " - Server stopping...");

        server.close(function(){
            console.log("[Server]: " + process.pid + " - Server stoped!");
        });

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