var UrlRewriteFilter = new (require("./../../lib/servlet/urlrewrite.js").UrlRewriteFilter)();

UrlRewriteFilter.set([
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
]);

if(typeof(module) != "undefined")
{
    module.exports.urlrewrite = UrlRewriteFilter;
}