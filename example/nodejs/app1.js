var http = require("http");
var july = require("../../webserver.js");

/**
 * disable *.jsp
 */
july.JspServlet.prototype.execute = function(request, response, servletChain){
    response.writeHead(404, "NotFound", {"Content-type": "text/html"});
    response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
};

/**
 * create webApplication
 */
var webApplication = july.WebApplicationFactory.create("localhost", "webapp", "/");
var servletContext = webApplication.servletContext;

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.on("exit", function(){
    servletContext.destroy();
});

/**
 * scan & lod ${HOME}/WEB-INF/lib/*.js
 */
servletContext.load();

var server = (function(){
    return http.createServer(function(request, response){
        if(request.url == "/favicon.ico")
        {
            response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
            response.end();
            return;
        }

        webApplication.dispatch(request, response);
    });
})();

server.listen(80, "localhost");
console.log("server start on port: 80");