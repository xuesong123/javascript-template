var servletConfig = {"servletChain": []};

servletConfig.set = function(pattern, servlet){
    this.servletChain.push({"pattern": pattern, "servlet": servlet});
};

servletConfig.set("/*",                         "urlrewrite");
servletConfig.set("/*",                         "DispatcherServlet");
servletConfig.set("/template/*",                "TemplateFilter");
servletConfig.set("/user/userList.do",          "UserListServlet");
servletConfig.set("/user/user.do",              "UserServlet");
servletConfig.set("/test/exceptionTest.do",     "ExceptionServlet");

servletConfig.packages = ["servlet"];

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}