var fs = require("fs");
var path = require("path");
var DispatcherServlet = {};
DispatcherServlet.chain = null;
DispatcherServlet.packages = ["action"];

DispatcherServlet.init = function(servletContext){
    var home = servletContext.getRealPath("/");
    var chain = [];

    for(var i = 0; i < this.packages.length; i++)
    {
        var lib = path.join(home, "WEB-INF/lib/" + this.packages[i]);

        if(fs.existsSync(lib) == true)
        {
            var list = fs.readdirSync(lib);

            for(var i = 0, length = list.length; i < length; i++)
            {
                var fileName = list[i];
                var filePath = path.join(lib, fileName);
                var stats = fs.statSync(filePath);

                if(stats.isFile())
                {
                    var action = require(filePath).action;

                    if(action != null && typeof(action) == "function")
                    {
                        var annotation = action.annotation;

                        if(annotation != null)
                        {
                            var config = null;

                            for(var name in annotation)
                            {
                                config = annotation[name];
                                chain.push({"pattern": config.pattern, "action": action, "method": name});
                            }
                        }
                    }
                }
            }
        }
    }

    this.chain = chain;
};

DispatcherServlet.service = function(request, response, servletChain){
    var requestURI = request.requestURI;
    var chain = this.chain;

    for(var i = 0; i < chain.length; i++)
    {
        var config = chain[i];
        var regExp = new RegExp(config.pattern);
        var arr = regExp.exec(requestURI);

        if(arr != null)
        {
            var args = [];

            for(var i = 1; i < arr.length; i++)
            {
                args.push(arr[i]);
            }

            var action = new config.action();
            action.request = request;
            action.response = response;
            action[config.method].apply(action, args);
            return true;
        }
    }

    servletChain.doChain(request, response, servletChain);
    return false;
};

if(typeof(module) != "undefined")
{
    module.exports.DispatcherServlet = DispatcherServlet;
}