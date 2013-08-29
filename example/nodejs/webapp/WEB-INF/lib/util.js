var StringUtil = {};
StringUtil.startsWith = function(source, search){
    return (source.length >= search.length && source.substring(0, search.length) == search)
};

if(typeof(module) != "undefined")
{
    module.exports.StringUtil = StringUtil;
}