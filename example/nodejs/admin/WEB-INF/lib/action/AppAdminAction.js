var AppAdminAction = function(){
    this.request = null;
    this.response = null;
};

AppAdminAction.prototype.forward = function(path){
    this.request.getRequestDispatcher(path).forward(this.request, this.response);
};

AppAdminAction.prototype.getServletContextList = function(){
    var webApplication = this.request.getServletContext().getWebApplication();
    var webApplicationContext = webApplication.getWebApplicationContext();
    var list = webApplicationContext.getWebApplications();
    var servletContextList = [];

    for(var i = 0; i < list.length; i++)
    {
        servletContextList.push(list[i].getServletContext());
    }

    return servletContextList;
};

AppAdminAction.prototype.getServletContext = function(contextPath){
    var servletContextList = this.getServletContextList();

    for(var i = 0; i < servletContextList.length; i++)
    {
        var servletContext = servletContextList[i];

        if(servletContext.getContextPath() == contextPath)
        {
            return servletContext;
        }
    }

    return null;
};

var mapping = {};

mapping["list"] = {"pattern": "/admin/list.do"};
AppAdminAction.prototype.list = function(){
    var servletContextList = this.getServletContextList();
    this.request.setAttribute("servletContextList", servletContextList);
    this.forward("/template/index.jsp");
};

mapping["restart"] = {"pattern": "/admin/restart.do"};
AppAdminAction.prototype.restart = function(){
    var contextPath = this.request.getParameter("contextPath");
    var servletContext = this.getServletContext(contextPath);

    if(servletContext != null)
    {
        servletContext.restart();
    }

    this.response.redirect("/admin/list.do");
};

mapping["shutdown"] = {"pattern": "/admin/shutdown.do"};
AppAdminAction.prototype.shutdown = function(){
    var contextPath = this.request.getParameter("contextPath");
    var servletContext = this.getServletContext(contextPath);

    if(servletContext != null)
    {
        if(servletContext != this.request.getServletContext())
        {
            servletContext.shutdown();
        }
        else
        {
            this.response.setHeader("Content-type", "text/html");
            this.response.write("<script type=\"text/javascript\">\r\n");
            this.response.write("<!--\r\n");
            this.response.write("alert(\"amdin app can't close!\");\r\n");
            this.response.write("window.location.href = \"/admin/list.do\";\r\n");
            this.response.write("//-->\r\n");
            this.response.write("</script>\r\n");
            this.response.end();
            return;
        }
    }

    this.response.redirect("/admin/list.do");
};

mapping["watch"] = {"pattern": "/admin/watch.do"};
AppAdminAction.prototype.watch = function(){
    var contextPath = this.request.getParameter("contextPath");
    var servletContext = this.getServletContext(contextPath);

    if(servletContext != null)
    {
        servletContext.watch();
    }

    this.response.redirect("/admin/list.do");
};

mapping["unwatch"] = {"pattern": "/admin/unwatch.do"};
AppAdminAction.prototype.unwatch = function(){
    var contextPath = this.request.getParameter("contextPath");
    var servletContext = this.getServletContext(contextPath);

    if(servletContext != null)
    {
        servletContext.unwatch();
    }

    this.response.redirect("/admin/list.do");
};

/* http://localhost/admin/test/1/2/3.html */
mapping["test"] = {"pattern": "/admin/test/(\\d+)/(\\d+)/(\\d+)\\.html$"};
AppAdminAction.prototype.test = function(arg1, arg2, arg3){
    this.response.write("<h3>" + arg1 + ", " + arg2 + ", " + arg3 + "</h3>");
    this.response.end();
};

AppAdminAction.annotation = mapping;

if(typeof(module) != "undefined")
{
    module.exports.action = AppAdminAction;
}