var UrlRewriteDispatcher = function(){
    this.rules = [];
};

UrlRewriteDispatcher.prototype.init = function(servletContext){
    var rules = this.rules;

    for(var i = 0, length = rules.length; i < length; i++)
    {
        LogUtil.info("[UrlRewriteFilter]: set rule - " + rules[i].from);
    }
};

UrlRewriteDispatcher.prototype.service = function(request, response, servletChain){
    this.dispatch(request, response, servletChain);
};

UrlRewriteDispatcher.prototype.dispatch = function(request, response, servletChain){
    var requestURI = request.requestURI;
    var contextPath = request.getContextPath();
    var rules = this.rules;

    if(contextPath != null && contextPath != "/")
    {
        requestURI = requestURI.substring(contextPath.length);
    }

    if(requestURI == "")
    {
        requestURI = "/";
    }

    for(var i = 0, length = rules.length; i < length; i++)
    {
        var rule = rules[i];
        var regExp = new RegExp(rule.from);
        var arr = regExp.exec(requestURI);

        if(arr != null)
        {
            var url = rule.to;

            for(var i = 1; i < arr.length; i++)
            {
                url = url.replace("$" + i, arr[i]);
            }

            console.log("[URLREWRITE]: from " + requestURI + " to " + url);

            if(rule.type != "redirect")
            {
                request.getRequestDispatcher(url).forward(request, response);
            }
            else
            {
                response.redirect(url);
            }
            return true;
        }
    }

    servletChain.doChain(request, response, servletChain);
    return false;
};

UrlRewriteDispatcher.prototype.set = function(from, to, type){
    if(typeof(from) == "string")
    {
        this.rules.push({"from": from, "to": to, "type": type});
    }
    else
    {
        for(var i = 0; i < from.length; i++)
        {
            this.rules.push(from[i]);
        }
    }
};

var UrlRewriteFilter = function(){
    this.urlRewriteDispatcher = new UrlRewriteDispatcher();
};

UrlRewriteFilter.prototype.init = function(servletContext){
    this.urlRewriteDispatcher.init();
};

UrlRewriteFilter.prototype.service = function(request, response, servletChain){
    this.urlRewriteDispatcher.dispatch(request, response, servletChain);
};

UrlRewriteFilter.prototype.set = function(from, to, type){
    this.urlRewriteDispatcher.set(from, to, type);
};

/**
 * for test
 * http://localhost/test/a1/b2/c3/d4/e5/f6/g7/h8/i.html
 */
if(typeof(module) != "undefined")
{
    module.exports.UrlRewriteFilter = UrlRewriteFilter;
}