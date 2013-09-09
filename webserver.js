var fs = require("fs");
var URL = require("url");
var path = require("path");
var http = require("http");
var httpd = require("./httpd");

/**
 * $RCSfile: StringUtil.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var StringUtil = {};
StringUtil.startsWith = function(source, search){
    return (source.length >= search.length && source.substring(0, search.length) == search)
};

/**
 * $RCSfile: ArrayUtil.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var ArrayUtil = {};

ArrayUtil.iterator = function(items){
    if(items == null)
    {
        return new Iterator([]);
    }

    if(items.length != null)
    {
        return new Iterator(items);
    }
    else
    {
        var list = [];

        for(var i in items)
        {
            list.push(items[i]);
        }

        return new Iterator(list);
    }
};

var Parameter = {};

Parameter.parse = function(query, parameters){
    if(query != null)
    {
        var a = query.split("&");

        for(var i = 0, length = a.length; i < length; i++)
        {
            var b = a[i].split("=");

            if(b.length > 1)
            {
                var name = b[0];
                var value = b[1];

                if(name.length > 0)
                {
                    var values = parameters[name];

                    if(values != null)
                    {
                        if(typeof(values) == "string")
                        {
                             values = parameters[name] =[values];
                        }

                        values.push(value);
                    }
                    else
                    {
                        parameters[name] = value;
                    }
                }
            }
        }
    }

    return parameters;
};

var DateUtil = {};

DateUtil.toString = function(date){
    if(date == null)
    {
        return "";
    }

    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var S = date.getTime() % 1000;

    var a = [];

    a[a.length] = y.toString();
    a[a.length] = "-";

    if(M < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = M.toString();
    a[a.length] = "-";

    if(d < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = d.toString();
    a[a.length] = " ";

    if(h < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = h.toString();
    a[a.length] = ":";

    if(m < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = m.toString();
    a[a.length] = ":";

    if(s < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = s.toString();
    a[a.length] = " ";

    if(S < 100)
    {
        a[a.length] = "0";
    }

    if(S < 10)
    {
        a[a.length] = "0";
    }

    a[a.length] = S.toString();
    return a.join("");
};

var LogUtil = {};

LogUtil.info = function(){
    var args = [];
    args.push(DateUtil.toString(new Date()));
    args.push("-");

    for(var i = 0; i < arguments.length; i++)
    {
        args[args.length] = arguments[i];
    }

    console.log.apply(console, args);
};

/**
 * $RCSfile: Iterator.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function Iterator(items){
    this.index = 0;
    this.items = items;
}

Iterator.prototype.hasNext = function(){
    return this.index < this.items.length;
};

Iterator.prototype.next = function(){
    return this.items[this.index++];
};

Iterator.prototype.size = function(){
    return this.items.length;
};

/**
 * $RCSfile: WebServer.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function WebServer(){
    this.hosts = [];
}

/**
 * @param host
 */
WebServer.prototype.add = function(host){
    this.hosts.push(host);
};

/**
 * @return VistualHost
 */
WebServer.prototype.getVistualHost = function(request){
    var host = request.headers.host;

    for(var i = 0, length = this.hosts.length; i < length; i++)
    {
        var regexp = new RegExp((this.hosts[i]).host);

        if(regexp.test(host))
        {
            return this.hosts[i];
        }
    }

    return null;
};

/**
 * @return VistualHost
 */
WebServer.prototype.getWebApplication = function(request){
    var vistualHost = this.getVistualHost(request);

    if(vistualHost != null)
    {
        return vistualHost.getWebApplication(request);
    }

    return null;
};

/**
 * @param request
 * @param response
 */
WebServer.prototype.dispatch = function(request, response){
    var exception = null;

    try
    {
        var url = URL.parse(request.url);
        request.requestURL = url.path;
        request.requestURI = url.pathname;

        var webApplication = this.getWebApplication(request);

        if(webApplication != null)
        {
            webApplication.dispatch(request, response);
        }
        else
        {
            response.statusCode = 404;
            response.end("<h1 error=\"10001\">Request URL: " + request.requestURL + " not found !</h1>");
        }
    }
    catch(e)
    {
        exception = e;
    }

    if(exception != null)
    {
        try
        {
            response.writeHead(500, "Internal Server Error", {"Content-type": "text/html"});
            response.end("<h4 error=\"1005001\">" + exception.name + ": " + exception.message + "</h4>");
            return;
        }
        catch(e)
        {
            LogUtil.info("Exception: " + e);
            console.trace();
        }
    }
};

WebServer.prototype.start = function(){
    for(var i = 0, length = this.hosts.length; i < length; i++)
    {
        this.hosts[i].start();
    }
};

WebServer.prototype.shutdown = function(){
    for(var i = 0, length = this.hosts.length; i < length; i++)
    {
        this.hosts[i].shutdown();
    }
};

/**
 * $RCSfile: VistualHost.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function VistualHost(host){
    this.host = host;
    this.applications = [];
}

/**
 * @param webApplication
 */
VistualHost.prototype.add = function(webApplication){
    this.applications.push(webApplication);
};

/**
 * @return boolean
 */
VistualHost.prototype.getWebApplication = function(request){
    var uri = request.requestURI;
    var root = null;

    for(var i = 0, length = this.applications.length; i < length; i++)
    {
        if(this.applications[i].path == null || this.applications[i].path == "/")
        {
            root = this.applications[i];
            continue;
        }

        var prefix = this.applications[i].path + "/";

        if(uri == this.applications[i].path)
        {
            return this.applications[i];
        }

        if(uri.length >= prefix.length && uri.substring(0, prefix.length) == prefix)
        {
            return this.applications[i];
        }
    }

    return (root != null ? root : null);
};

VistualHost.prototype.start = function(){
    for(var i = 0, length = this.applications.length; i < length; i++)
    {
        this.applications[i].start();
    }
};

VistualHost.prototype.shutdown = function(){
    for(var i = 0, length = this.applications.length; i < length; i++)
    {
        this.applications[i].shutdown();
    }
};

/**
 * $RCSfile: WebApplicationContext.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var WebApplicationContext = {id: 1, context: {}};

WebApplicationContext.add = function(webApplication){
    this.context["_webapp_" + this.id++] = webApplication;
};

WebApplicationContext.getWebApplications = function(webApplication){
    var list = [];

    for(var i in this.context)
    {
        list.push(this.context[i]);
    }

    return list;
};

/**
 * $RCSfile: WebApplication.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var WebApplicationFactory = {};

WebApplicationFactory.create = function(host, home, path){
    var webApplication = new WebApplication(host, home, path);
    var servletContext = ServletContextFactory.create(host, home, path);
    var sessionContext = SessionContextFactory.create(30);

    webApplication.servletContext = servletContext;
    webApplication.sessionContext = sessionContext;

    servletContext.webApplication = webApplication;
    servletContext.sessionContext = sessionContext;
    servletContext.defaultServlet = httpd.create(host, home, path);
    servletContext.jspServlet = new JspServlet();
    WebApplicationContext.add(webApplication);
    return webApplication;
};

/**
 * $RCSfile: WebApplication.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function WebApplication(host, home, path){
    this.host = host;
    this.home = home;
    this.path = path;
};

WebApplication.prototype.start = function(){
    if(this.servletContext != null)
    {
        this.servletContext.start();
    }
};

WebApplication.prototype.shutdown = function(){
    if(this.servletContext != null)
    {
        this.servletContext.shutdown();
    }
};

WebApplication.prototype.setHost = function(host){
    this.host = host;

    if(this.servletContext != null)
    {
        this.servletContext.setHost(host);
    }
};

WebApplication.prototype.getHost = function(){
    return this.host;
};

WebApplication.prototype.setHome = function(home){
    this.home = home;

    if(this.servletContext != null)
    {
        this.servletContext.setHome(home);
    }
};

WebApplication.prototype.getHome = function(){
    return this.home;
};

WebApplication.prototype.setPath = function(path){
    this.path = path;

    if(this.servletContext != null)
    {
        this.servletContext.setPath(path);
    }
};

WebApplication.prototype.getPath = function(){
    return this.path;
};

WebApplication.prototype.getWebApplicationContext = function(){
    return WebApplicationContext;
};

WebApplication.prototype.getServletContext = function(){
    return this.servletContext;
};

WebApplication.prototype.setSessionTimeout = function(timeout){
    if(this.sessionContext != null)
    {
        this.sessionContext.setTimeout(timeout);
    }
};

/**
 * @return HttpServletRequest
 */
WebApplication.prototype.getRequest = function(request, response){
    var url = URL.parse(request.url);

    request.response = response;
    response.request = request;

    /**
     * requestURL: http://localhost/app1/test.jsp
     * requestURI: /app1/test.jsp
     * requestURI: ${contextPath}/test.jsp
     */
    request.attributes = {};
    request.originalURL = url.path;
    request.requestURL = url.path;
    request.requestURI = url.pathname;
    request.queryString = (url.query || "");
    request.parameters = Parameter.parse(url.query, []);
    request.servletContext = this.servletContext;
    request.sessionContext = this.sessionContext;

    for(var i in HttpServletRequestWrapper)
    {
        request[i] = HttpServletRequestWrapper[i];
    }

    return request;
};

/**
 * @return HttpServletResponse
 */
WebApplication.prototype.getResponse = function(request, response){
    request.response = response;
    response.request = request;
    response.servletContext = this.servletContext;
    response.sessionContext = this.sessionContext;

    for(var i in HttpServletResponseWrapper)
    {
        response[i] = HttpServletResponseWrapper[i];
    }

    response._end = response.end;

    response.end = function(){
        if(this._end != null)
        {
            this._end.apply(this, arguments);
        }

        this._end = function(){};
    };

    return response;
};

/**
 * @param request
 * @param response
 */
WebApplication.prototype.dispatch = function(req, res){
    var url = URL.parse(req.url);
    var exception = null;

    /**
     * don't check contextPath
     */
    try
    {
        res.statusCode = 200;
        res.setHeader("Server", "Httpd/1.1");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-type", "text/html");

        var servletContext = this.getServletContext();

        if(servletContext.running() == false)
        {
            res.writeHead(404, "Not Found", {"ContentType": "text/html"});
            res.end("<h1 error=\"10002\">Request URL: " + req.url + " not found !</h1>");
            return;
        }

        var request = this.getRequest(req, res);
        var response = this.getResponse(req, res);
        var servletChain = this.servletContext.getServletChain(url.pathname);
        var requestURI = request.requestURI;

        if(StringUtil.startsWith(requestURI.toUpperCase(), "/WEB-INF"))
        {
            response.writeHead(403, "Forbidden", {"Content-Type": "text/plain"});
            response.end();
            return;
        }

        if(StringUtil.startsWith(requestURI.toUpperCase(), "/META-INF"))
        {
            response.writeHead(403, "Forbidden", {"Content-Type": "text/plain"});
            response.end();
            return;
        }

        request.setAttribute("servlet_request_dispatcher", "REQUEST");
        this.sessionContext.update(request, response);

        if(request.headers["content-type"] == "application/x-www-form-urlencoded")
        {
            var length = 0;
            var chunks = [];
            var encoding = "UTF-8";
            var instance = this;

            request.on("data", function(chunk){
                length += chunk.length;
                chunks.push(chunk);
            });

            request.on("end", function(){
                var buffer = new Buffer(length);

                for(var i = 0, position = 0, size = chunks.length; i < size; i++)
                {
                    var len = chunks[i].length;
                    chunks[i].copy(buffer, position);
                    position += len;
                }

                this.parameters = Parameter.parse(buffer.toString("UTF-8", 0, length), this.parameters);
                instance.execute(request, response, servletChain);
            });
        }
        else
        {
            this.execute(request, response, servletChain);
        }
    }
    catch(e)
    {
        exception = e;
    }

    if(exception != null)
    {
        try
        {
            response.writeHead(500, "Internal Server Error", {"Content-type": "text/html"});
            response.end("<h4 error=\"1005002\">" + exception.name + ": " + exception.message + "</h4>");
            return;
        }
        catch(e)
        {
            LogUtil.info("Exception: " + e);
            console.trace();
        }
    }
};

/**
 * @param request
 * @param response
 * @param servletChain
 */
WebApplication.prototype.execute = function(request, response, servletChain){
    if(servletChain.size() > 0)
    {
        while(servletChain.hasNext())
        {
            var flag = false;
            var element = servletChain.next();
            var servlet = element.servlet;

            if(servlet.dispatcher == null)
            {
                flag = true;
            }
            else
            {
                var type = request.getAttribute("servlet_request_dispatcher");

                for(var i = 0; i < servlet.dispatcher.length; i++)
                {
                    if(type == servlet.dispatcher[i])
                    {
                        flag = true;
                        break;
                    }
                }
            }

            if(flag)
            {
                servlet.service(request, response, servletChain);
                break;
            }
        }

        return 200;
    }
    else
    {
        response.writeHead(404, "Not Found", {"ContentType": "text/html"});
        response.end("<h1 error=\"10002\">Request URL: " + request.url + " not found !</h1>");
        return 404;
    }
};

/**
 * $RCSfile: ServletContextFactory.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var ServletContextFactory = {};

/**
 * @param home
 * @param path
 */
ServletContextFactory.create = function(host, home, path){
    return new ServletContext(host, home, path);
};

/**
 * $RCSfile: ServletContext.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function ServletContext(host, home, path){
    this.host = host;
    this.home = home;
    this.path = path;
    this.status = 0;
    this.index = 0;
    this.watchStatus = 0;
    this.context = {};
};

/**
 * @param host
 */
ServletContext.prototype.setHost = function(host){
    this.host = host;

    if(this.defaultServlet != null)
    {
        this.defaultServlet.setHost(host);
    }
};

/**
 * @return String
 */
ServletContext.prototype.getHost = function(host){
    return this.host;
};

/**
 * @param name
 */
ServletContext.prototype.setHome = function(home){
    this.home = home;

    if(this.defaultServlet != null)
    {
        this.defaultServlet.setHome(home);
    }
};

/**
 * @return String
 */
ServletContext.prototype.getHome = function(){
    return this.home;
};

/**
 * @param path
 */
ServletContext.prototype.setPath = function(path){
    this.path = path;

    if(this.defaultServlet != null)
    {
        this.defaultServlet.setPath(path);
    }
};

/**
 * @return String
 */
ServletContext.prototype.getPath = function(){
    return this.path;
};

/**
 * @param name
 * @param pattern
 * @param service
 */
ServletContext.prototype.set = function(name, pattern, service){
    var servlet = null;

    if(typeof(service) == "function")
    {
        servlet = new HttpServlet();
        servlet.service = service;
    }
    else if(typeof(service) == "object")
    {
        servlet = service;
    }

    if(servlet != null)
    {
        this.context[name] = {"name": name, "pattern": pattern, "servlet": servlet};
    }
};

/**
 * @return WebApplication
 */
ServletContext.prototype.getWebApplication = function(){
    return this.webApplication;
};

/**
 * @return String
 */
ServletContext.prototype.getContextPath = function(){
    return this.path;
};

/**
 * @param webApplication
 * @param url
 * @return ServletChain
 */
ServletContext.prototype.getServletChain = function(url){
    var list = [];
    var pattern = null;

    for(var i in this.context)
    {
        pattern = new RegExp(this.context[i].pattern);

        if(pattern.test(url) == true)
        {
            list.push(this.context[i]);
        }
    }

    // jspServlet
    if(this.jspServlet != null)
    {
        list.push({"name": "_jspServlet", "pattern": "", "servlet": this.jspServlet});
    }

    // defaultServlet
    if(this.defaultServlet != null)
    {
        list.push({"name": "_defaultServlet", "pattern": "", "servlet": this.defaultServlet});
    }

    return new ServletChain(this.webApplication, ArrayUtil.iterator(list));
};

/**
 * @param uri
 * @return String
 */
ServletContext.prototype.getRealPath = function(uri){
    var homePath = fs.realpathSync(this.home);
    var realPath = path.join(homePath, path.normalize(uri));

    if(realPath.length >= homePath.length && realPath.substring(0, homePath.length) == homePath)
    {
        return realPath;
    }

    return null;
};

/**
 * @param path
 * @return RequestDispatcher
 */
ServletContext.prototype.getRequestDispatcher = function(path){
    var servletChain = this.getServletChain(path);

    if(servletChain != null)
    {
        return new RequestDispatcher(servletChain);
    }

    return null;
};

ServletContext.prototype.running = function(){
    return this.status == 2;
};

/**
 * @return sessionContext
 */
ServletContext.prototype.getSessionContext = function(){
    return this.sessionContext;
};

/**
 * @param path - absolute path
 * @return RequestDispatcher
 */
ServletContext.prototype.getWebConfig = function(create){
    if(create == true)
    {
        this.webConfig = null;
    }

    if(this.webConfig == null)
    {
        var webjs = this.getRealPath("/WEB-INF/web.js");

        if(fs.existsSync(webjs) == true)
        {
            var stats = fs.statSync(webjs);

            if(stats.isFile())
            {
                this.webConfig = require(webjs).servletConfig;
            }
        }
    }

    if(this.webConfig == null)
    {
        this.webConfig = {};
    }

    if(this.webConfig.status == null)
    {
        this.webConfig.status = 1;
    }

    if(this.webConfig.servletChain == null)
    {
        this.webConfig.servletChain = [];
    }

    if(this.webConfig.sessionConfig == null)
    {
        this.webConfig.sessionConfig = {};
    }

    if(this.webConfig.sessionConfig.sessionTimeout == null)
    {
        this.webConfig.sessionConfig.sessionTimeout = 10 * 60;
    }

    if(this.webConfig.watchConfig == null)
    {
        this.webConfig.watchConfig = {};
    }

    if(this.webConfig.watchConfig.interval == null)
    {
        this.webConfig.watchConfig.interval = 3 * 60;
    }

    return this.webConfig;
};

/**
 * @param path - absolute path
 * @return RequestDispatcher
 */
ServletContext.prototype.getServlets = function(lib, map){
    if(fs.existsSync(lib) == true)
    {
        var list = fs.readdirSync(lib);

        /**
         * build servlet
         */
        for(var i = 0, length = list.length; i < length; i++)
        {
            var fileName = list[i];
            var filePath = path.join(lib, fileName);
            var stats = fs.statSync(filePath);

            if(stats.isFile())
            {
                if(fileName.length >= 3 && fileName.substring(fileName.length - 3).toLowerCase() == ".js")
                {
                    var servlets = require(filePath);

                    if(servlets != null)
                    {
                        for(var name in servlets)
                        {
                            if(map[name] != null)
                            {
                                throw new Error("servlet \"" + name + "\ already exists!");
                            }

                            map[name] = servlets[name];
                        }
                    }
                }
            }
            else if(stats.isDirectory())
            {
            }
        }
    }

    return map;
};

ServletContext.prototype.load = function(force){
    if(this.status != 0)
    {
        this.destroy();
    }

    try
    {
        this.index++;
        this.status = 1;

        var map = {};
        var webConfig = this.getWebConfig(true);
        var packages = webConfig.packages;
        var servletChain = webConfig.servletChain;

        if(webConfig.status == 0 && force != true)
        {
            this.status = 0;
            return;
        }

        var lib = path.join(this.getRealPath("/"), "WEB-INF/module");

        LogUtil.info([
            "\r\n",
            "********************************************",
            "*                                          *",
            "*           ServletContext.load            *",
            "*                                          *",
            "********************************************",
            "[ServletContext]: " + this.index + " Load ServletContext: " + lib
        ].join("\r\n"));

        if(packages != null)
        {
            for(var i = 0; i < packages.length; i++)
            {
                LogUtil.info("[ServletContext]: scan " + path.join(lib, packages[i]));
                this.getServlets(path.join(lib, packages[i]), map);
            }
        }

        /**
         * init servlet
         */
        for(var name in map)
        {
            var servlet = map[name];

            if(typeof(servlet) == "object")
            {
                if(servlet.init != null)
                {
                    servlet.init(this);
                }
            }
        }

        if(servletChain != null)
        {
            var c = null;
            var s = null;
            for(var i = 0, length = servletChain.length; i < length; i++)
            {
                c = servletChain[i];
                s = map[c.servlet];

                if(s == null)
                {
                    throw new Error("servlet \"" + c.servlet + "\ not exists!");
                }

                this.set("_servlet_" + i, c.pattern, s);
            }
        }

        var sessionTimeout = webConfig.sessionConfig.sessionTimeout;
        this.getSessionContext().setTimeout(sessionTimeout);

        this.watch();
        this.status = 2;
        this.webConfig = webConfig;
        LogUtil.info(this.toString());
    }
    catch(e)
    {
        LogUtil.info(e);
        console.trace();
        this.destroy();
    }
};

/**
 * destroy all servlet
 */
ServletContext.prototype.destroy = function(){
    try
    {
        this.status = 3;
        var lib = path.join(this.getRealPath("/"), "WEB-INF/module");
        LogUtil.info([
            "\r\n",
            "********************************************",
            "*                                          *",
            "*          ServletContext.destroy          *",
            "*                                          *",
            "********************************************",
            "[ServletContext]: " + this.index + " Destroy ServletContext: " + lib
        ].join("\r\n"));

        this.unwatch();

        for(var name in this.context)
        {
            var servlet = this.context[name].servlet;

            if(servlet.destroy != null)
            {
                servlet.destroy();
            }
        }

        var cache = require.cache;

        for(var i in cache)
        {
            if(StringUtil.startsWith(i, this.getRealPath("/")))
            {
                if(require.cache[i] != null)
                {
                    delete require.cache[i];
                    LogUtil.info("[ServletContext]: DELETE MODUL: " + i);
                }
            }
        }

        FileIterator.each(lib, function(file){
            var stats = fs.statSync(file);

            if(stats.isFile())
            {
                if(require.cache[file] != null)
                {
                    delete require.cache[file];
                    LogUtil.info("[ServletContext]: DELETE MODUL: " + file);
                }
            }
        });

        this.context = {};
        this.webConfig = null;
        this.status = 0;
    }
    catch(e)
    {
        LogUtil.info(e);
        console.trace();
    }
};

ServletContext.prototype.getFileWatchDog = function(){
    if(this.fileWatchDog == null)
    {
        var instance = this;
        var webjs = this.getRealPath("/WEB-INF/web.js");

        var handler = function(work, list){
            list.push(webjs);

            FileIterator.each(work, function(file){
                var stats = fs.statSync(file);

                if(stats.isFile())
                {
                    list.push({"file": file, "lastModified": stats.mtime.getTime()});
                }
            });

            return list;
        };

        var listener = function(f1, f2){
            LogUtil.info("f1: " + f1 + ", f2: " + f2);
            instance.reload();
        };

        var webConfig = this.getWebConfig();
        this.fileWatchDog = new FileWatchDog(this.getRealPath("/WEB-INF/module"), handler, listener);
        this.fileWatchDog.interval = webConfig.watchConfig.interval * 1000;
    }

    return this.fileWatchDog;
};

ServletContext.prototype.watch = function(){
    this.getFileWatchDog().watch();
    this.watchStatus = 1;
};

ServletContext.prototype.unwatch = function(){
    if(this.watchStatus != 0)
    {
        this.getFileWatchDog().unwatch();
        this.watchStatus = 0;
    }
};

/**
 * reload all servlet
 */
ServletContext.prototype.reload = function(){
    this.destroy();
    this.load(true);
};

ServletContext.prototype.start = function(){
    this.load();
};

ServletContext.prototype.restart = function(){
    this.reload(true);
};

ServletContext.prototype.shutdown = function(){
    this.destroy();
};

/**
 * destroy all servlet
 */
ServletContext.prototype.toString = function(){
    var buffer = [];
    var context = this.context;

    for(var i in context)
    {
        var servletConfig = context[i];
        buffer.push("[ServletContext]: " + servletConfig.name + " - " + servletConfig.pattern);
    }

    return buffer.join("\r\n");
};

var FileIterator = {};

FileIterator.each = function(dir, handler){
    if(fs.existsSync(dir) == false)
    {
        return;
    }

    var flag = handler(dir);

    if(flag == false)
    {
        return flag;
    }

    var stats = fs.statSync(dir);

    if(stats.isFile())
    {
        return handler(dir);
    }

    var list = [];
    var dirs = [dir];

    for(var i = 0; i < dirs.length; i++)
    {
        list = fs.readdirSync(dirs[i]);

        for(var j = 0, length = list.length; j < length; j++)
        {
            var filePath = path.join(dirs[i], list[j]);
            var stats = fs.statSync(filePath);

            if(stats.isDirectory())
            {
                dirs.push(filePath);
            }

            flag = handler(filePath);

            if(flag == false)
            {
                return false;
            }
        }
    }
};

var FileWatchDog = function(home, handler, listener){
    this.home = home;
    this.list = [];
    this.timer = null;
    this.interval = 3 * 60 * 1000;
    this.handler = handler;
    this.listener = listener;
};

FileWatchDog.prototype.watch = function(){
    if(this.timer != null)
    {
        clearTimeout(this.timer);
    }

    var list = this.list;

    if(this.list.length < 1)
    {
        this.handler(this.home, this.list);
    }
    else
    {
        var f1 = null;
        var f2 = null;
        var temp = [];

        LogUtil.info("[WATCH-DOG]: watch - " + this.home);
        this.handler(this.home, temp);

        for(var i = 0, length = Math.min(list.length, temp.length); i < length; i++)
        {
            if(list[i].file != temp[i].file)
            {
                f1 = list[i].file;
                f2 = temp[i].file;
                break;
            }

            if(list[i].lastModified != temp[i].lastModified)
            {
                f1 = list[i].file;
                f2 = temp[i].file;
                break;
            }
        }

        if(f1 != null || list.length != temp.length)
        {
            this.list = temp;
            this.listener(f1, f2);
        }
    }

    var instance = this;
    this.timer = setTimeout(function(){instance.watch()}, this.interval);
};

FileWatchDog.prototype.unwatch = function(){
    if(this.timer != null)
    {
        clearTimeout(this.timer);
        this.list.length = 0;
    }
};

/**
 * $RCSfile: ServletChain.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function ServletChain(webApplication, chain){
    this.chain = chain;
    this.webApplication = webApplication;
}

/**
 * @return boolean
 */
ServletChain.prototype.hasNext = function(){
    return this.chain.hasNext();
};

/**
 * @return Servlet
 */
ServletChain.prototype.next = function(){
    return this.chain.next();
};

/**
 * @return int
 */
ServletChain.prototype.size = function(){
    return this.chain.size();
};

/**
 * @param request
 * @param response
 */
ServletChain.prototype.doChain = function(request, response){
    return this.webApplication.execute(request, response, this);
};

/**
 * $RCSfile: RequestDispatcher.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function RequestDispatcher(servletChain){
    this.servletChain = servletChain;
}

/**
 * @param request
 * @param response
 * @param servletChain
 */
RequestDispatcher.prototype.forward = function(request, response){
    request.setAttribute("servlet_request_dispatcher", "FORWARD");
    this.servletChain.doChain(request, response);
};

/**
 * $RCSfile: HttpServletRequestWrapper.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var HttpServletRequestWrapper = {};

/**
 * @param name
 * @return String
 */
HttpServletRequestWrapper.getParameter = function(name){
    return this.parameters[name];
};

/**
 * @param name
 * @param value
 */
HttpServletRequestWrapper.setAttribute = function(name, value){
    this.attributes[name] = value;
};

/**
 * @param name
 * @return Object
 */
HttpServletRequestWrapper.getAttribute = function(name){
    return this.attributes[name];
};

/**
 * @return String[]
 */
HttpServletRequestWrapper.getAttributeNames = function(){
    var names = [];

    for(var i in this.attributes)
    {
        names.push(i);
    }

    return names;
};

/**
 * @return HttpServletResponse
 */
HttpServletRequestWrapper.getContextPath = function(){
    return this.getServletContext().getContextPath();
};

/**
 * @return HttpServletResponse
 */
HttpServletRequestWrapper.getServerHost = function(){
    return this.getServletContext().getHost();
};

/**
 * @return HttpServletResponse
 */
HttpServletRequestWrapper.getResponse = function(){
    return this.response;
};

/**
 * @return servletContext
 */
HttpServletRequestWrapper.getServletContext = function(){
    return this.servletContext;
};

/**
 * @return sessionContext
 */
HttpServletRequestWrapper.getSessionContext = function(){
    return this.sessionContext;
};

/**
 * @param path
 * @return RequestDispatcher
 */
HttpServletRequestWrapper.getRequestDispatcher = function(path){
    var dispatcher = this.servletContext.getRequestDispatcher(path);

    if(dispatcher != null)
    {
        var url = URL.parse(path);
        this.requestURL = url.path;
        this.requestURI = url.pathname;
        this.queryString = (url.query || "");
        this.parameters = Parameter.parse(url.query, this.parameters);
        return dispatcher;
    }

    throw new Error("BadRequestException: Request URL '" + path + "' not found !");
};

/**
 * @param create
 * @return HttpSession
 */
HttpServletRequestWrapper.getSession = function(create){
    var sessionContext = this.getSessionContext();

    if(sessionContext != null)
    {
        var session = sessionContext.getSession(this);

        if(session == null && create == true)
        {
            session = sessionContext.create(this.getResponse());
        }

        return session;
    }

    return null;
};

/**
 * @return Cookie[]
 */
HttpServletRequestWrapper.getCookies = function(){
    if(this.cookies == null)
    {
        var map = {};
        var cookies = this.headers["cookie"];

        if(cookies != null)
        {
            var pairs = cookies.split(";");

            for(var i = 0, length = pairs.length; i < length; i++)
            {
                var a = pairs[i].split("=");

                if(a.length >= 2)
                {
                    map[a[0].trim()] = a[1];
                }
            }
        }

        this.cookies = map;
    }

    return this.cookies;
};

/**
 * $RCSfile: HttpServletResponseWrapper.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var HttpServletResponseWrapper = {};

/**
 * @return HttpServletRequest
 */
HttpServletResponseWrapper.getRequest = function(){
    return this.request;
};

/**
 * @return servletContext
 */
HttpServletResponseWrapper.getServletContext = function(){
    return this.servletContext;
};

/**
 * @return sessionContext
 */
HttpServletResponseWrapper.getSessionContext = function(){
    return this.sessionContext;
};

/**
 * @return JspWriter
 */
HttpServletResponseWrapper.getWriter = function(){
    if(this.writer == null)
    {
        this.writer = new JspWriter();
        this.writer.response = this;

        this.writer.write = function(source){
            if(source != null && source != undefined)
            {
                this.response.write(source);
            }
            else
            {
                this.response.write("null");
            }
        };
    }

    return this.writer;
};

/**
 * @param cookie
 */
HttpServletResponseWrapper.setCookie = function(cookie){
    var cookies = this.getHeader("set-cookie");

    if(cookies == null)
    {
        cookies = [];
    }
    else if(typeof(cookies) == "string")
    {
        cookies = [cookies];
    }

    var buffer = [cookie.name, "=", cookie.value];

    if(cookie.expires != null)
    {
        if(typeof(cookie.expires) == "number")
        {
            buffer.push("; expires=", (new Date(cookie.expires)).toUTCString());
        }
        else if(typeof(cookie.expires) == "object")
        {
            buffer.push("; expires=", cookie.expires.toUTCString());
        }
    }

    if(cookie.path != null)
    {
        buffer.push("; path=", cookie.path);
    }

    if(cookie.domain != null)
    {
        buffer.push("; domain=", cookie.domain);
    }

    if(cookie.secure == true)
    {
        buffer.push("; secure");
    }

    if(cookie.httpOnly == true)
    {
        buffer.push("; httponly");
    }

    cookies.push(buffer.join(""));

    this.setHeader("Set-Cookie", cookies);
};

/**
 * @param path
 */
HttpServletResponseWrapper.redirect = function(path){
    this.setHeader("Location", path);
    this.writeHead(302, "Moved Temporatily");
    this.end();
};

/**
 * $RCSfile: Cookie.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var JspWriter = function(){
    this.buffer = [];
};

/**
 * @param source
 */
JspWriter.prototype.write = function(source){
    if(source != null && source != undefined){
        this.buffer.push(source);
    }
    else
    {
        this.buffer.push("null");
    }
};

/**
 * @param source
 */
JspWriter.prototype.print = function(source){this.write(source);};

/**
 * @param source
 */
JspWriter.prototype.println = function(source){this.write(source); this.write("\r\n");};

/**
 * wrap a new JspWriter
 * @return BodyContent
 */
JspWriter.prototype.pushBody = function(){
    return null;
};

/**
 * unwrap the current JspWriter
 * @return BodyContent
 */
JspWriter.prototype.popBody = function(){
    return null;
};

/**
 * @param source
 */
JspWriter.prototype.flush = function(){
};

/**
 * close current stream
 */
JspWriter.prototype.close = function(){
};

/**
 * @return String
 */
JspWriter.prototype.getString = function(){
    return this.buffer.join("");
};

/**
 * @return String
 */
JspWriter.prototype.toString = function(){
    return this.buffer.join("");
};

/**
 * $RCSfile: Cookie.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function Cookie(){
};

/**
 * @return String
 */
Cookie.prototype.toString = function(){
    var buffer = [this.name, "=", this.value];

    if(this.expires != null && typeof(this.expires) == "number")
    {
        buffer.push("; expires=", (new Date(this.expires)).toUTCString());
    }

    if(this.path != null)
    {
        buffer.push("; path=", this.path);
    }

    if(this.domain != null)
    {
        buffer.push("; domain=", this.domain);
    }

    if(this.secure == true)
    {
        buffer.push("; secure");
    }

    if(this.httpOnly == true)
    {
        buffer.push("; httponly");
    }

    return buffer.join("");
};

/**
 * $RCSfile: HttpSession.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function HttpSession(sessionId){
    this.sessionId = sessionId;
    this.updateTime = new Date();
    this.attributes = {};
}

/**
 * @param sessionId
 */
HttpSession.prototype.setSessionId = function(sessionId){
    this.sesssionId = sessionId;
};

/**
 * @return String
 */
HttpSession.prototype.getSessionId = function(){
    return this.sesssionId;
};

/**
 * update time
 */
HttpSession.prototype.update = function(){
    return this.updateTime = new Date();
};

/**
 * Invalidates this session
 */
HttpSession.prototype.invalidate = function(){
    delete this.attributes;
    this.updateTime.setTime(0);
};

/**
 * @param name
 * @param value
 */
HttpSession.prototype.setAttribute = function(name, value){
    this.attributes[name] = value;
};

/**
 * @param name
 * @return Object
 */
HttpSession.prototype.getAttribute = function(name){
    return this.attributes[name];
};

/**
 * @param name
 */
HttpSession.prototype.remove = function(name){
    delete this.attributes[name];
};

/**
 *
 */
HttpSession.prototype.clear = function(){
    delete this.attributes;
    this.attributes = {};
};

/**
 * $RCSfile: SessionContext.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function SessionContext(timeout){
    this.index = 1;
    this.count = 0;
    this.SESSIONID = "jsessionid";
    this.timeout = timeout * 1000;
    this.sessions = {};
};

/**
 * @param response
 * @return HttpSession
 */
SessionContext.prototype.create = function(response){
    if(this.count >= 1000000)
    {
        throw new Error("TooManySessionException: Too many session to be created !");
    }

    var sessionId = [new Date().getTime(), this.index].join("");
    var expires = new Date().getTime() + this.timeout;
    var httpSession = new HttpSession(sessionId);

    this.sessions[sessionId] = httpSession;
    response.setCookie({"name": this.SESSIONID, "value": sessionId, "path": "/", "expires": expires});

    if(this.timer == null)
    {
        this.timer = new Timer(this, this.task, 5 * 60 * 1000);
        this.timer.start();
    }

    this.index++;
    this.count++;

    return httpSession;
};

/**
 * @param response
 * @return HttpSession
 */
SessionContext.prototype.update = function(request, response){
    var session = this.getSession(request);

    if(session != null)
    {
        session.update();
        var expires = session.updateTime.getTime() + this.timeout;
        response.setCookie({"name": this.SESSIONID, "value": session.sessionId, "path": "/", "expires": expires});
    }
};

/**
 * @param sessionId or request
 * @return HttpSession
 */
SessionContext.prototype.getSession = function(arg){
    var sessionId = null;

    if(typeof(arg) == "string")
    {
        sessionId = arg;
    }
    else if(typeof(arg) == "object")
    {
        var cookies = arg.getCookies();

        if(cookies != null)
        {
            sessionId = cookies[this.SESSIONID];
        }
    }

    if(sessionId != null)
    {
        var session = this.sessions[sessionId];

        if(session != null)
        {
            if((new Date().getTime() - session.updateTime.getTime()) > this.timeout)
            {
                this.count--;
                this.remove(sessionId);
                return null;
            }

            return session;
        }
    }

    return null;
};

/**
 * @param sessionId
 */
SessionContext.prototype.remove = function(sessionId){
    delete this.sessions[sessionId];
};

/**
 * clear SessionContext
 */
SessionContext.prototype.task = function(){
    var timeout = this.timeout;
    var timemillis = new Date().getTime();
    var sessions = this.sessions;
    var count = 0;

    for(var i in sessions)
    {
        if((timemillis - sessions[i].updateTime.getTime()) > timeout)
        {
            delete sessions[i];
        }
        else
        {
            count++;
        }
    }

    this.count = count;
};

/**
 * @param timeout
 */
SessionContext.prototype.setTimeout = function(timeout){
    this.timeout = timeout * 1000;
};

/**
 * $RCSfile: SessionContextFactory.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var SessionContextFactory = {};

/**
 * @param timeout
 * @return SessionContext
 */
SessionContextFactory.create = function(timeout){
    var sessionContext = new SessionContext(timeout);

    if(timeout == null || isNaN(timeout) || timeout < 1)
    {
        sessionContext.setTimeout(10 * 60 * 60);
    }

    return sessionContext;
};

/**
 * $RCSfile: Timer.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function Timer(target, method, interval)
{
    this.status = 0;
    this.target = target;
    this.method = method;
    this.interval = interval;
};

/**
 * private method, intenal method
 * invoke by this.start or this.run
 * @return function
 */
Timer.prototype.getTimer = /* private */ function(){
    if(this.timer == null)
    {
        var instance = this;

        this.timer = function(){
            instance.run();
            setTimeout(instance.getTimer(), instance.interval);
        };
    }

    return this.timer;
};

/**
 * start timer
 */
Timer.prototype.start = function(){
    if(this.status == 0)
    {
        this.status = 1;
        (this.getTimer())();
    }
};

/**
 * stop timer
 */
Timer.prototype.stop = function(){
    this.status = 1;
};

/**
 * execute task
 */
Timer.prototype.run = function(){
    this.method.apply(this.target);
};

/**
 * a abstract class, http 'method' dispatch
 * $RCSfile: HttpServlet.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
/* abstract */ function HttpServlet(){
}

/**
 * default servlet
 * @param request
 * @param response
 * @param servletChain
 */
HttpServlet.prototype.service = function(request, response, servletChain){
    var method = request.method.toUpperCase();

    if(method == "GET")
    {
        this.doGet(request, response, servletChain);
    }
    else if(method == "POST")
    {
        this.doPost(request, response, servletChain);
    }
    else if(method == "HEAD")
    {
        this.doHead(request, response, servletChain);
    }
    else if(method == "DELETE")
    {
        this.doDelete(request, response, servletChain);
    }
    else if(method == "CONNECT")
    {
        this.doConnect(request, response, servletChain);
    }
    else if(method == "OPTION")
    {
        this.doOption(request, response, servletChain);
    }
    else
    {
        response.writeHead(404, "Not Found", {"Content-Type": "text/plain"});
        response.end("<h1 error=\"10003\">UNKNOWN METHOD: " + method + "</h1>");
    }
};

/**
 * $RCSfile: JspServlet.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
function JspServlet(){
    this.pattern = /\.jsp$|\.jspf$|\.jspx$/;
    this.context = [];
    this.template = [
        "new (function(){",
        "this._jspService = function(request, response){",
        "var pageContext = jsp.runtime.JspFactory.getPageContext(this, request, response);",
        "var out = pageContext.getWriter();",
        "${METHOD_BODY}",
        "}/* service end */;",
        "${DECLARE_BODY}",
        "})();"
    ].join("\r\n");
}

/**
 * execute a .jsp file
 * @param request
 * @param response
 */
JspServlet.prototype.service = function(request, response, servletChain){
    var uri = request.requestURI;
    var contextPath = request.getContextPath();

    if(contextPath != "/")
    {
        var prefix = contextPath + "/";

        if(uri.length >= prefix.length && uri.substring(0, prefix.length) == prefix)
        {
            uri = uri.substring(contextPath.length);
        }
    }

    if(this.pattern.test(uri) == false)
    {
        servletChain.doChain(request, response);
        return;
    }

    this.execute(request, response, servletChain);
};

/**
 * require jsp.runtime.JspRuntime
 * @see https://github.com/xuesong123/jstl
 */
JspServlet.prototype.execute = function(request, response, servletChain){
    var uri = request.requestURI;
    var object = this.context[uri];
    var file = request.getServletContext().getRealPath(uri);

    if(fs.existsSync(file))
    {
        var stats = fs.statSync(file);
        var timestamp = stats.mtime.getTime();

        if(object != null && object.timestamp != timestamp)
        {
            object = null;
            delete this.context[uri];
        }

        if(object == null)
        {
            var source = fs.readFileSync(file, "UTF-8");
            var servlet = jsp.runtime.JspRuntime.compile(source, this.template);
            this.context[uri] = object = {"servlet": servlet, "timestamp": timestamp};
        }
    }

    if(object != null)
    {
        response.setHeader("Content-Type", "text/html");
        object.servlet.service(request, response, servletChain);
    }
    else
    {
        response.writeHead(404, "NotFound", {"Content-type": "text/html"});
        response.end("<h1 error=\"10004\">Request URL '" + request.requestURI + "' not found !</h1>");
    }
};

JspServlet.prototype.write = function(host, requestURI, content){
    var dir = "work/" + host + requestURI;
    var i = dir.lastIndexOf("/");

    if(i > -1)
    {
        dir = dir.substring(0, i);
    }

    if(fs.existsSync(dir) == false)
    {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync("work/" + host + requestURI, content, "UTF-8");
};

/**
 * disable *.jsp
 */
JspServlet.prototype.service = function(request, response, servletChain){
    servletChain.doChain(request, response);
};

var Bootstrap = {};

Bootstrap.create = function(host, home){
    var webServer = new WebServer();
    var vistualHost = new VistualHost(host);
    var root = fs.realpathSync(home);

    if(fs.existsSync(root) == false)
    {
        return webServer;
    }

    var stats = fs.statSync(root);

    if(stats.isFile())
    {
        return webServer;
    }

    var list = fs.readdirSync(root);

    for(var i = 0, length = list.length; i < length; i++)
    {
        var dir = list[i];
        var stats = fs.statSync(path.join(root, dir));

        if(stats.isDirectory())
        {
            var app = WebApplicationFactory.create(host, path.join(root, dir), "/" + dir);
            var servletContext = app.getServletContext();
            vistualHost.add(app);
        }
    }

    webServer.add(vistualHost);
    return webServer;
};

if(typeof(module) != "undefined")
{
    module.exports.WebServer = WebServer;
    module.exports.VistualHost = VistualHost;
    module.exports.WebApplicationFactory = WebApplicationFactory;
    module.exports.ServletContextFactory = ServletContextFactory;
    module.exports.SessionContextFactory = SessionContextFactory;
    module.exports.JspServlet = JspServlet;
    module.exports.Cookie = Cookie;
    module.exports.Bootstrap = Bootstrap;
}

/**
 * Servlet/JSP running
 * 1. WebApplication.dispatch -> getServletChain
 * returns servletChain, jspServlet, defaultServlet
 * servletChain: contains all serlvet
 * jspServlet: .jsp support
 * defaultServlet: static resource support
 */
