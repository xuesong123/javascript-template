var fs = require("fs");
var path = require("path");
var http = require("http");
var july = require("../../webserver.js");

/**
 * disable *.jsp
 */
july.JspServlet.prototype.execute = function(request, response, servletChain){
    response.writeHead(404, "NotFound", {"Content-type": "text/html"});
    response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
};

var Bootstrap = {};

Bootstrap.create = function(host, home){
    var webServer = new july.WebServer();
    var vistualHost = new july.VistualHost(host);
    var root = fs.realpathSync(home);

    if(fs.existsSync(root) == false)
    {
        return webServer;
    }

    var stats = fs.statSync(root);

    if(stats.isFile())
    {
        return webServer;
    }

    var list = fs.readdirSync(root);

    for(var i = 0, length = list.length; i < length; i++)
    {
        var dir = list[i];
        var stats = fs.statSync(path.join(root, dir));

        if(stats.isDirectory())
        {
            var app = july.WebApplicationFactory.create(host, path.join(root, dir), "/" + dir);
            vistualHost.add(app);
        }
    }

    webServer.add(vistualHost);
    return webServer;
};

var webServer = Bootstrap.create("localhost|127\\.0\\.0\\.1", ".");
webServer.start();

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
console.log("server start on port: 80");
