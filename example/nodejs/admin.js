var http = require("http");
var july = require("../../webserver.js");

/**
 * disable *.jsp
 */
july.JspServlet.prototype.execute = function(request, response, servletChain){
    response.writeHead(404, "NotFound", {"Content-type": "text/html"});
    response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
};

var app1 = july.WebApplicationFactory.create("localhost", "webapp", "/");
var admin = july.WebApplicationFactory.create("localhost", "admin", "/admin");

var host1 = new july.VistualHost("localhost");
host1.add(app1);
host1.add(admin);

var webServer = new july.WebServer();
webServer.add(host1);

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

/**
 * scan & lod ${HOME}/WEB-INF/lib/*.js
 */
admin.servletContext.getServletContextList = function(){
    return [app1.servletContext];
};

admin.servletContext.load();
admin.servletContext.watch();

app1.servletContext.load();
app1.servletContext.watch();

server.listen(80, "localhost");
console.log("server start on port: 80");