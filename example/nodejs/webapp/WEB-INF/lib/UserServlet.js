var UserManager = require("./manager/UserManager.js");
var servlets = {};

servlets.UserListServlet = {"pattern": "/user/userList.do", "servlet": function(request, response, servletChain){
    var pageNum = request.getParameter("pageNum");
    var pageSize = request.getParameter("pageSize");

    if(pageNum != null)
    {
        pageNum = parseInt(pageNum);
    }

    if(pageSize != null)
    {
        pageSize = parseInt(pageSize);
    }

    if(pageNum == null || isNaN(pageNum))
    {
        pageNum = 1;
    }

    if(pageSize == null || isNaN(pageSize))
    {
        pageSize = 7;
    }

    var userList = UserManager.getUserList(pageNum, pageSize);
    var userCount = UserManager.getUserCount();

    request.setAttribute("userList", userList);
    request.setAttribute("userCount", userCount);
    request.setAttribute("pageNum", pageNum);
    request.setAttribute("pageSize", pageSize);

    /* forward to TemplateFilter.service */
    request.getRequestDispatcher("/template/userList.jsp").forward(request, response);
}};

servlets.UserServlet = {"pattern": "/user/user.do", "servlet": function(request, response, servletChain){
    var userId = request.getParameter("userId");
    var user = UserManager.getById(userId);

    request.setAttribute("user", user);

    /* forward to TemplateFilter.service */
    request.getRequestDispatcher("/template/user.jsp").forward(request, response);
}};

if(typeof(module) != "undefined")
{
    module.exports.servlets = servlets;
}