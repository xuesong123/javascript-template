var os = require("os");
var fs = require("fs");
var path = require("path");
var http = require("http");
var URL = require("url");
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
var server = (function(){
    return http.createServer(function(request, response){
        webApplication.dispatch(request, response);
    });
})();

/**
 * scan ${HOME}/WEB-INF/lib
 * load ${HOME}/WEB-INF/lib/*.js
 */
servletContext.load();
servletContext.watch();

server.listen(80, "localhost");
console.log("server start on port: 80");