var ayada = require("ayada");
var filter = require("./../../lib/servlet/TemplateFilter");
var taglib = require("./../taglib/taglib2.js");

/**
 * setup app taglib
 */
ayada.TagLibraryFactory.setup("app:scrollpage", taglib.ScrollPageTag);
ayada.TagLibraryFactory.setup("app:cache", taglib.CacheTag);
ayada.TagLibraryFactory.setup("app:hello", taglib.HelloTag);

var TemplateFilter = new filter.TemplateFilter();
TemplateFilter.home = "/template";
TemplateFilter.dispatcher = ["FORWARD"];
TemplateFilter.expires = 0;

if(typeof(module) != "undefined")
{
    module.exports.TemplateFilter = TemplateFilter;
}