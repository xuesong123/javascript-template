var servletConfig = {"chain": []};

servletConfig.set = function(pattern, servlet){
    this.chain.push({"pattern": pattern, "servlet": servlet});
};

servletConfig.set("/*",          "DispatcherServlet");
servletConfig.set("/template/*", "TemplateFilter");

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}