var TemplateFilter = new (require("./../../lib/servlet/TemplateFilter").TemplateFilter)();
TemplateFilter.home = "/template";
TemplateFilter.dispatcher = ["FORWARD"];
TemplateFilter.expires = 0;

if(typeof(module) != "undefined")
{
    module.exports.TemplateFilter = TemplateFilter;
}