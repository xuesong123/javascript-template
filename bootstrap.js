var path = require("path");
var http = require("http");
var july = require("./webserver.js");

function startServer(args)
{
    var options = new july.Options(args);
    var home = options.getOption("-home");

    if(home == null)
    {
        home = ".";
    }

    var webServer = july.Bootstrap.create("localhost|127\\.0\\.0\\.1", home);
    webServer.start();

    var server = http.createServer(function(request, response){
        LogUtil.info(request.client.remoteAddress + " " + request.url);
        webServer.dispatch(request, response);
    });

    var quit = function(){
        LogUtil.info("[Server]: " + process.pid + " - Server stopping...");
        webServer.shutdown();
        LogUtil.info("[Server]: " + process.pid + " - Server stopping...");

        server.close(function(){
            LogUtil.info("[Server]: Server stoped!");
        });
    };

    process.on("exit", function(error){
        quit();
    });

    process.on("uncaughtException", function(error){
        LogUtil.info("Caught exception: " + error);
        console.trace();
    });

    server.listen(80, "localhost");
    LogUtil.info("[Server]: Server start on port: 80");
};

startServer(process.argv.slice(2));