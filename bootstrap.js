var path = require("path");
var http = require("http");
var ayada = require("webserver");

function startServer(args)
{
    var options = new ayada.Options(args);
    var home = options.getOption("-home");
    var port = options.getOption("-port");

    if(home == null)
    {
        home = ".";
    }

    if(port == null)
    {
        port = "80";
    }

    port = parseInt(port);

    if(isNaN(port) || port < 1 || port > 65535)
    {
        port = 80;
    }

    var webServer = ayada.Bootstrap.create("localhost|127\\.0\\.0\\.1", port, home);
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

    server.listen(port, "localhost");
    LogUtil.info("[Server]: Server start on port: " + port);
};

startServer(process.argv.slice(2));