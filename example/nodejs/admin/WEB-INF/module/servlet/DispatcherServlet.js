var servlet = require("./../../lib/servlet/DispatcherServlet.js");
var DispatcherServlet = new servlet.DispatcherServlet();
DispatcherServlet.packages = ["action"];

if(typeof(module) != "undefined")
{
    module.exports.DispatcherServlet = DispatcherServlet;
}