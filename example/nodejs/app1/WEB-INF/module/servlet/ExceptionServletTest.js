var ExceptionServlet = function(request, response, servletChain){
    throw {"name": "RuntimeException", "message": "Test Exception !"}
};

if(typeof(module) != "undefined")
{
    module.exports.ExceptionServlet = ExceptionServlet;
}