var pageContext = {};
pageContext.user = {"userName": "test1", "age": 21};
pageContext.userList = [
    {"name": "test1", "age": 21},
    {"name": "test2", "age": 22},
    {"name": "test3", "age": 23},
    {"name": "test4", "age": 24},
    {"name": "test5", "age": 25}
];

var ExprContext = {};

ExprContext.evaluate = function(expression, pageContext){
    var f = new Function("with(this){return " + expression +  "}");
    return f.apply(pageContext);
};


ExprContext.test = function(){
    var result = ExprContext.evaluate("user.userName", pageContext);
    logger.debug(result);
};

function forEachTagTest(){
    var writer = {};
    writer.buffer = [];

    writer.write = function(content){
        this.buffer.push(content);
    };

    writer.toString = function(content){
        return this.buffer.join("");
    };

    var templateContext = {};
    var pageContext = com.skin.ayada.runtime.JspFactory.getPageContext(templateContext, writer);
    var forEachTag = new com.skin.ayada.jstl.core.ForEachTag();
    forEachTag.setPageContext(pageContext);
    forEachTag.setItems("1, 2, 3");
    var flag = forEachTag.doStartTag();
    logger.debug("2 index: " + forEachTag.getIndex());
}

function test2(){
    var expressionContext = com.skin.ayada.runtime.ExpressionContextFactory.create(pageContext);
    var result = com.skin.ayada.util.TagUtil.evaluate(expressionContext, "user");
    logger.debug(result);
}