(function(){
    if(typeof(module) != "undefined" && typeof(module.exports) != "undefined")
    {
        com = require("../ayada/ayada-1.0.0.min.js").com;
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
    var HelloTag = com.mytest.taglib.HelloTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport);

    HelloTag.prototype.doStartTag = function(){
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    HelloTag.prototype.doStartTag = function(){
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    HelloTag.prototype.doEndTag = function(){
        this.getPageContext().getOut().print("Hello, " + this.message + " !");
        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };
})();

/**
 * nodejs support
 */
if(typeof(module) != "undefined")
{
    module.exports.HelloTag = com.mytest.taglib.HelloTag;
}