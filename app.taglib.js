(function(){
    if(typeof(module) != "undefined" && typeof(module.exports) != "undefined")
    {
        com = require("./ayada-1.0.0.min.js").com;
    }

    if(typeof(com) == "undefined")
    {
        com = {};
    }

    if(typeof(com.mytest) == "undefined")
    {
        com.mytest = {};
    }

    if(typeof(com.mytest.taglib) == "undefined")
    {
        com.mytest.taglib = {};
    }

    /*
     * $RCSfile: ScrollPageTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ScrollPageTag = com.mytest.taglib.ScrollPageTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport);

    ScrollPageTag.prototype.doStartTag = function(){
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    ScrollPageTag.prototype.doEndTag = function(){
        var page = {};
        page.pageNum = this.pageNum;
        page.pageSize = this.pageSize;
        page.total = this.total;
        page.href = this.href;
        page.className = this.className;
        page.pattern = this.pattern;

        this.getPageContext().getOut().print(this.render(page));
        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    ScrollPageTag.prototype.allocate = function(length, value){
        var a = [];

        for(var i = 0; i < length; i++)
        {
            a[i] = value;
        };

        return a;
    };

    ScrollPageTag.prototype.getPages = function(num, pages, size){
        var result = null;

        if(pages <= (size + 4))
        {
            var length = (pages > 0 ? pages : 1);
            result = this.allocate(length, 0);

            for(var i = 0; i < length; i++)
            {
                result[i] = i + 1;
            }

            return result;
        }

        var start = Math.floor(num - size / 2);
        var end = start + size;

        if(start < 3)
        {
            start = 1;
            end = start + size + 1;
            result = this.allocate(size + 3, 0);
        }
        else if((start + size) >= pages)
        {
            start = pages - size;
            end = start + size;
            result = this.allocate(size + 3, 0);
        }
        else
        {
            end = start + size;
            result = this.allocate(size + 4, 0);
        }

        result[0] = 1;
        result[result.length - 1] = pages;

        if(start >= 3)
        {
            if(start == 3)
            {
                result[1] = 2;
            }

            for(var i = start; i < end; i++)
            {
                result[i - start + 2] = i;
            }
        }
        else
        {
            start = 1;
            end = size + 2;

            for(var i = start; i < end; i++)
            {
                result[i - start] = i;
            }
        }

        return result;
    };

    ScrollPageTag.prototype.render = function(page){
        if(page.pageNum < 1)
        {
            page.pageNum = 1;
        }

        if(page.pageSize < 1)
        {
            page.pageSize = 1;
        }

        if(page.className == null)
        {
            page.className = "";
        }

        if(page.href == null || page.href.length < 1)
        {
            page.href = "javascript:void(0)";
        }

        if(page.pattern == null)
        {
            page.pattern = "每页!{pageSize}篇，共!{total}篇";
        }

        var count = this.getCount(page);
        var pages = this.getPages(page.pageNum, count, 7);

        var buffer = [];
        buffer[buffer.length] = "<div";

        if(page.className != null)
        {
            buffer[buffer.length] = " class=\"" + page.className + "\"";
        }

        buffer[buffer.length] = " page=\"" + page.pageNum + "\" count=\"" + count + "\" total=\"" + page.total + "\">";

        if(page.pageNum > 1)
        {
            var prev = this.replace(page.href, "%s", page.pageNum - 1);
            buffer[buffer.length] = "<a class=\"block scrollpage\" href=\"" + prev + "\" page=\"" + (page.pageNum - 1) + "\" title=\"上一页\">上一页</a>";
        }
        else
        {
            var prev = "javascript:void(0)";
            buffer[buffer.length] = "<a class=\"block\" href=\"" + prev + "\" page=\"" + (page.pageNum - 1) + "\" title=\"上一页\">上一页</a>";
        }

        for(var i = 0; i < pages.length; i++)
        {
            var n = pages[i];

            if(n != 0)
            {
                if(n == page.pageNum)
                {
                    buffer[buffer.length] = "<a class=\"block active scrollpage\" href=\"" + this.replace(page.href, "%s", n) + "\" page=\"" + n + "\">" + n + "</a>";
                }
                else
                {
                    buffer[buffer.length] = "<a class=\"block scrollpage\" href=\"" + this.replace(page.href, "%s", n) + "\" page=\"" + n + "\">" + n + "</a>";
                }
            }
            else
            {
                buffer[buffer.length] = "<a href=\"javascript:void(0)\">...</a>";
            }
        }

        if(page.pageNum < count)
        {
            var next = this.replace(page.href, "%s", page.pageNum + 1);
            buffer[buffer.length] = "<a href=\"" + next + "\" class=\"block scrollpage\" page=\"" + (page.pageNum + 1) + "\" title=\"下一页\">下一页</a>";
        }
        else
        {
            var next = "javascript:void(0)";
            buffer[buffer.length] = "<a href=\"" + next + "\" class=\"block\" page=\"" + (page.pageNum + 1) + "\" title=\"下一页\">下一页</a>";
        }

        var info = page.pattern;
        info = this.replace(info, "!{pageSize}", page.pageSize);
        info = this.replace(info, "!{pageNum}", page.pageNum);
        info = this.replace(info, "!{total}", page.total);
        info = this.replace(info, "!{count}", count);
        buffer[buffer.length] = "&nbsp;&nbsp;到第<input type=\"text\" class=\"sr scrollpage\" value=\"" + page.pageNum + "\"/>页";
        buffer[buffer.length] = "<input type=\"button\" class=\"button scrollpage\" value=\"跳转\"/>";
        buffer[buffer.length] = info;
        buffer[buffer.length] = "</div>";
        return buffer.join("");
    };

    ScrollPageTag.prototype.replace = function(source, search, page){
        if(source == null)
        {
            return "";
        }

        if(search == null)
        {
            return source;
        }

        var s = 0;
        var e = 0;
        var buffer = [];

        do
        {
            e = source.indexOf(search, s);

            if(e == -1)
            {
                buffer[buffer.length] = source.substring(s);
                break;
            }
            else
            {
                buffer[buffer.length] = source.substring(s, e) + page;
                s = e + search.length;
            }
        }
        while(true);
        return buffer.join("");
    };

    ScrollPageTag.prototype.getCount = function(page){
        return Math.floor((page.total + (page.pageSize - 1)) / page.pageSize);
    };

    ScrollPageTag.prototype.setPageNum = function(pageNum){
        this.pageNum = pageNum;
    };

    ScrollPageTag.prototype.getPageNum = function(){
        return this.pageNum;
    };

    ScrollPageTag.prototype.setPageSize = function(pageSize){
        this.pageSize = pageSize;
    };

    ScrollPageTag.prototype.getPageSize = function(){
        return this.pageSize;
    };

    ScrollPageTag.prototype.setClassName = function(className){
        this.className = className;
    };

    ScrollPageTag.prototype.getClassName = function(){
        return this.className;
    };

    ScrollPageTag.prototype.setTotal = function(total){
        this.total = total;
    };

    ScrollPageTag.prototype.getTotal = function(){
        return this.total;
    };

    ScrollPageTag.prototype.setHref = function(href){
        this.href = href;
    };

    ScrollPageTag.prototype.getHref = function(){
        return this.href;
    };

    ScrollPageTag.prototype.setPattern = function(pattern){
        this.pattern = pattern;
    };

    ScrollPageTag.prototype.getPattern = function(){
        return this.pattern;
    };

    var Cache = function(){
        this.cache = [];
    };

    var CacheEntry = function(key, expires, value){
        this.key = key;
        this.value = value;
        this.expires = new Date().getTime() + expires * 1000;
    };

    Cache.prototype.setCache = function(key, expires, value){
        this.cache[key] = new CacheEntry(key, expires, value);
    };

    Cache.prototype.getCache = function(key){
        var entry = this.cache[key];

        if(entry != null)
        {
            var timeMillis = (new Date()).getTime();

            if(timeMillis > entry.expires)
            {
                this.cache[key] = null;
                return null;
            }

            return entry.value;
        }

        return null;
    };

    var CacheFactory = {};

    CacheFactory.getCache = function(){
        if(this.cache == null)
        {
            this.cache = new Cache();
        }

        return this.cache;
    };

    /*
     * $RCSfile: ScrollPageTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var CacheTag = com.mytest.taglib.CacheTag = com.skin.framework.Class.create(com.skin.ayada.tagext.BodyTagSupport, function(){
        this.key = null;
        this.expires = 0;
    });

    CacheTag.prototype.doStartTag = function(){
        if(this.getExpires() < 5)
        {
            return com.skin.ayada.tagext.Tag.EVAL_PAGE;
        }

        var cache = CacheFactory.getCache();
        var content = cache.getCache(this.getKey());

        if(content != null)
        {
            try
            {
                this.pageContext.getOut().write(content);
            }
            catch(e)
            {
            }

            return com.skin.ayada.tagext.Tag.SKIP_BODY;
        }
        else
        {
            return com.skin.ayada.tagext.Tag.EVAL_PAGE;
        }
    }

    CacheTag.prototype.doEndTag = function(){
        var bodyContent = this.getBodyContent();
        var content = bodyContent.getString();

        if(this.getExpires() >= 5)
        {
            CacheFactory.getCache().setCache(this.getKey(), this.getExpires(), content);
        }

        try
        {
            this.pageContext.getOut().write(content);
        }
        catch(e)
        {
        }

        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    }

    /**
     * @param key the key to set
     */
    CacheTag.prototype.setKey = function(key){
        this.key = key;
    };

    /**
     * @return the key
     */
    CacheTag.prototype.getKey = function(){
        return this.key;
    };

    /**
     * @param expires the expires to set
     */
    CacheTag.prototype.setExpires = function(expires){
        this.expires = parseInt(expires);
    };

    /**
     * @return the expires
     */
    CacheTag.prototype.getExpires = function(){
        return this.expires;
    };
})();

/**
 * nodejs support
 */
if(typeof(module) != "undefined")
{
    module.exports.ScrollPageTag = com.mytest.taglib.ScrollPageTag;
    module.exports.CacheTag = com.mytest.taglib.CacheTag;
}