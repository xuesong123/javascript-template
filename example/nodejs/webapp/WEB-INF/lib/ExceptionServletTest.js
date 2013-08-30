var servlets = {};

servlets.ExceptionServlet = {"pattern": "/test/exceptionTest.do", "servlet": function(request, response, servletChain){
    throw {"name": "RuntimeException", "message": "Test Exception !"}
}};

if(typeof(module) != "undefined")
{
    module.exports.servlets = servlets;
}