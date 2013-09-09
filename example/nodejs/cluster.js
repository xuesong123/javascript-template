var fs = require("fs");
var path = require("path");
var http = require("http");
var july = require("../../webserver.js");

var Cluster = function(){
    this.cluster = null;
};

Cluster.prototype.start = function(count, handler){
    var cluster = this.cluster = require("cluster");
    var cpus = require("os").cpus().length;

    if(cluster.isMaster)
    {
        if(count < 1)
        {
            count = cpus;
        }

        for(var i = 0; i < count; i++)
        {
            var worker = cluster.fork();

            worker.on("message", function(message){
                console.log("$" + worker.process.pid + " - " + message);

                if(message == "exit 0")
                {
                    process.exit();
                }
            });
        }

        cluster.on("exit", function(worker, code, signal){
            console.log("worker " + worker.process.pid + " died!");
        });
    }
    else if(cluster.isWorker)
    {
        console.log("create process: " + process.pid);

        process.on("message", function(message){
            if(msg === "force kill")
            {
                process.exit(0);
            }
        });

        handler();
    }
};

Cluster.prototype.shutdown = function(){
    console.log("[Cluster]: " + process.pid + " - Cluster shutdown...");
    var workers = this.cluster.workers;

    for(var i in workers)
    {
        if(workers[i].isSlave)
        {
            console.log("[Cluster]: " + workers[i].process.pid + " - shutdown...");
            workers[i].process.exit(0);
        }
    }
};

function startServer()
{
    var webServer = july.Bootstrap.create("localhost|127\\.0\\.0\\.1", ".");
    webServer.start();

    var server = http.createServer(function(request, response){
        if(request.url == "/exit.do")
        {
            response.writeHead(200, "OK", {"Content-Type": "text/html"});
            response.write("<h5>" + process.pid + " - Server stoped !</h5>");
            response.end();
            process.send("exit 0");
            return;
        }

        webServer.dispatch(request, response);
    });

    var quit = function(){
        console.log("[Server]: " + process.pid + " - Server stopping...");
        webServer.shutdown();
        console.log("[Server]: " + process.pid + " - Server stopping...");

        server.close(function(){
            console.log("[Server]: " + process.pid + " - Server stoped!");
        });
    };

    process.on("exit", quit);

    server.listen(80, "localhost");
    console.log("[Server]: " + process.pid + " - Server start on port: 80");
};

new Cluster().start(2, startServer);