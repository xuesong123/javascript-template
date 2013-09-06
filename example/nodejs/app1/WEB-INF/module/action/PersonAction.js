var PersonAction = function(){
    this.request = null;
    this.response = null;
};

var mapping = {};

mapping["list"] = {"pattern": "^/person/list.do"};
PersonAction.prototype.list = function(){
    this.response.write("<p><a href=\"/person/test1.html\">test1</a></p>");
    this.response.write("<p><a href=\"/person/test2/test3/.html\">test2</a></p>");
    this.response.end();
};

/* http://localhost/person/test1.html */
mapping["test1"] = {"pattern": "^/person/test(\\d+)\\.html$"};
PersonAction.prototype.test1 = function(arg1){
    this.response.write("<h3>" + arg1 + "</h3>");
    this.response.end();
};

/* http://localhost/person/test1/test2.html */
mapping["test2"] = {"pattern": "^/person/test(\\d+)/test(\\d+)\\.html$"};
PersonAction.prototype.test2 = function(arg1, arg2){
    this.response.write("<h3>" + arg1 + ", " + arg2 + "</h3>");
    this.response.end();
};

PersonAction.annotation = mapping;

if(typeof(module) != "undefined")
{
    module.exports.action = PersonAction;
}