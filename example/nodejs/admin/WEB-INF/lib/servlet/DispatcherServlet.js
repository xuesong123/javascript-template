var fs = require("fs");
var path = require("path");
var DispatcherServlet = function(){
    this.chain = [];
    this.packages = [];
};

DispatcherServlet.prototype.init = function(servletContext){
    var home = servletContext.getRealPath("/");
    var chain = this.chain;

    for(var i = 0; i < this.packages.length; i++)
    {
        var lib = path.join(home, "WEB-INF/module/" + this.packages[i]);

        if(fs.existsSync(lib) == true)
        {
            var list = fs.readdirSync(lib);

            for(var j = 0, length = list.length; j < length; j++)
            {
                var fileName = list[j];
                var filePath = path.join(lib, fileName);
                var stats = fs.statSync(filePath);

                if(stats.isFile())
                {
                    var action = require(filePath).action;

                    if(action != null && typeof(action) == "function")
                    {
                        var mapping = action.mapping;

                        if(mapping != null)
                        {
                            var config = null;

                            for(var name in mapping)
                            {
                                config = mapping[name];
                                chain.push({"source": filePath, "pattern": config.pattern, "action": action, "method": name});
                            }
                        }
                    }
                }
            }
        }
    }
};

DispatcherServlet.prototype.service = function(request, response, servletChain){
    var chain = this.chain;
    var requestURI = request.requestURI;
    var contextPath = request.getContextPath();

    if(contextPath != null && contextPath != "/")
    {
        requestURI = requestURI.substring(contextPath.length);
    }

    if(requestURI == "")
    {
        requestURI = "/";
    }

    for(var i = 0; i < chain.length; i++)
    {
        var config = chain[i];
        var regExp = new RegExp(config.pattern);
        var arr = regExp.exec(requestURI);

        if(arr != null)
        {
            var args = [];

            for(var j = 1; j < arr.length; j++)
            {
                args.push(arr[j]);
            }

            var action = new config.action();
            action.request = request;
            action.response = response;
            var method = action[config.method];

            if(method != null)
            {
                method.apply(action, args);
                return true;
            }
            else
            {
                throw new Error("A Error occurred in file \"" + config.source + "\", Message: The method \"" + config.method + "\" not found !");
            }
        }
    }

    servletChain.doChain(request, response, servletChain);
    return false;
};

if(typeof(module) != "undefined")
{
    module.exports.DispatcherServlet = DispatcherServlet;
}