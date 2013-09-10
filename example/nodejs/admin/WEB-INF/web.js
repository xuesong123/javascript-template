var servletConfig = {"servletChain": []};

servletConfig.status = 1;
servletConfig.applicationName = "ApplicationManagementConsole";
servletConfig.displayName = "Application Management Console";

servletConfig.contextParam = {
    "contextConfigLocation": "/WEB-INF/servlet-*.js"
};

servletConfig.set = function(pattern, servlet){
    this.servletChain.push({"pattern": pattern, "servlet": servlet});
};

servletConfig.set("/*",          "DispatcherServlet");
servletConfig.set("/template/*", "TemplateFilter");

servletConfig.packages = ["servlet"];

servletConfig.sessionConfig = {
    sessionTimeout: 10 * 60
};

servletConfig.watchConfig = {
    /**
     * default: 3 * 60
     */
    interval: 3 * 60
};

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}