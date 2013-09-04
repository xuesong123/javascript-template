var servletConfig = {"chain": []};

servletConfig.set = function(pattern, servlet){
    this.chain.push({"pattern": pattern, "servlet": servlet});
};

servletConfig.set("/*",                         "urlrewrite");
servletConfig.set("/template/*",                "TemplateFilter");
servletConfig.set("/user/userList.do",          "UserListServlet");
servletConfig.set("/user/user.do",              "UserServlet");
servletConfig.set("/test/exceptionTest.do",     "ExceptionServlet");

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}