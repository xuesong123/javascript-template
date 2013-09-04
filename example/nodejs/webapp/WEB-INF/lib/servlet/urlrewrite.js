var UrlRewriteDispatcher = {};

UrlRewriteDispatcher.rules = [
    {
        "from": "^/test/a(\\d+)/b(\\d+)/c([019]?)/d(\\d+)/e(\\d+)/f([019]?)/g([019]?)/h([012345]?)/([A-Z]+)\\.html$",
        "to": "/test.do?a=$1&b=$2&c=$3&d=$4&e=$5&f=$6&g=$7&h=$8&i=$9",
        "type": "forward|redirect"
    },
    {
        "from": "^/userlist/(\\d+)\\.html$",
        "to": "/user/userList.do?pageNum=$1",
        "type": "forward|redirect"
    },
    {
        "from": "^/user/(\\d+)\\.html$",
        "to": "/user/user.do?userId=$1",
        "type": "forward|redirect"
    }
];

UrlRewriteDispatcher.init = function(servletContext){
    var rules = this.rules;

    for(var i = 0, length = rules.length; i < length; i++)
    {
        console.log("set rule: " + rules[i].from);
    }
};

// UrlRewriteDispatcher.init = null;

UrlRewriteDispatcher.service = function(request, response, servletChain){
    this.dispatch(request, response, servletChain);
};

UrlRewriteDispatcher.dispatch = function(request, response, servletChain){
    var requestURI = request.requestURI;
    var rules = this.rules;

    for(var i = 0, length = rules.length; i < length; i++)
    {
        var rule = rules[i];
        var regExp = new RegExp(rule.from);
        var arr = regExp.exec(requestURI);

        if(arr != null)
        {
            var args = [];
            var url = rule.to;

            for(var i = 1; i < arr.length; i++)
            {
                url = url.replace("$" + i, arr[i]);
            }

            console.log("urlrewrite.dispatch: " + requestURI + " - to " + url);

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

/**
 * for test
 * http://localhost/test/a1/b2/c3/d4/e5/f6/g7/h8/i.html
 */
if(typeof(module) != "undefined")
{
    module.exports.urlrewrite = UrlRewriteDispatcher;
}