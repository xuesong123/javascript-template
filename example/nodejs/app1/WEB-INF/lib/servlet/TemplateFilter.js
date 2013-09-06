var os = require("os");
var fs = require("fs");
var path = require("path");
var ayada = require("./../ayada/ayada-1.0.0.min.js");
var scrollPageTaglib = require("./../taglib/scrollpage.taglib.js");
var helloTaglib = require("./../taglib/hellotag.taglib.js");
var util = require("./../util/util.js");
var StringUtil = util.StringUtil;

/**
 * setup app taglib
 */
ayada.TagLibraryFactory.setup("app:scrollpage", scrollPageTaglib.ScrollPageTag);
ayada.TagLibraryFactory.setup("app:cache", scrollPageTaglib.CacheTag);
ayada.TagLibraryFactory.setup("app:hello", helloTaglib.HelloTag);

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

    var contextPath = request.getContextPath();

    if(contextPath == null || contextPath == "/")
    {
        contextPath = "";
    }

    context["contextPath"] = contextPath;

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
var TemplateFilter = function(){
    this.home = "/template";
    this.dispatcher = ["FORWARD"];
    this.templateContext = null;
    this.expires = 0;
};

TemplateFilter.prototype.init = function(servletContext){
    console.log("[TemplateFilter]: work - " + servletContext.getRealPath(this.home));
    this.templateContext = new ayada.TemplateContext(servletContext.getRealPath(this.home), this.expires);
};

/**
 * @Override
 */
TemplateFilter.prototype.service = function(request, response, servletChain){
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

if(typeof(module) != "undefined")
{
    module.exports.TemplateFilter = TemplateFilter;
}