var DispatcherServlet = new (require("./../../lib/servlet/DispatcherServlet.js").DispatcherServlet)();
DispatcherServlet.packages = ["action"];

if(typeof(module) != "undefined")
{
    module.exports.DispatcherServlet = DispatcherServlet;
}