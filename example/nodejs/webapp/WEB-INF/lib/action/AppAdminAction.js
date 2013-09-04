var AppAdminAction = function(){
    this.request = null;
    this.response = null;
};

var mapping = {};

mapping["list"] = {"pattern": "/admin/list.do"};
AppAdminAction.prototype.list = function(){
    this.response.write("<p><a href=\"/admin/restart.do\">restart</a></p>");
    this.response.write("<p><a href=\"/admin/shutdown.do\">shutdown</a></p>");
    this.response.end();
};

mapping["restart"] = {"pattern": "/admin/restart.do"};
AppAdminAction.prototype.restart = function(){
    this.request.getServletContext().restart();
    this.response.end();
};

mapping["shutdown"] = {"pattern": "/admin/shutdown.do"};
AppAdminAction.prototype.shutdown = function(){
    this.request.getServletContext().shutdown();
    this.response.end();
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