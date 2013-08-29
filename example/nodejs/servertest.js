var os = require("os");
var fs = require("fs");
var path = require("path");
var http = require("http");
var URL = require("url");
var july = require("../../webserver.js");
var ayada = require("../../ayada-1.0.0.js");
var appTaglib = require("../../app.taglib.js");

ayada.TagLibraryFactory.setup("app:scrollpage", appTaglib.ScrollPageTag);
ayada.TagLibraryFactory.setup("app:cache", appTaglib.CacheTag);

/**
 * 
 */
july.JspServlet.prototype.execute = function(request, response, servletChain){
    response.writeHead(404, "NotFound", {"Content-type": "text/html"});
    response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
};

var StringUtil = {};
StringUtil.startsWith = function(source, search){
    return (source.length >= search.length && source.substring(0, search.length) == search)
};

var webApplication = july.WebApplicationFactory.create("localhost", "webapp", "/");
var servletContext = webApplication.servletContext;

/**
 * $RCSfile: TemplateDispatcher.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var TemplateDispatcher = {};

TemplateDispatcher.dispatch = function(templateContext, request, response, page){
    var session = request.getSession(false);
    var context = [];

    context["request"] = request;
    context["response"] = response;

    if(session != null)
    {
        context["session"] = session;
    }

    var attributes = request.attributes;

    if(attributes != null)
    {
        for(var i in attributes)
        {
            context[i] = attributes[i];
        }
    }

    var writer = request.getAttribute("template_writer");

    if(writer == null)
    {
        writer = response.getWriter();
    }

    templateContext.execute(page, context, writer);
};

/**
 * @Override
 */
ayada.TemplateFactory.getSource = function(home, page, encoding){
    var homePath = fs.realpathSync(home);
    var realPath = path.join(homePath, path.normalize(page));

    if(StringUtil.startsWith(realPath, homePath) == false)
    {
        throw {"name": "FileNotFoundException", "message": page + " not exists !"};
    }

    if(fs.existsSync(realPath) == false)
    {
        throw {"name": "FileNotFoundException", "message": page + " not exists !"};
    }

    return fs.readFileSync(realPath, "UTF-8");
};

/**
 * $RCSfile: TemplateFilter.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var templateFilter = {};

/**
 * current work directory
 */
templateFilter.home = "/template";

/**
 * current template context
 */
templateFilter.templateContext = new ayada.TemplateContext(servletContext.getRealPath("/template"), 30);

/**
 * @Override
 */
templateFilter.service = function(request, response, servletChain){
    /* filter dispatcher type */
    if(request.getAttribute("servlet_request_type") != "FORWARD")
    {
        servletChain.doChain(request, response);
        return;
    }

    var requestURI = request.requestURI;

    if(this.home != null && this.home.length > 1)
    {
        if(StringUtil.startsWith(requestURI, this.home))
        {
            requestURI = requestURI.substring(this.home.length);
        }
    }

    var file = request.getServletContext().getRealPath(request.requestURI);
    response.setHeader("Content-Type", "text/html; charset=UTF-8");

    if(fs.existsSync(file))
    {
        TemplateDispatcher.dispatch(this.templateContext, request, response, requestURI);
        response.end();
    }
    else
    {
        response.writeHead(404, "NotFound", {"Content-type": "text/html"});
        response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
    }
};

/**
 * $RCSfile: TemplateFilter.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var UserManager = {};

/**
 * your business method
 */
UserManager.getUserList = function(pageNum, pageSize){
    var userList = [];

    for(var i = 0; i < pageSize; i++)
    {
        var index = (pageNum - 1) * pageSize + i + 1;
        userList[i] = {"userName": "test" + index, "userAge": (21 + i), "birthday": new Date()};
    }

    return userList;
};

/**
 * your business method
 */
UserManager.getUserCount = function(){
    return 853;
};

/**
 * template support
 * this is a filter
 */
servletContext.set("TemplateFilter", "/template/*", templateFilter);

/**
 * template support
 * this is a filter
 */
servletContext.set("UserListServlet", "/user/userList.do", function(request, response, servletChain){
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
});

var server = (function(){
    return http.createServer(function(request, response){
        webApplication.dispatch(request, response);
    });
})();

server.listen(80, "localhost");
console.log("server start on port: 80");
