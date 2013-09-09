var ExceptionServlet = function(request, response, servletChain){
    throw new Error("RuntimeException: Test Exception !");
};

if(typeof(module) != "undefined")
{
    module.exports.ExceptionServlet = ExceptionServlet;
}