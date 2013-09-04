var AppAdminAction = function(){
    this.request = null;
    this.response = null;
};

AppAdminAction.prototype.forward = function(path){
    this.request.getRequestDispatcher(path).forward(this.request, this.response);
};

AppAdminAction.prototype.getServletContext = function(contextPath){
    var servletContextList = this.request.getServletContext().getServletContextList();

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
    var servletContextList = this.request.getServletContext().getServletContextList();
    this.request.setAttribute("servletContextList", servletContextList);
    this.forward("/template/servletContextList.jsp");
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
        servletContext.shutdown();
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