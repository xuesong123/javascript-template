var servletConfig = {"servletChain": []};

servletConfig.applicationName = "ApplicationManagementConsole";
servletConfig.displayName = "Application Management Console";

servletConfig.contextParam = {
    "contextConfigLocation": "/WEB-INF/servlet-*.xml"
};

servletConfig.set = function(pattern, servlet){
    this.servletChain.push({"pattern": pattern, "servlet": servlet});
};

servletConfig.set("/*",          "DispatcherServlet");
servletConfig.set("/template/*", "TemplateFilter");

servletConfig.packages = ["servlet"];

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}