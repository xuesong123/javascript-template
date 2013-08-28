var com = (function(){
    if(typeof(com) == "undefined")
    {
        com = {};
    }
    else
    {
        return com;
    }

    if(typeof(com.skin) == "undefined"){
        com.skin = {};
    }

    if(typeof(com.skin.framework) == "undefined"){
        com.skin.framework = {};
    }

    /*
     * $RCSfile: Package.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Package = com.skin.framework.Package = {};

    /**
     * create package object
     * var com = Package.create("com.test1.test1"); // will return {"test1": {"test1": {}}};
     * logger.debug(com.test1.test1.packageName);
     * @param name
     * @return Object
     */
    Package.create = function(name){
        var a = name.split(".");

        if(a.length < 1)
        {
            return {};
        }

        var p = {};
        var object = p;

        for(var i = 1; i < a.length; i++)
        {
            p = p[a[i]] = {"packageName": a[i]};
        }

        return object;
    };

    /*
     * $RCSfile: Class.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Class = com.skin.framework.Class = {};

    /**
     * create a class
     * function Animal(){
     *     this.move = function(){logger.debug("move");};
     *     logger.debug("I am great !");
     * };
     * var Duck = Class.create(Animal, function(){
     *    this.swim = function(){
     *        logger.debug("help! help!");
     *    };
     *    logger.debug("I am very great !");
     * });
     * var myduck = new Duck();
     * myduck.move();
     * myduck.swim();
     * will print:
     * I am great !
     * I am very great !
     * move
     * help! help!
     * @param parent
     * @param constructor
     * @return Object
     */
    Class.create = function(parent, constructor){
        var clazz = null;

        if(parent != null)
        {
            if(constructor != null)
            {
                clazz = function(){/* Class.create */ parent.apply(this, arguments); clazz.$super = parent.prototype; constructor.apply(this, arguments);};
            }
            else
            {
                clazz = function(){/* Class.create */ parent.apply(this, arguments); clazz.$super = parent.prototype;};
            }

            for(var property in parent.prototype)
            {
                clazz.prototype[property] = parent.prototype[property];
            }
        }
        else
        {
            if(constructor != null)
            {
                clazz = function(){/* Class.create */ clazz.$super = {}; constructor.apply(this, arguments);};
            }
            else
            {
                clazz = function(){/* Class.create */ clazz.$super = {};};
            }
        }

        return (clazz.prototype.constructor = clazz);
    };

    /**
     * @param prototype
     * @param instance
     * @retur Object
     */
    Class.$super = /* private */ function(instance, prototype){
        var object = {};

        for(var i in prototype)
        {
            if(typeof(prototype[i]) == "function")
            {
                object[i] = function(){prototype[i].apply(instance, arguments);};
            }
        }

        return object;
    };

    /**
     * simple singleton
     * var myduck = Class.getInstance(Animal, function(){this.swim = function(){};});
     * myduck.swim();
     * @param parent
     * @param constructor
     * @return Object
     */
    Class.getInstance = function(parent, constructor){
        return new (Class.create(parent, constructor))();
    };

    /**
     * extend properties
     * @param child
     * @param parent
     * @return Object
     */
    Class.extend = function(child, parent){
        if(child == null)
        {
            child = {};
        }

        for(var property in parent)
        {
            child[property] = parent[property];
        }

        return child;
    };

    if(typeof(com.skin.log) == "undefined"){
        com.skin.log = {};
    }

    if(typeof(com.skin.log.logger) == "undefined"){
        com.skin.log.logger = {};
    }

    var Logger = com.skin.log.Logger = function(className){
        this.level = 5;
        this.className = className;
    };

    Logger.DEBUG = 1;
    Logger.INFO = 2;

    Logger.prototype.write = function(content){
        /* WScript.echo(content); */
    };

    Logger.prototype.log = function(){
        var content = null;
        var length = arguments.length;

        if(length < 1)
        {
            content = "null";
        }
        else if(length == 1)
        {
            content = arguments[0];
        }
        else if(length > 1)
        {
            var buffer = [];

            for(var i = 0; i < arguments.length; i++)
            {
                buffer.push(arguments[i]);
            }

            content = buffer.join("");
        }

        this.write(content);
    };

    Logger.prototype.info = function(){
        this.log.apply(this, arguments);
    };

    Logger.prototype.debug = function(){
        this.log.apply(this, arguments);
    };

    Logger.prototype.isDebugEnabled = function(){
        return this.level > Logger.DEBUG;
    };

    Logger.prototype.isInfoEnabled = function(){
        return this.level > Logger.Info;
    };

    var LoggerFactory = com.skin.log.LoggerFactory = {};

    LoggerFactory.getLogger = function(className){
        return new Logger(className);
    };

    return com;
})();

(function(){
    if(typeof(com.skin.util) == "undefined"){
        com.skin.util = {};
    }

    /*
     * $RCSfile: StringUtil.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var StringUtil = com.skin.util.StringUtil = {};

    StringUtil.isISOControl = function(c){
        return (c == "\r" || c == "\n" || c == "\t" || c == "\b" || c == "\f");
    };

    /**
     * @param c
     * @return boolean
     */
    StringUtil.isLetter = function(c){
        var i = c.charCodeAt(0);
        return (i >= 97 && i <= 122) || (i >= 65 && i <= 97);
    };

    /**
     * @param c
     * @return boolean
     */
    StringUtil.isDigit = function(c){
        var i = c.charCodeAt(0);
        return (i >= 48 && i <= 57);
    };

    /**
     * @param source
     * @return boolean
     */
    StringUtil.trim = function(source){return (source != null ? source.replace(/(^\s*)|(\s*$)/g, "") : "");};

    /**
     * @param source
     * @return boolean
     */
    StringUtil.startsWith = function(source, search){
        if(source.length >= search.length)
        {
            return (source.substring(0, search.length) == search);
        }

        return false;
    };

    /**
     * @param source
     * @return boolean
     */
    StringUtil.endsWith = function(source, search){
        if(source.length >= search.length)
        {
            return (source.substring(source.length - search.length) == search);
        }

        return false;
    };

    var DateFormat = com.skin.util.DateFormat = {};

    DateFormat.format = function(date, pattern){
        if(date == null)
        {
            return "";
        }

        var dateTime = this.toString(date);
        var cs = ["y", "M", "d", "H", "m", "s", "S"];
        var fs = pattern.split("");
        var ds = dateTime.split("");

        var y = 3;
        var M = 6;
        var d = 9;
        var H = 12;
        var m = 15;
        var s = 18;
        var S = 22;

        for(var i = fs.length - 1; i > -1; i--)
        {
            switch (fs[i])
            {
                case cs[0]:
                {
                    fs[i] = ds[y--];
                    break;
                }
                case cs[1]:
                {
                    fs[i] = ds[M--];
                    break;
                }
                case cs[2]:
                {
                    fs[i] = ds[d--];
                    break;
                }
                case cs[3]:
                {
                    fs[i] = ds[H--];
                    break;
                }
                case cs[4]:
                {
                    fs[i] = ds[m--];
                    break;
                }
                case cs[5]:
                {
                    fs[i] = ds[s--];
                    break;
                }
                case cs[6]:
                {
                    fs[i] = ds[S--];
                    break;
                }
            }
        }

        return fs.join("");
    };

    DateFormat.toString = function(date){
        if(date == null)
        {
            return "";
        }

        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var S = date.getTime() % 1000;

        var a = [];

        a[a.length] = y.toString();
        a[a.length] = "-";

        if(M < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = M.toString();
        a[a.length] = "-";

        if(d < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = d.toString();
        a[a.length] = " ";

        if(h < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = h.toString();
        a[a.length] = ":";

        if(m < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = m.toString();
        a[a.length] = ":";

        if(s < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = s.toString();
        a[a.length] = " ";

        if(S < 100)
        {
            a[a.length] = "0";
        }

        if(S < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = S.toString();
        return a.join("");
    };

    /*
     * $RCSfile: Stack.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Stack = com.skin.util.Stack = function(){
        this.stack = [];
    };

    /**
     * @param e
     */
    Stack.prototype.push = function(e){
        this.stack.push(e);
    };

    /**
     * @return Object
     */
    Stack.prototype.pop = function(){
        var e = this.poll();

        if(e == null)
        {
            throw new {"name": "IllegalStateException", "message": "IllegalStateException"};
        }

        return e;
    };

    /**
     * @return Object
     */
    Stack.prototype.poll = function(){
        var index = this.stack.length;

        if(index > 0)
        {
            var e = this.stack[index - 1];
            this.stack.length = index - 1;
            return e;
        }

        return null;
    };

    /**
     * @param i
     * @return Object
     */
    Stack.prototype.peek = function(i){
        if(i == null)
        {
            i = -1;
        }

        var index = this.stack.length;

        if((index + i) >= 0 && (index + i) < index)
        {
            return this.stack[index + i];
        }

        return null;
    };

    /**
     * @param i
     * @return Object
     */
    Stack.prototype.element = function(i){
        if(i > -1 && i < this.stack.length)
        {
            return this.stack[i];
        }

        return null;
    };

    /**
     * @return int
     */
    Stack.prototype.size = function(){
        return this.stack.length;
    };

    /**
     * @return String
     */
    Stack.prototype.getTrace = function(){
        var buffer = [];
        buffer.push("**** stack ****\r\n");

        for(var i = this.stack.length - 1; i > -1; i--)
        {
            var l = i;
            var e = this.stack[i];

            if(i < 10)
            {
                l = "   " + i;
            }
            else if(i < 100)
            {
                l = "  " + i;
            }
            else if(i < 1000)
            {
                l = " " + i;
            }

            buffer.push(l + " -> ");

            if(typeof(e) == "object")
            {
                for(var n in e)
                {
                    buffer.push(n + ": " + e[n]);
                    buffer.push(", ");
                }
            }
            else
            {
                buffer.push(e);
            }

            buffer.push("\r\n");
        }

        return buffer.join("");
    };

    /**
     * @return String
     */
    Stack.prototype.toString = function(){
        return this.getTrace();
    };
})();

(function(){
    if(typeof(com.skin.io) == "undefined"){
        com.skin.io = {};
    }

    /*
     * $RCSfile: StringStream.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var StringStream = com.skin.io.StringStream = function(source){
        this.position = 0;
        this.length = source.length;
        this.buffer = source;
        this.closed = false;
    };

    StringStream.prototype.back = function(length){
        if(length == null)
        {
            length = 1;
        }

        if(length < 1)
        {
            return 0;
        }

        var len = (length > this.position ? this.position : length);
        this.position -= len;
        return len;
    };

    /**
     * @param offset
     * @return char
     */
    StringStream.prototype.peek = function(offset){
        if(this.position < this.length)
        {
            if(offset != null)
            {
                return this.buffer.charAt(this.position + offset);
            }
            else
            {
                return this.buffer.charAt(this.position);
            }
        }

        return -1;
    };

    /**
     * @param cbuf
     * @param offset
     * @param length
     * @return int
     */
    StringStream.prototype.read = function(cbuf, offset, length){
        if(this.closed == true)
        {
            throw {"name": "IOException", "message": "stream is closed !"};
        }

        if(cbuf == null)
        {
            if(this.position < this.length)
            {
                return this.buffer.charAt(this.position++);
            }

            return -1;
        }

        if(offset == null)
        {
            offset = 0;
        }

        if(length == null)
        {
            length = cbuf.length;
        }

        var size = Math.min(this.length - this.position, length);

        if(size > 0)
        {
            for(var i = 0; i < length; i++)
            {
                cbuf[offset + i] = this.buffer.charAt(this.position++);
            }
        }
        else
        {
            size = -1;
        }

        return size;
    };

    /**
     * @param test
     * @return String
     */
    StringStream.prototype.tryread = function(test){
        var size = test.length;

        if((this.length - this.position) >= size)
        {
            var i = this.position;

            for(var j = 0; j < size; i++, j++)
            {
                if(this.buffer.charAt(i) != test.charAt(j))
                {
                    return -1;
                }
            }

            this.position += size;
            return this.buffer.substring(i - size, i);
        }

        return -1;
    };

    /**
     * @param position
     */
    StringStream.prototype.setPosition = function(position){
        this.position = position;
    };

    /**
     * @return int
     */
    StringStream.prototype.getPosition = function(){
        return this.position;
    };

    /**
     * @param position
     */
    StringStream.prototype.setPosition = function(position){
        this.position = position;
    };

    /**
     * @return int
     */
    StringStream.prototype.getPosition = function(){
        return this.position;
    };

    /**
     * @return int
     */
    StringStream.prototype.length = function(){
        return this.length;
    };

    /**
     * close stream
     */
    StringStream.prototype.close = function(){
        this.closed = true;
    };

    /*
     * $RCSfile: StringWriter.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var StringWriter = com.skin.io.StringWriter = function(){
        this.buffer = [];
    };

    /**
     * @param source
     */
    StringWriter.prototype.write = function(content){
        this.buffer.push(content);
    };

    /**
     * flush stream
     */
    StringWriter.prototype.flush = function(){};

    /**
     * close stream
     */
    StringWriter.prototype.close = function(){};

    /**
     * @return String
     */
    StringWriter.prototype.toString = function(){
        return this.buffer.join("");
    };
})();

(function(){
    if(typeof(com.skin.ayada) == "undefined"){
        com.skin.ayada = {};
    }

    if(typeof(com.skin.ayada.statement) == "undefined"){
        com.skin.ayada.statement = {};
    }

    /*
     * $RCSfile: NodeType.js,v $$
     * $Revision: 1.1  $
     * $Date: 2013-2-19  $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var NodeType = com.skin.ayada.statement.NodeType = {};

    NodeType.DOCTYPE = "html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"";
    NodeType.NODE    = 1;
    NodeType.TEXT    = 2;
    NodeType.COMMENT = 3;
    NodeType.CDATA   = 4;
    NodeType.EXPRESSION = 2013;

    NodeType.EXPR_NAME    = "#expr";
    NodeType.DATA_NAME    = "#data";
    NodeType.TEXT_NAME    = "#text";
    NodeType.CDATA_NAME   = "<![CDATA[";
    NodeType.COMMENT_NAME = "#comment";
    NodeType.PAIR_CLOSED  = 2;
    NodeType.SELF_CLOSED  = 3;

    /*
     * $RCSfile: Node.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-7-3 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Node = com.skin.ayada.statement.Node = function(nodeName, nodeType){
        this.nodeName = nodeName;
        this.nodeType = nodeType;
        this.offset = 0;
        this.length = 0;
        this.lineNumber = 0;
        this.closed = 1;
        this.parent = null;
        this.attributes = {};
    };

    /**
     * @param name
     */
    Node.prototype.setNodeName = function(nodeName){
        this.nodeName = nodeName;
    };

    /**
     * @return String
     */
    Node.prototype.getNodeName = function(){
        return this.nodeName;
    };

    /**
     * @param nodeType the nodeType to set
     */
    Node.prototype.setNodeType = function(nodeType){
        this.nodeType = nodeType;
    };

    /**
     * @return the nodeType
     */
    Node.prototype.getNodeType = function(){
        return this.nodeType;
    };

    /**
     * @param offset the offset to set
     */
    Node.prototype.setOffset = function(offset){
        this.offset = offset;
    };

    /**
     * @return the offset
     */
    Node.prototype.getOffset = function(){
        return this.offset;
    };

    /**
     * @param length the length to set
     */
    Node.prototype.setLength = function(length){
        this.length = length;
    };

    /**
     * @return the length
     */
    Node.prototype.getLength = function(){
        return this.length;
    };

    /**
     * @param closed
     */
    Node.prototype.setClosed = function(closed){
        this.closed = closed;
    };

    /**
     * @return var
     */
    Node.prototype.getClosed = function(){
        return this.closed;
    };

    /**
     * @param lineNumber
     */
    Node.prototype.setLineNumber = function(lineNumber){
        this.lineNumber = lineNumber;
    };

    /**
     * @return lineNumber
     */
    Node.prototype.getLineNumber = function(){
        return this.lineNumber;
    };

    /**
     * @param name
     * @param value
     */
    Node.prototype.setAttribute = function(name, value){
        this.attributes[name] = value;
    };

    /**
     * @param name
     * @return String
     */
    Node.prototype.getAttribute = function(name){
        return this.attributes[name];
    };

    /**
     * @return the attributes
     */
    Node.prototype.getAttributes = function(){
        return this.attributes;
    };

    /**
     * @param attributes the attributes to set
     */
    Node.prototype.setAttributes = function(attributes){
        this.attributes = attributes;
    };

    /**
     * @param parent the parent to set
     */
    Node.prototype.setParent = function(parent){
        this.parent = parent;
    };

    /**
     * @return the parent
     */
    Node.prototype.getParent = function(){
        return this.parent;
    };

    /**
     * @return the Node
     */
    Node.prototype.clone = function(){
        var node = new Node(this.nodeName);
        node.setClosed(this.closed);
        node.setParent(this.parent);

        for(var i in this.attributes)
        {
            node.setAttribute(i, this.attributes[i]);
        }

        return node;
    };

    /**
     * @return String
     */
    Node.prototype.getAttributesHtml = function(){
        var buffer = [];

        for(var i in this.attributes)
        {
            buffer[buffer.length] = i;
            buffer[buffer.length] = "=\"";
            buffer[buffer.length] = this.attributes[i];
            buffer[buffer.length] = "\" ";
        }

        return buffer.join("");
    };

    /**
     * @return String
     */
    Node.prototype.toString = function(index){
        var buffer = [];

        if(index == this.getOffset())
        {
            buffer.push("<");
            buffer.push(this.getNodeName());
            buffer.push(" offset=\"");
            buffer.push(this.getOffset());
            buffer.push("\" length=\"");
            buffer.push(this.getLength());
            buffer.push("\"");

            if(this.attributes != null)
            {
                for(var i in this.attributes)
                {
                    buffer.push(" ");
                    buffer.push(i);
                    buffer.push("=\"");
                    buffer.push(this.attributes[i]);
                    buffer.push("\"");
                }
            }

            buffer.push(">");
        }
        else
        {
            buffer.push("</");
            buffer.push(this.getNodeName());
            buffer.push(">");
        }

        return buffer.join("");
    };

    /*
     * $RCSfile: DataNode.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-7-3 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var DataNode = com.skin.ayada.statement.DataNode = com.skin.framework.Class.create(com.skin.ayada.statement.Node, function(){
        this.nodeName = NodeType.DATA_NAME;
        this.nodeType = NodeType.CDATA;
        this.buffer = [];
    });

    /**
     * @param data
     */
    DataNode.prototype.append = function(data){
        this.buffer.push(data);
    };

    /**
     * @return String
     */
    DataNode.prototype.getText = function(){
        return this.buffer.join("");
    };

    /**
     * @return String
     */
    DataNode.prototype.getTrimText = function(){
        return this.buffer.join("");
    };

    /**
     *@return String
     */
    DataNode.prototype.getNodeHtml = function(){
        return this.buffer.join("");
    };

    /**
     * @return DataNode
     */
    DataNode.prototype.clone = function(){
        return null;
    };

    /**
     * @return String
     */
    DataNode.prototype.toString = function(){
        return this.buffer.join("");
    };

    /*
     * $RCSfile: Expression.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-7-3 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Expression = com.skin.ayada.statement.Expression = com.skin.framework.Class.create(com.skin.ayada.statement.DataNode, function(){
        this.nodeName = NodeType.EXPR_NAME;
        this.nodeType = NodeType.EXPRESSION;
    });

    /**
     * @return Expression
     */
    Expression.prototype.clone = function(){
        var node = new Expression();
        node.setNodeName(this.getNodeName());
        node.setNodeType(this.getNodeType());
        node.setOffset(this.getOffset());
        node.setLength(this.getLength());
        node.setLineNumber(this.getLineNumber());
        node.setClosed(this.getClosed());
        node.setParent(this.getParent());
        node.append(this.getText());
        return node;
    };

    /**
     * @return TextNode
     */
    Expression.prototype.toString = function(){
        return this.buffer.join("");
    };

    /*
     * $RCSfile: TextNode.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-7-3 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TextNode = com.skin.ayada.statement.TextNode = com.skin.framework.Class.create(com.skin.ayada.statement.DataNode, function(){
        this.nodeName = NodeType.TEXT_NAME;
        this.nodeType = NodeType.TEXT;
    });

    /**
     * @return TextNode
     */
    TextNode.prototype.clone = function(){
        var node = new TextNode();
        node.setNodeName(this.getNodeName());
        node.setNodeType(this.getNodeType());
        node.setOffset(this.getOffset());
        node.setLength(this.getLength());
        node.setLineNumber(this.getLineNumber());
        node.setClosed(this.getClosed());
        node.setParent(this.getParent());
        node.append(this.getText());
        return node;
    };

    /**
     * @return TextNode
     */
    TextNode.prototype.toString = function(){
        return this.buffer.join("");
    };

    /*
     * $RCSfile: Statement.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-7-3 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Statement = com.skin.ayada.statement.Statement = function(node){
        this.tag = null;
        this.node = node;
        this.parent = null;
        this.startTagFlag = 0;
    };

    /**
     * @return the tag
     */
    Statement.prototype.getTag = function(){
        return this.tag;
    };

    /**
     * @param tag the tag to set
     */
    Statement.prototype.setTag = function(tag){
        this.tag = tag;
    };

    /**
     * @return the node
     */
    Statement.prototype.getNode = function(){
        return this.node;
    };

    /**
     * @param node the node to set
     */
    Statement.prototype.setNode = function(node){
        this.node = node;
    };

    /**
     * @return the parent
     */
    Statement.prototype.getParent = function(){
        return this.parent;
    };

    /**
     * @param parent the parent to set
     */
    Statement.prototype.setParent = function(parent){
        this.parent = parent;
    };

    /**
     * @return the startTagFlag
     */
    Statement.prototype.getStartTagFlag = function(){
        return this.startTagFlag;
    };

    /**
     * @param startTagFlag the startTagFlag to set
     */
    Statement.prototype.setStartTagFlag = function(startTagFlag){
        this.startTagFlag = startTagFlag;
    };
})();

(function(){
    if(typeof(com.skin.ayada.runtime) == "undefined"){
        com.skin.ayada.runtime = {};
    }

    /*
     * $RCSfile: JspWriter.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var JspWriter = com.skin.ayada.runtime.JspWriter = com.skin.framework.Class.create(null, function(out){
        this.out = out;
    });

    JspWriter.prototype.setOut = function(out){
        this.out = out;
    };

    JspWriter.prototype.getOut = function(){
        return this.out;
    };

    JspWriter.prototype.write = function(content){
        this.out.write(content);
    };

    JspWriter.prototype.print = function(content){
        this.write(content);
    };

    JspWriter.prototype.println = function(content){
        this.write(content);
        this.write("\r\n");
    };

    JspWriter.prototype.flush = function(){
    };

    JspWriter.prototype.close = function(){
    };

    /*
     * $RCSfile: ExpressionContext.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ExpressionContext = com.skin.ayada.runtime.ExpressionContext = com.skin.framework.Class.create(null, function(pageContext){
        this.pageContext = pageContext;
    });

    /**
     * @param expression
     * @return Object
     */
    ExpressionContext.prototype.evaluate = function(expression){
        try
        {
            return (new Function("with(this){return " + expression +  "}")).apply(this.pageContext.attributes);
        }
        catch(e)
        {
        }

        return null;
    };

    ExpressionContext.prototype.setAttribute = function(name, value){
        this.pageContext.setAttribute(name, value);
    };

    ExpressionContext.prototype.getAttribute = function(name){
        return this.pageContext.getAttribute(name);
    };

    /**
     * @param pageContext the pageContext to set
     */
    ExpressionContext.prototype.setPageContext = function(pageContext){
        this.pageContext = pageContext;
    };

    /**
     * @return the pageContext
     */
    ExpressionContext.prototype.getPageContext = function(){
        return this.pageContext;
    };

    /**
     * @return the pageContext
     */
    ExpressionContext.prototype.release = function(){
        this.pageContext = null;
    };

    /*
     * $RCSfile: ExpressionContextFactory.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ExpressionContextFactory = com.skin.ayada.runtime.ExpressionContextFactory = {};

    ExpressionContextFactory.create = function(pageContext){
        return new ExpressionContext(pageContext);
    };

    /*
     * $RCSfile: PageContext.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var PageContext = com.skin.ayada.runtime.PageContext = com.skin.framework.Class.create(null, function(out){
        this.out = out;
        this.attributes = [];
        this.tagLibrary = null;
        this.templateContext = null;
        this.expressionContext = null;
    });

    /**
     * @param out the out to set
     */
    PageContext.prototype.setOut = function(out){
        this.out = out;
    };

    /**
     * @return the out
     */
    PageContext.prototype.getOut = function(){
        return this.out;
    };

    /**
     * @return Iterator<String>
     */
    PageContext.prototype.getAttributeNames = function(){
        var names = [];

        for(var i in this.attributes)
        {
            names.push(i);
        }

        return names;
    };

    /**
     * @param key
     * @param value
     */
    PageContext.prototype.setAttribute = function(key, value){
        return this.attributes[key] = value;
    };

    /**
     * @param key
     * @return Object
     */
    PageContext.prototype.getAttribute = function(key){
        return this.attributes[key];
    };

    /**
     * @param key
     */
    PageContext.prototype.removeAttribute = function(key){
        var value = this.attributes[key];
        this.attributes[key] = null;
        return value;
    };

    /**
     * @return the templateContext
     */
    PageContext.prototype.getTemplateContext = function(){
        return this.templateContext;
    };

    /**
     * @param templateContext the templateContext to set
     */
    PageContext.prototype.setTemplateContext = function(templateContext){
        this.templateContext = templateContext;
    };

    /**
     * @param expressionContext
     */
    PageContext.prototype.setExpressionContext = function(expressionContext){
        this.expressionContext = expressionContext;
    };

    /**
     * @return ExpressionContext
     */
    PageContext.prototype.getExpressionContext = function(){
        return this.expressionContext;
    };

    /**
     * @return the tagLibrary
     */
    PageContext.prototype.getTagLibrary = function(){
        return this.tagLibrary;
    };

    /**
     * @param tagLibrary the tagLibrary to set
     */
    PageContext.prototype.setTagLibrary = function(tagLibrary){
        this.tagLibrary = tagLibrary;
    };

    /**
     * @return JspWriter
     */
    PageContext.prototype.pushBody = function(){
        this.out = new com.skin.ayada.tagext.BodyContent(this.out);
        return this.out;
    };

    /**
     * @return JspWriter
     */
    PageContext.prototype.popBody = function(){
        var bodyContent = this.out;
        this.out = bodyContent.getOut();
        return this.out;
    };

    /**
     * @param page
     */
    PageContext.prototype.include = function(page, context){
        this.templateContext.execute(page, context, this.getOut());
    };

    /**
     * release
     */
    PageContext.prototype.release = function(){
        this.out = null;
        this.attributes = {};
        this.expressionContext.release();
        this.tagLibrary.release();
        this.attributes = null;
        this.expressionContext = null;
        this.tagLibrary = null;
    };

    /*
     * $RCSfile: JspFactory.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var JspFactory = com.skin.ayada.runtime.JspFactory = com.skin.framework.Class.create();

    /**
     * @param out
     * @return PageContext
     */
    JspFactory.getPageContext = function(templateContext, out){
        var jspWriter = new JspWriter(out);
        var pageContext = new PageContext(jspWriter);
        var expressionContext = ExpressionContextFactory.create(pageContext);
        var tagLibrary = com.skin.ayada.jstl.TagLibraryFactory.getStandardTagLibrary();
        pageContext.setTagLibrary(tagLibrary);
        pageContext.setTemplateContext(templateContext);
        pageContext.setExpressionContext(expressionContext);
        return pageContext;
    };

    /*
     * $RCSfile: TagFactory.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TagFactory = com.skin.ayada.runtime.TagFactory = com.skin.framework.Class.create();

    TagFactory.create = function(pageContext, tagName){
        var tagLibrary = pageContext.getTagLibrary();
        var className = tagLibrary.getTagClassName(tagName);
        return new (className);
    };
})();

(function(){
    if(typeof(com.skin.ayada.jstl) == "undefined"){
        com.skin.ayada.jstl = {};
    }

    /*
     * $RCSfile: TagLibrary.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TagLibrary = com.skin.ayada.jstl.TagLibrary = function(){
        this.library = {};
    };

    /**
     * @param nodeName
     * @return String
     */
    TagLibrary.prototype.getTagClassName = function(nodeName){
        return this.library[nodeName];
    };

    /**
     * @param library
     */
    TagLibrary.prototype.setup = function(library){
        for(var i in library)
        {
            this.library[i] = library[i];
        }
    };

    /**
     * @return String
     */
    TagLibrary.prototype.toString = function(name){
        var buffer = [];

        if(name == null)
        {
            buffer.push("=============== taglib ===============");
        }
        else
        {
            buffer.push("=============== " + name + " ===============");
        }

        for(var name in this.library)
        {
            buffer.push(name + ": " + this.library[name]);
        }

        return buffer.join("\r\n");
    };

    TagLibrary.prototype.release = function(){
        this.library = null;
    };

    /*
     * $RCSfile: TagLibraryFactory.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TagLibraryFactory = com.skin.ayada.jstl.TagLibraryFactory = {"library": null};

    /**
     * @return TagLibrary
     */
    TagLibraryFactory.getDefaultTagLibrary = function(){
        return {
                // "t:import":       com.skin.ayada.jstl.core.ImportTag,
                "c:if":              com.skin.ayada.jstl.core.IfTag,
                "c:set":             com.skin.ayada.jstl.core.SetTag,
                "c:out":             com.skin.ayada.jstl.core.OutTag,
                "c:each":            com.skin.ayada.jstl.core.ForEachTag,
                "c:forEach":         com.skin.ayada.jstl.core.ForEachTag,
                "c:choose":          com.skin.ayada.jstl.core.ChooseTag,
                "c:when":            com.skin.ayada.jstl.core.WhenTag,
                "c:otherwise":       com.skin.ayada.jstl.core.OtherwiseTag,
                "c:comment":         com.skin.ayada.jstl.core.CommentTag,
                "c:param":           com.skin.ayada.jstl.core.ParameterTag,
                "c:action":          com.skin.ayada.taglib.ActionTag,
                // "f:substring":       com.skin.ayada.jstl.fmt.SubstringTag,
                "fmt:formatDate":    com.skin.ayada.jstl.fmt.DateFormatTag
        };
    };

    /**
     * @return TagLibrary
     */
    TagLibraryFactory.getStandardTagLibrary = function(){
        if(this.library == null)
        {
            this.library = this.getDefaultTagLibrary();
        }

        var tagLibrary = new TagLibrary();
        tagLibrary.setup(this.library);
        return tagLibrary;
    };

    /**
     * @param name
     * @param clazz
     **/
    TagLibraryFactory.setup = function(name, clazz){
        if(this.library == null)
        {
            this.library = this.getDefaultTagLibrary();
        }

        this.library[name] = clazz;
    };
})();

(function(){
    /*
     * $RCSfile: TagUtil.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    if(typeof(com.skin.ayada.util) == "undefined"){
        com.skin.ayada.util = {};
    }

    var TagUtil = com.skin.ayada.util.TagUtil = {};

    TagUtil.setAttributes = function(tag, attributes, expressionContext){
        if(attributes != null)
        {
            var setter = null;

            for(var name in attributes)
            {
                setter = tag["set" + name.charAt().toUpperCase() + name.substring(1)];
                if(setter != null)
                {
                    var value = TagUtil.evaluate(expressionContext, attributes[name]);
                    setter.apply(tag, [value]);
                }
                else
                {
                    tag[name] = attributes[name];
                }
            }
        }
    };

    /**
     * @param expressionContext
     * @param source
     * @return Object
     */
    TagUtil.evaluate = function(expressionContext, source){
        if(source == null)
        {
            return null;
        }

        var c;
        var cbuf = source.split("");
        var list = [];
        var textNode = null;

        for(var i = 0, length = cbuf.length; i < length; i++)
        {
            c = cbuf[i];

            if(c == '$' && (i + 1) < length && cbuf[i + 1] == '{')
            {
                var expression = new com.skin.ayada.statement.Expression();

                for(i = i + 2; i < length; i++)
                {
                    if(cbuf[i] == '}')
                    {
                        break;
                    }
                    else
                    {
                        expression.append(cbuf[i]);
                    }
                }

                if(expression.toString().length > 0)
                {
                    list.push(expression);
                    textNode = null;
                }
            }
            else
            {
                if(textNode == null)
                {
                    textNode = new com.skin.ayada.statement.TextNode();
                    list.push(textNode);
                }

                textNode.append(c);
            }
        }

        if(list.length > 0)
        {
            if(list.length == 1)
            {
                var node = list[0];

                if(node.getNodeType() == com.skin.ayada.statement.NodeType.EXPRESSION)
                {
                    return expressionContext.evaluate(node.toString());
                }
                else
                {
                    var value = null;
                    var result = node.toString();
                    var flag = this.getDataType(result);

                    if(flag == 0)
                    {
                        return result;
                    }
                    else
                    {
                        if(flag == 1)
                        {
                            value = parseInt(result);
                        }
                        else if(flag == 2)
                        {
                            value = parseFloat(result);
                        }
                    }

                    return (value != null ? value : result);
                }
            }
            else
            {
                var value = null;
                var buffer = [];

                for(var i = 0; i < list.length; i++)
                {
                    node = list[i];

                    if(node.getNodeType() == com.skin.ayada.statement.NodeType.EXPRESSION)
                    {
                        value = expressionContext.evaluate(node.toString());

                        if(value != null)
                        {
                            buffer.push(value.toString());
                        }
                    }
                    else
                    {
                        buffer.push(node.toString());
                    }
                }

                return buffer.join("");
            }
        }

        return null;
    };

    /**
     * @param source
     * @return int
     */
    TagUtil.getDataType = function(source){
        var c;
        var d = 0;
        var type = 1;

        for(var i = 0, length = source.length; i < length; i++)
        {
            c = source.charCodeAt(i);

            if(i > 0 && c == 46)
            {
                if(d == 0)
                {
                    d = 2;
                    continue;
                }
                else
                {
                    return 0;
                }
            }

            if(c < 48 || c > 57)
            {
                return 0;
            }
        }

        return (d == 0 ? type : d);
    };
})();

(function(){
    /* import */
    var Stack = com.skin.util.Stack;
    var StringUtil = com.skin.util.StringUtil;

    var NodeType = com.skin.ayada.statement.NodeType;
    var Node = com.skin.ayada.statement.Node;
    var DataNode = com.skin.ayada.statement.DataNode;
    var TextNode = com.skin.ayada.statement.TextNode;
    var Expression = com.skin.ayada.statement.Expression;
    var Statement = com.skin.ayada.statement.Statement;

    if(typeof(com.skin.ayada.compile) == "undefined"){
        com.skin.ayada.compile = {};
    }

    /*
     * $RCSfile: PageCompiler.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var PageCompiler = com.skin.ayada.compile.PageCompiler = function(source){
        this.stream = new com.skin.io.StringStream(source);
    };

    /**
     * read node name, after read '<'
     * @return String
     */
    PageCompiler.prototype.getNodeName = function(){
        var c;
        var buffer = [];
        while((c = this.stream.read()) != -1)
        {
            if(StringUtil.isLetter(c) || StringUtil.isDigit(c) || c == ":" || c == "-" || c == "_")
            {
                buffer.push(c);
            }
            else
            {
                break;
            }
        }

        this.stream.back();
        return buffer.join("");
    };

    /**
     * read node name, after read nodeName
     * @return String
     */
    PageCompiler.prototype.getAttributes = function(){
        var c;
        var name = null;
        var value = null;
        var buffer = [];
        var attributes = {};

        while((c = this.stream.peek()) != ">" && c != "/" && c != -1)
        {
            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    this.stream.back();
                    break;
                }
            }

            // read name
            while((c = this.stream.read()) != -1)
            {
                if(StringUtil.isLetter(c) || StringUtil.isDigit(c) || c == ":" || c == "-" || c == "_")
                {
                    buffer.push(c);
                }
                else
                {
                    this.stream.back();
                    break;
                }
            }

            name = buffer.join("");
            buffer.length = 0;

            if(name.length < 1)
            {
                continue;
            }

            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    this.stream.back();
                    break;
                }
            }

            // next character must be '='
            if(this.stream.peek() != "=")
            {
                attributes[name] = "";
                continue;
            }
            else
            {
                this.stream.read();
            }

            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    break;
                }
            }

            var quote = " ";

            if(c == "\"")
            {
                quote = "\"";
            }
            else if(c == "'")
            {
                quote = "'";
            }

            if(quote == " ")
            {
                while((c = this.stream.read()) != -1)
                {
                    if(c == " " || c == ">")
                    {
                        break;
                    }
                    else if(c == "/" && this.stream.peek() == ">")
                    {
                        break;
                    }
                    else
                    {
                        buffer.push(c);
                    }
                }
            }
            else
            {
                while((c = this.stream.read()) != -1)
                {
                    if(c != quote)
                    {
                        buffer.push(c);
                    }
                    else
                    {
                        break;
                    }
                }
            }

            value = buffer.join("");
            attributes[name] = value;
            buffer.length = 0;
        }

        return attributes;
    };

    /*
     * $RCSfile: TemplateCompiler.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TemplateCompiler = com.skin.ayada.compile.TemplateCompiler = com.skin.framework.Class.create(com.skin.ayada.compile.PageCompiler, function(){
            this.home = null;
            this.file = null;
            this.lineNumber = 1;
            this.tagLibrary = null;
            this.logger = com.skin.log.LoggerFactory.getLogger("TemplateCompiler");
    });

    /**
     * @return Template
     */
    TemplateCompiler.prototype.compile = function(){
        var /* int  */ i;
        var /* char */ c;

        while((i = this.stream.read()) != -1)
        {
            c = i;

            if(StringUtil.isISOControl(c) || c == ' ')
            {
                continue;
            }

            this.stream.back();
            break;
        }

        var stack = new Stack();
        var buffer = [];
        var expression = [];
        var list = [];

        while((i = this.stream.read()) != -1)
        {
            c = i;

            if(c == '<')
            {
                this.startTag(stack, list);
            }
            else if(c == '$' && this.stream.peek() == '{')
            {
                i = this.stream.read();
                expression.length = 0;

                while((i = this.stream.read()) != -1)
                {
                    c = i;

                    if(c == '}')
                    {
                        var expr = new Expression();
                        expr.setOffset(list.length);
                        expr.setLength(1);
                        expr.setLineNumber(this.lineNumber);
                        expr.append(expression.join(""));
                        /* ±í´ïÊ½Ô¤±àÒë */
                        expr.eval = new Function("pageContext", "with(pageContext.attributes){return " + expression.join("") +  ";}");
                        list.push(expr);
                        break;
                    }
                    else
                    {
                        expression.push(c);
                    }
                }
            }
            else
            {
                var line = this.lineNumber;
                buffer.push(c);

                if(c == '\n')
                {
                    this.lineNumber++;
                }

                while((i = this.stream.read()) != -1)
                {
                    if(i == '<' || i == '$')
                    {
                        this.stream.back();
                        break;
                    }
                    else
                    {
                        c = i;

                        if(c == '\n')
                        {
                            this.lineNumber++;
                        }

                        buffer.push(c);
                    }
                }

                if(buffer.length > 0)
                {
                    this.pushTextNode(stack, list, buffer.join(""), line);
                    buffer.length = 0;
                }
            }
        }

        if(stack.peek() != null)
        {
            throw {"name": "RuntimeException", "message": toString("Exception at ", stack.peek()) + " not match !"};
        }

        var template = new com.skin.ayada.template.Template(list);

        if(this.getFile() != null)
        {
            template.setFile(this.getFile());
        }

        return template;
    };

    /**
     * @param document
     */
    TemplateCompiler.prototype.startTag = function(stack, list){
        var i;

        if(this.stream.peek() == '/')
        {
            this.stream.read();
            var nodeName = this.getNodeName();

            if(nodeName.length > 0)
            {
                var calssName = null;

                if(this.tagLibrary != null)
                {
                    calssName = this.tagLibrary.getTagClassName(nodeName);
                }

                if(calssName != null)
                {
                    while((i = this.stream.read()) != -1)
                    {
                        if(i == '>')
                        {
                            break;
                        }
                    }

                    this.popNode(stack, list, nodeName);
                }
                else
                {
                    this.pushTextNode(stack, list, "</" + nodeName, this.lineNumber);
                }
            }
            else
            {
                this.pushTextNode(stack, list, "</", this.lineNumber);
            }
        }
        else if(this.stream.peek() != '!')
        {
            var nodeName = this.getNodeName();

            if(nodeName == "t:include")
            {
                var attributes = this.getAttributes();

                while((i = this.stream.read()) != -1)
                {
                    if(i == '>')
                    {
                        break;
                    }
                }

                if(this.stream.peek(-2) != '/')
                {
                    throw {"name": "RuntimeException", "message": "The 't:include' direction must be self-closed!"};
                }

                var file = attributes["file"];
                var encoding = attributes["encoding"];
                this.include(stack, list, file, encoding);
                return;
            }

            if(nodeName == "t:import")
            {
                var node = new Node(nodeName);
                node.setLineNumber(this.getLineNumber());
                var attributes = this.getAttributes();
                node.setAttributes(attributes);
                node.setClosed(NodeType.SELF_CLOSED);
                this.pushNode(stack, list, node);

                while((i = this.stream.read()) != -1)
                {
                    if(i == '>')
                    {
                        break;
                    }
                }

                if(this.stream.peek(-2) != '/')
                {
                    throw {"name": "RuntimeException", "message": "The 't:import' direction must be self-closed!"};
                }

                var name = attributes["name"];
                var className = attributes["className"];
                this.setupTagLibrary(name, className);
                return;
            }

            var tagClassName = null;

            if(this.tagLibrary != null)
            {
                tagClassName = this.tagLibrary.getTagClassName(nodeName);
            }

            if(tagClassName != null)
            {
                var node = new Node(nodeName);
                node.setLineNumber(this.getLineNumber());
                var attributes = this.getAttributes();
                node.setOffset(list.length);
                node.setLineNumber(this.lineNumber);
                node.setAttributes(attributes);
                node.setClosed(NodeType.PAIR_CLOSED);
                this.pushNode(stack, list, node);

                i = this.stream.peek();

                if(i == '/')
                {
                    var offset = 0;

                    while((i = this.stream.peek(offset++)) != -1)
                    {
                        if(i == '>')
                        {
                            break;
                        }
                    }

                    this.stream.setPosition(this.stream.getPosition() + offset);
                    node.setLength(2);
                    node.setClosed(NodeType.SELF_CLOSED);
                    this.popNode(stack, list, nodeName);
                }
                else
                {
                    while((i = this.stream.read()) != -1)
                    {
                        if(i == '>')
                        {
                            break;
                        }
                    }
                }
            }
            else
            {
                this.pushTextNode(stack, list, "<" + nodeName, this.lineNumber);
            }
        }
        else
        {
            this.pushTextNode(stack, list, "<", this.lineNumber);
        }
    };

    /**
     * @param stack
     * @param document
     * @param node
     */
    TemplateCompiler.prototype.pushNode = function(stack, list, node){
        var parent = stack.peek();

        if(parent != null)
        {
            node.setParent(parent);
        }

        stack.push(node);
        list.push(node);

        if(this.logger.isDebugEnabled())
        {
            this.logger.debug("[push][node] parent: " + (parent != null ? parent.getNodeName() : "null") + "[" + node.getNodeName() + "]");
        }
    };

    /**
     * @param stack
     * @param document
     * @param nodeName
     */
    TemplateCompiler.prototype.popNode = function(stack, list, nodeName){
        var node = stack.peek();

        if(node == null)
        {
            throw {"name": "RuntimeException", "message": ("Exception at line #" + this.lineNumber + ": </" + nodeName + "> not match !")};
        }

        if(node.getNodeName() == nodeName)
        {
            stack.pop();
            node.setLength(list.length - node.getOffset() + 1);
            list.push(node);

            if(this.logger.isDebugEnabled())
            {
                var parent = node.getParent();
                this.logger.debug("[pop ][node] parent: " + (parent != null ? parent.getNodeName() : "null") + ", html:[/" + node.getNodeName() + "]");
            }
        }
        else
        {
            throw {"name": "RuntimeException", "message": toString("Exception at line", node) + " not match !"};
        }
    };

    /**
     * @param stack
     * @param document
     * @param text
     */
    TemplateCompiler.prototype.pushTextNode = function(stack, list, text, lineNumber){
        var parent = stack.peek();

        if(parent != null && parent.getNodeName() == "c:choose")
        {
            return;
        }

        var textNode = null;
        var size = list.length;

        if(size > 0)
        {
            var node = list[size - 1];

            if(node.getNodeType() == NodeType.TEXT)
            {
                textNode = node;
            }
            else
            {
                textNode = new TextNode();
                textNode.setLineNumber(lineNumber);
                textNode.setOffset(size);
                textNode.setLength(1);
                list.push(textNode);
            }
        }
        else
        {
            textNode = new TextNode();
            textNode.setLineNumber(lineNumber);
            textNode.setOffset(size);
            textNode.setLength(1);
            list.push(textNode);
        }

        textNode.append(text);
    };

    /**
     * @param stack
     * @param list
     * @param path
     * @param encoding
     */
    TemplateCompiler.prototype.include = function(stack, list, path, encoding){
        if(path == null)
        {
            throw {"name": "RuntimeException", "message": "t:include error: attribute 'file' not exists !"};
        }

        if(this.file == null && path.charAt(0) != "/")
        {
            throw {"name": "RuntimeException", "message": "t:include error: file must be starts with '/'"};
        }

        if(this.home == null)
        {
            this.home = ".";
        }

        if(encoding == null)
        {
            encoding = "UTF-8";
        }

        var source = com.skin.ayada.template.TemplateFactory.getSource(this.home, path, encoding);
        var templateCompiler = new TemplateCompiler(source);
        templateCompiler.setHome(this.getHome());
        templateCompiler.setTagLibrary(this.getTagLibrary());
        var template = templateCompiler.compile();
        var nodes = template.getNodes();

        var index = list.length;
        var parent = stack.peek();

        for(var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            node.setOffset(-1);
        }

        for(var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];

            if(node.getOffset() == -1)
            {
                node.setOffset(index);
            }

            if(node.getParent() == null)
            {
                node.setParent(parent);
            }

            list.push(node);
            index++;
        }
    };

    /**
     * @param name
     * @param className
     */
    TemplateCompiler.prototype.setupTagLibrary = function(name, className){
        if(name == null || className == null)
        {
            return;
        }

        if(name.length < 1 || className.length < 1)
        {
            return;
        }

        var tagLibrary = this.getTagLibrary();

        if(tagLibrary != null)
        {
            tagLibrary.setup(name, className);
        }
    };

    /**
     * @param node
     * @return String
     */
    TemplateCompiler.prototype.toString = function(prefix, node){
        var buffer = [];
        buffer.push(prefix);
        buffer.push("line #");
        buffer.push(node.getLineNumber());
        buffer.push(" ");

        if(node.getNodeType() == NodeType.TEXT)
        {
            buffer.push(node.toString());
            return buffer.join("");
        }

        if(node.getNodeType() == NodeType.COMMENT)
        {
            buffer.push(node.toString());
            return buffer.join("");
        }

        if(node.getNodeType() == NodeType.EXPRESSION)
        {
            buffer.push("${");
            buffer.push(node.toString());
            buffer.push("}");
            return buffer.join("");
        }

        buffer.push("<");
        buffer.push(node.getNodeName());
        var attributes = node.getAttributes();

        if(attributes != null)
        {
            for(var i in attributes)
            {
                buffer.push(" ");
                buffer.push(i);
                buffer.push("=\"");
                buffer.push(attributes[i]);
                buffer.push("\"");
            }
        }

        if(node.getClosed() == NodeType.PAIR_CLOSED)
        {
            buffer.push(">...");
            buffer.push("</");
            buffer.push(node.getNodeName());
            buffer.push(">");
        }
        else
        {
            buffer.push("/>");
        }

        return buffer.join("");
    };

    /**
     * @param home
     */
    TemplateCompiler.prototype.setHome = function(home){
        this.home = home;
    };

    /**
     * @return String
     */
    TemplateCompiler.prototype.getHome = function(){
        return this.home;
    };

    /**
     * @param file the file to set
     */
    TemplateCompiler.prototype.setFile = function(file){
        this.file = file;
    };

    /**
     * @return the file
     */
    TemplateCompiler.prototype.getFile = function(){
        return this.file;
    };

    /**
     * @return int
     */
    TemplateCompiler.prototype.getLineNumber = function(){
        return this.lineNumber;
    };

    /**
     * @param lineNumber
     */
    TemplateCompiler.prototype.setLineNumber = function(lineNumber){
        this.lineNumber = lineNumber;
    };

    /**
     * @return TagLibrary
     */
    TemplateCompiler.prototype.getTagLibrary = function(){
        return this.tagLibrary;
    };

    /**
     * @param tagLibrary
     */
    TemplateCompiler.prototype.setTagLibrary = function(tagLibrary){
        this.tagLibrary = tagLibrary;
    };
})();

(function(){
    if(typeof(com.skin.ayada.template) == "undefined"){
        com.skin.ayada.template = {};
    }

    /*
     * $RCSfile: Template.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Template = com.skin.ayada.template.Template = function(nodes){
        this.file = null;
        this.updateTime = (new Date()).getTime();
        this.nodes = nodes;
    };

    /**
     * @return the nodes
     */
    Template.prototype.getNodes = function(){
        return this.nodes;
    };

    /**
     * @param nodes the nodes to set
     */
    Template.prototype.setNodes = function(nodes){
        this.nodes = nodes;
    };

    /**
     * @param updateTime the updateTime to set
     */
    Template.prototype.setUpdateTime = function(updateTime){
        this.updateTime = updateTime;
    };

    /**
     * @return the updateTime
     */
    Template.prototype.getUpdateTime = function(){
        return this.updateTime;
    };

    /**
     * @param file the file to set
     */
    Template.prototype.setFile = function(file){
        this.file = file;
    };

    /**
     * @return the file
     */
    Template.prototype.getFile = function(){
        return this.file;
    };

    /**
     * @return the file
     */
    Template.prototype.toString = function(){
        var buffer = [];
        var nodes = this.getNodes();

        for(var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];

            if(node.getNodeType() == com.skin.ayada.statement.NodeType.EXPRESSION)
            {
                buffer[buffer.length] = "${" + node.toString(i) + "}";
            }
            else
            {
                buffer[buffer.length] = nodes[i].toString(i);
            }
        }

        return buffer.join("");
    };

    /*
     * $RCSfile: DefaultExecutor.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var DefaultExecutor = com.skin.ayada.template.DefaultExecutor = {};

    /**
     * @param list
     * @param pageContext
     */
    DefaultExecutor.execute = function(template, pageContext){
        var node = null;
        var out = null;
        var statement = null;
        var list = template.getNodes();
        var jspWriter = pageContext.getOut();
        var statements = this.getStatements(list);
        var expressionContext = pageContext.getExpressionContext();
        var NodeType = com.skin.ayada.statement.NodeType;

        var flag = 0;
        var index = 0;
        var size = statements.length;
        var count = 0;

        while(index < size)
        {
            if((count++) >= 1000000)
            {
                break;
            }

            out = pageContext.getOut();
            statement = statements[index];
            node = statement.getNode();

            if(node.getNodeType() == NodeType.TEXT)
            {
                out.write(node.toString());
                index++;
                continue;
            }

            if(node.getNodeType() == NodeType.EXPRESSION)
            {
                var value = node.eval(pageContext); // expressionContext.evaluate(node.toString());

                if(value != null)
                {
                    out.write(value.toString());
                }
                index++;
                continue;
            }

            if(node.getLength() == 0)
            {
                throw {"name": "RuntimeException", "message": this.toString("Exception at ", node)};
            }

            if(node.getOffset() == index)
            {
                flag = this.doStartTag(statement, pageContext);

                if(flag == com.skin.ayada.tagext.Tag.SKIP_BODY)
                {
                    index = node.getOffset() + node.getLength();
                    continue;
                }

                if(flag == com.skin.ayada.tagext.Tag.SKIP_PAGE)
                {
                    break;
                }
            }
            else
            {
                flag = this.doEndTag(statement, pageContext);

                if(flag == com.skin.ayada.tagext.IterationTag.EVAL_BODY_AGAIN)
                {
                    index = node.getOffset() + 1;
                    continue;
                }

                if(flag == com.skin.ayada.tagext.Tag.SKIP_PAGE)
                {
                    break;
                }
            }
            index++;
        }

        pageContext.setOut(jspWriter);

        try
        {
            jspWriter.flush();
        }
        catch(e)
        {
        }
    };

    /**
     * @param statement
     * @return int
     */
    DefaultExecutor.doStartTag = function(statement, pageContext){
        var tag = statement.getTag();
        var node = statement.getNode();

        if(tag == null)
        {
            tag = com.skin.ayada.runtime.TagFactory.create(pageContext, node.getNodeName());
            tag.setPageContext(pageContext);
            statement.setTag(tag);

            var parent = statement.getParent();

            if(parent != null)
            {
                tag.setParent(parent.getTag());
            }
        }

        // create - doStartTag
        com.skin.ayada.util.TagUtil.setAttributes(tag, node.getAttributes(), pageContext.getExpressionContext());
        var flag = tag.doStartTag();
        statement.setStartTagFlag(flag);

        if(flag == com.skin.ayada.tagext.Tag.SKIP_PAGE)
        {
            return com.skin.ayada.tagext.Tag.SKIP_PAGE;
        }

        if(flag != com.skin.ayada.tagext.Tag.SKIP_BODY)
        {
            if(flag != com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE)
            {
                if(tag.setBodyContent != null) /* tag instanceof com.skin.ayada.tagext.BodyTag */
                {
                    var bodyTag = tag;
                    var bodyContent = pageContext.pushBody();
                    bodyTag.setBodyContent(bodyContent);
                    bodyTag.doInitBody();
                }
            }
        }

        return flag;
    };

    /**
     * @param statement
     * @param pageContext
     * @return int
     */
    DefaultExecutor.doEndTag = function(statement, pageContext){
        var tag = statement.getTag();
        var iterationTag = null;

        if(tag.doAfterBody != null) /* instanceof IterationTag */
        {
            iterationTag = tag;
        }

        if(iterationTag != null)
        {
            var flag = iterationTag.doAfterBody();

            if(flag == com.skin.ayada.tagext.IterationTag.EVAL_BODY_AGAIN)
            {
                return flag;
            }
            else
            {
                var startTagFlag = statement.getStartTagFlag();

                if(startTagFlag != com.skin.ayada.tagext.Tag.SKIP_BODY)
                {
                    if(startTagFlag != com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE)
                    {
                        if(tag.setBodyContent != null) /* tag instanceof com.skin.ayada.tagext.BodyTag */
                        {
                            pageContext.popBody();
                        }
                    }
                }
            }
        }

        var flag = tag.doEndTag();
        tag.release();
        return flag;
    };

    /**
     * @param list
     * @return List<Statement>
     */
    DefaultExecutor.getStatements = function(list){
        var statements = [];

        for(var i = 0, size = list.length; i < size; i++)
        {
            var node = list[i];

            if(node.getOffset() == i)
            {
                var parent = node.getParent();
                var statement = new com.skin.ayada.statement.Statement(node);

                if(parent != null)
                {
                    statement.setParent(statements[parent.getOffset()]);
                }

                statements.push(statement);
            }
            else
            {
                var statement = statements[node.getOffset()];
                statements.push(statement);
            }
        }

        return statements;
    };

    /**
     * @param node
     * @return String
     */
    DefaultExecutor.toString = function(prefix, node){
        var buffer = [];

        if(prefix != null)
        {
            buffer.push(prefix);
        }

        buffer.push("line #");
        buffer.push(node.getLineNumber());
        buffer.push(" ");

        if(node.getNodeType() == NodeType.TEXT)
        {
            buffer.push(node.toString());
            return buffer.join("");
        }

        if(node.getNodeType() == NodeType.COMMENT)
        {
            buffer.push(node.toString());
            return buffer.join("");
        }

        if(node.getNodeType() == NodeType.EXPRESSION)
        {
            buffer.push("${");
            buffer.push(node.toString());
            buffer.push("}");
            return buffer.join("");
        }

        buffer.push("<");
        buffer.push(node.getNodeName());
        var attributes = node.getAttributes();

        if(attributes != null)
        {
            for(var i in attributes)
            {
                buffer.push(" ");
                buffer.push(i);
                buffer.push("=\"");
                buffer.push(attributes[i]);
                buffer.push("\"");
            }
        }

        if(node.getClosed() == NodeType.PAIR_CLOSED)
        {
            buffer.push(">...");
            buffer.push("</");
            buffer.push(node.getNodeName());
            buffer.push(">");
        }
        else
        {
            buffer.push("/>");
        }
        return buffer.join("");
    };

    /*
     * $RCSfile: TemplateFactory.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TemplateFactory = com.skin.ayada.template.TemplateFactory = com.skin.framework.Class.getInstance(function(){});

    /**
     * @param home
     * @param file
     * @param source
     * @return Template
     */
    TemplateFactory.create = function(home, file, source){
        var tagLibrary = com.skin.ayada.jstl.TagLibraryFactory.getStandardTagLibrary();
        var templateCompiler = new com.skin.ayada.compile.TemplateCompiler(source);
        templateCompiler.setHome(home);
        templateCompiler.setFile(file);
        templateCompiler.setTagLibrary(tagLibrary);
        return templateCompiler.compile();
    };

    /**
     * @param file
     * @return String
     */
    TemplateFactory.getSource = function(home, file, encoding){
        return null;
    };

    /*
     * $RCSfile: TemplateContext.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TemplateContext = com.skin.ayada.template.TemplateContext = com.skin.framework.Class.create(null, function(home, expire){
        this.home = home;
        this.expire = expire;
        this.cache = {};
    });

    /**
     * @param path
     * @param context
     * @param writer
     */
    TemplateContext.prototype.execute = function(path, context, writer){
        var template = this.getTemplate(path);

        if(template == null)
        {
            throw {"name": "RuntimeException", "message": path + " not exists!"};
        }

        var pageContext = com.skin.ayada.runtime.JspFactory.getPageContext(this, writer);

        if(context != null)
        {
            for(var i in context)
            {
                pageContext.setAttribute(i, context[i]);
            }
        }

        DefaultExecutor.execute(template, pageContext);
        pageContext.release();
    };

    /**
     * @return int
     */
    TemplateContext.prototype.getTemplate = function(path, context, writer){
        var template = this.cache[path];

        if(template != null)
        {
            var timeMillis = new Date().getTime();

            if(timeMillis - template.getUpdateTime() > this.expire * 1000)
            {
                template = this.cache[path] = null;
            }
        }

        if(template == null)
        {
            var source = TemplateFactory.getSource(this.home, path, "UTF-8");
            template = TemplateFactory.create(this.getHome(), path, source);
            template.setUpdateTime(new Date().getTime());
            this.cache[path] = template;
        }

        return template;
    };

    /**
     * @return String
     */
    TemplateContext.prototype.getHome = function(){
        return this.home;
    };

    /**
     * @param expire the expire to set
     */
    TemplateContext.prototype.setExpire = function(expire){
        this.expire = expire;
    };

    /**
     * @return the expire
     */
    TemplateContext.prototype.getExpire = function(){
        return this.expire;
    };

    TemplateContext.prototype.destory = function(){
        this.cache = null;
    };
})();

(function(){
    if(typeof(com.skin.ayada.tagext) == "undefined"){
        com.skin.ayada.tagext = {};
    }

    var InterfaceException = com.skin.framework.Class.create(null, function(){
        this.name = "InterfaceException";
        this.message = "This metod not implement !";
    });

    /*
     * $RCSfile: Tag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Tag = com.skin.ayada.tagext.Tag = com.skin.framework.Class.create();

    /* doStartTag() -> doInitBody() -> setBodyContent() -> doAfterBody() -> doEndTag() */
    Tag.SKIP_BODY = 0;
    Tag.EVAL_BODY_INCLUDE = 1;
    Tag.SKIP_PAGE = 5;
    Tag.EVAL_PAGE = 6;

    /**
     * @return int
     */
    Tag.prototype.doStartTag = function(parent){
        throw new InterfaceException();
    };

    /**
     * @return int
     */
    Tag.prototype.doEndTag = function(parent){
        throw new InterfaceException();
    };

    /**
     * @param parent
     */
    Tag.prototype.setParent = function(parent){
        throw new InterfaceException();
    };

    /**
     * @param parent
     */
    Tag.prototype.getParent = function(){
        throw new InterfaceException();
    };

    /**
     * @param pageContext
     */
    Tag.prototype.setPageContext = function(pageContext){
        throw new InterfaceException();
    };

    /**
     * @return PageContext
     */
    Tag.prototype.getPageContext = function(){
        throw new InterfaceException();
    };

    /**
     *
     */
    Tag.prototype.release = function(){
        throw new InterfaceException();
    };

    /*
     * $RCSfile: IterationTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var IterationTag = com.skin.ayada.tagext.IterationTag = com.skin.framework.Class.create(com.skin.ayada.tagext.Tag);

    IterationTag.EVAL_BODY_AGAIN = 2;

    /**
     * @return int
     */
    IterationTag.prototype.doAfterBody = function(parent){
        throw new InterfaceException();
    };

    /*
     * $RCSfile: TagSupport.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var TagSupport = com.skin.ayada.tagext.TagSupport = com.skin.framework.Class.create(com.skin.ayada.tagext.IterationTag);

    /**
     * @return int
     */
    TagSupport.prototype.doStartTag = function(){
        return IterationTag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    TagSupport.prototype.doAfterBody = function(){
        return Tag.SKIP_BODY;
    };

    /**
     * @return int
     */
    TagSupport.prototype.doEndTag = function(){
        return Tag.EVAL_PAGE;
    };

    /**
     * @return String
     */
    TagSupport.prototype.getId = function(){
        return this.id;
    };

    /**
     * @param id
     */
    TagSupport.prototype.setId = function(id){
        this.id = id;
    };

    /**
     * @param Tag
     */
    TagSupport.prototype.setParent = function(tag){
        this.parent = tag;
    };

    /**
     * @return Tag
     */
    TagSupport.prototype.getParent = function(){
        return this.parent;
    };

    /**
     * @param pageContext
     */
    TagSupport.prototype.setPageContext = function(pageContext){
        this.pageContext = pageContext;
    };

    /**
     * @param pageContext
     */
    TagSupport.prototype.getPageContext = function(){
        return this.pageContext;
    };

    TagSupport.prototype.release = function(){
        /* TagSupport.prototype.release; */
    };

    /*
     * $RCSfile: ConditionalTagSupport.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ConditionalTagSupport = com.skin.ayada.tagext.ConditionalTagSupport = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.condition = false;
    });

    /**
     * @param condition the condition to set
     */
    ConditionalTagSupport.prototype.setCondition = function(condition){
        this.condition = condition;
    };

    /**
     * @return boolean
     */
    ConditionalTagSupport.prototype.getCondition = function(){
        return this.condition;
    };

    /*
     * $RCSfile: LoopTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var LoopTag = com.skin.ayada.tagext.LoopTag = com.skin.framework.Class.create(com.skin.ayada.tagext.Tag);

    /**
     * Retrieves the current item in the iteration. Behaves idempotently;
     * calling getCurrent() repeatedly should return the same Object until the iteration is advanced.
     * (Specifically, calling getCurrent() does not advance the iteration.)
     * @return Object
     */
    LoopTag.prototype.getCurrent = function(){
        throw new InterfaceException();
    };

    /**
     * Retrieves a 'status' object to provide information about the current round of the iteration.
     * @return LoopTagStatus
     */
    LoopTag.prototype.getLoopStatus = function(){
        throw new InterfaceException();
    };

    /*
     * $RCSfile: LoopTagSupport.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var LoopTagSupport = com.skin.ayada.tagext.LoopTagSupport = /* extends TagSupport implements LoopTag, IterationTag */ com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.index = 0;
        this.begin = -1;
        this.end = -1;
        this.step = -1;
        this.count = 0;
        this.current = null;
        this.variable = null;
        this.varStatus = null;
        this.loopStatus = null;
    });

    LoopTagSupport.prototype.doStartTag = function(){
        if(this.end != -1 && this.begin > this.end)
        {
            return Tag.SKIP_BODY;
        }

        if(this.begin > -1)
        {
            this.index = this.begin;
        }
        else
        {
            this.index = 0;
        }

        if(this.step < 1)
        {
            this.step = 1;
        }

        this.count = 0;
        this.index = this.index - this.step;
        return Tag.EVAL_BODY_INCLUDE;
    };

    LoopTagSupport.prototype.doAfterBody = function(){
        if(this.hasNext())
        {
            this.setCurrent(this.next());
            return com.skin.ayada.tagext.IterationTag.EVAL_BODY_AGAIN;
        }
        else
        {
            return com.skin.ayada.tagext.Tag.SKIP_BODY;
        }
    };

    LoopTagSupport.prototype.doEndTag = function(){
        if(this.variable != null)
        {
            this.pageContext.removeAttribute(this.variable);
        }

        if(this.varStatus != null)
        {
            this.pageContext.removeAttribute(this.varStatus);
        }

        return LoopTagSupport.$super.doEndTag.apply(this);
    };

    /**
     * @return boolean
     */
    LoopTagSupport.prototype.isFirst = function(){
        return (this.count == 1) || (this.index == 0);
    };

    /**
     * @return boolean
     */
    LoopTagSupport.prototype.isLast = function(){
        return ((this.index + this.step) >= this.end);
    };

    /**
     * @return boolean
     */
    LoopTagSupport.prototype.hasNext = function(){
        throw new InterfaceException();
    };

    /**
     * @return boolean
     */
    LoopTagSupport.prototype.next = function(){
        throw new InterfaceException();
    };

    /**
     * @return the index
     */
    LoopTagSupport.prototype.getIndex = function(){
        return this.index;
    };

    /**
     * @param index the index to set
     */
    LoopTagSupport.prototype.setIndex = function(index){
        this.index = index;
    };

    /**
     * @return the begin
     */
    LoopTagSupport.prototype.getBegin = function(){
        return this.begin;
    };

    /**
     * @param begin the begin to set
     */
    LoopTagSupport.prototype.setBegin = function(begin){
        this.begin = begin;
    };

    /**
     * @return the count
     */
    LoopTagSupport.prototype.getCount = function(){
        return this.count;
    };

    /**
     * @param count the count to set
     */
    LoopTagSupport.prototype.setCount = function(count){
        this.count = count;
    };

    /**
     * @return the end
     */
    LoopTagSupport.prototype.getEnd = function(){
        return this.end;
    };

    /**
     * @param end the end to set
     */
    LoopTagSupport.prototype.setEnd = function(end){
        this.end = end;
    };

    /**
     * @return the step
     */
    LoopTagSupport.prototype.getStep = function(){
        return this.step;
    };

    /**
     * @param step the step to set
     */
    LoopTagSupport.prototype.setStep = function(step){
        this.step = step;
    };

    /**
     * @return the current
     */
    LoopTagSupport.prototype.getCurrent = function(){
        return this.current;
    };

    /**
     * @param current the current to set
     */
    LoopTagSupport.prototype.setCurrent = function(current){
        this.current = current;
        this.pageContext.setAttribute(this.variable, this.current);
    };

    /**
     * @return the var
     */
    LoopTagSupport.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param var the var to set
     */
    LoopTagSupport.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @return the varStatus
     */
    LoopTagSupport.prototype.getVarStatus = function(){
        return this.varStatus;
    };

    /**
     * @param varStatus the varStatus to set
     */
    LoopTagSupport.prototype.setVarStatus = function(varStatus){
        this.varStatus = varStatus;
    };

    /**
     * @return the loopStatus
     */
    LoopTagSupport.prototype.getLoopStatus = function(){
        return this.loopStatus;
    };

    /**
     * @param loopStatus the loopStatus to set
     */
    LoopTagSupport.prototype.setLoopStatus = function(loopStatus){
        this.loopStatus = loopStatus;
    };

    /*
     * $RCSfile: LoopTagStatus.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var LoopTagStatus = com.skin.ayada.tagext.LoopTagStatus = com.skin.framework.Class.create();

    /**
     * @return int
     */
    LoopTagStatus.prototype.getBegin = function(){
        throw new InterfaceException();
    };

    /**
     * @return int
     */
    LoopTagStatus.prototype.getCount = function(){
        throw new InterfaceException();
    };

    /**
     * @return Object
     */
    LoopTagStatus.prototype.getCurrent = function(){
        throw new InterfaceException();
    };

    /**
     * @return int
     */
    LoopTagStatus.prototype.getEnd = function(){
        throw new InterfaceException();
    };

    /**
     * @return int
     */
    LoopTagStatus.prototype.getIndex = function(){
        throw new InterfaceException();
    };

    /**
     * @return int
     */
    LoopTagStatus.prototype.getStep = function(){
        throw new InterfaceException();
    };

    /**
     * @return boolean
     */
    LoopTagStatus.prototype.isFirst = function(){
        throw new InterfaceException();
    };

    /**
     * @return boolean
     */
    LoopTagStatus.prototype.isLast = function(){
        throw new InterfaceException();
    };

    /*
     * $RCSfile: BodyTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var BodyTag = com.skin.ayada.tagext.BodyTag = com.skin.framework.Class.create(com.skin.ayada.tagext.IterationTag);

    /**
     * Request the creation of new buffer, a BodyContent on which to evaluate the body of this tag.
     * Returned from doStartTag when it implements BodyTag.
     * This is an illegal return value for doStartTag when the class does not implement BodyTag.
     */
    BodyTag.EVAL_BODY_BUFFERED = 2;

    /**
     * Prepare for evaluation of the body. This method is invoked by the JSP page implementation object after setBodyContent and before the first time the body is to be evaluated.
     * This method will not be invoked for empty tags or for non-empty tags whose doStartTag() method returns SKIP_BODY or EVAL_BODY_INCLUDE.
     * The JSP container will resynchronize the values of any AT_BEGIN and NESTED variables (defined by the associated TagExtraInfo or TLD) after the invocation of doInitBody().
     * @return int
     */
    BodyTag.prototype.doInitBody = function(){
        throw new InterfaceException();
    };

    /**
     * Set the bodyContent property. This method is invoked by the JSP page implementation object at most once per action invocation.
     * This method will be invoked before doInitBody. This method will not be invoked for empty tags or for non-empty tags whose doStartTag() method returns SKIP_BODY or EVAL_BODY_INCLUDE.
     * When setBodyContent is invoked, the value of the implicit object out has already been changed in the pageContext object.
     * The BodyContent object passed will have not data on it but may have been reused (and cleared) from some previous invocation.
     * The BodyContent object is available and with the appropriate content until after the invocation of the doEndTag method, at which case it may be reused.
     * @param bodyContent the bodyContent to set
     */
    BodyTag.prototype.setBodyContent = function(bodyContent){
        throw new InterfaceException();
    };

    /*
     * $RCSfile: BodyTagSupport.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var BodyTagSupport = com.skin.ayada.tagext.BodyTagSupport = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport); /* implements BodyTag */

    BodyTagSupport.prototype.doStartTag = function(){
        return BodyTag.EVAL_BODY_BUFFERED;
    };

    BodyTagSupport.prototype.doEndTag = function(){
        return BodyTagSupport.$super.doEndTag.apply(this);
    };

    BodyTagSupport.prototype.setBodyContent = function(bodyContent){
        this.bodyContent = bodyContent;
    };

    BodyTagSupport.prototype.doInitBody = function(){
    };

    BodyTagSupport.prototype.doAfterBody = function(){
        return com.skin.ayada.tagext.Tag.SKIP_BODY;
    };

    BodyTagSupport.prototype.release = function(){
        this.bodyContent = null;
        BodyTagSupport.$super.release.apply(this);
    };

    BodyTagSupport.prototype.getBodyContent = function(){
        return this.bodyContent;
    };

    BodyTagSupport.prototype.getPreviousOut = function(){
        return this.bodyContent.getEnclosingWriter();
    };

    /*
     * $RCSfile: BodyContent.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var BodyContent = com.skin.ayada.tagext.BodyContent = com.skin.framework.Class.create(com.skin.ayada.runtime.JspWriter, function(out){
        this.buffer = [];
    });

    BodyContent.prototype.write = function(content){
        this.buffer.push(content);
    };

    BodyContent.prototype.flush = function(){
    };

    BodyContent.prototype.close = function(){
    };

    /**
     * @return JspWriter
     */
    BodyContent.prototype.getEnclosingWriter = function(){
        return this.getOut();
    };

    /**
     * @return String
     */
    BodyContent.prototype.getString = function(){
        return this.buffer.join("");
    };
})();

(function(){
    if(typeof(com.skin.ayada.jstl) == "undefined"){
        com.skin.ayada.jstl = {};
    }

    if(typeof(com.skin.ayada.jstl.core) == "undefined"){
        com.skin.ayada.jstl.core = {};
    }

    /*
     * $RCSfile: ChooseTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ChooseTag = com.skin.ayada.jstl.core.ChooseTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.flag = false;
    });

    ChooseTag.prototype.doStartTag = function(){
        this.flag = false;
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    ChooseTag.prototype.complete = function(){
        return this.flag;
    };

    ChooseTag.prototype.finish = function(){
        this.flag = true;
    };

    /*
     * $RCSfile: CommentTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var CommentTag = com.skin.ayada.jstl.core.CommentTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport);

    CommentTag.prototype.doStartTag = function(){
        return com.skin.ayada.tagext.Tag.SKIP_BODY;
    };

    /*
     * $RCSfile: ForEachTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2013-2-19 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     *
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ForEachTag = com.skin.ayada.jstl.core.ForEachTag = com.skin.framework.Class.create(com.skin.ayada.tagext.LoopTagSupport, function(){
        this.items = null;
        this.hasItems = false;
    });

    /**
     * @return int
     */
    ForEachTag.prototype.doStartTag = function(){
        ForEachTag.$super.doStartTag.apply(this);

        if(this.hasItems == false)
        {
            var list = [];
            var count = 0;

            if(this.getBegin() != null && this.getEnd() != null)
            {
                for(var i = 0, j = this.getBegin(), end = this.getEnd(); j <= end; i++, j += this.getStep())
                {
                    count++;
                    if(count >= 100000)
                    {
                        break;
                    }

                    list.push(j);
                }
            }

            this.items = new ForEachIterator(list);
        }

        if(this.getVarStatus() != null)
        {
            this.setLoopStatus(this);
            this.pageContext.setAttribute(this.getVarStatus(), this);
        }

        if(this.hasNext())
        {
            this.setCurrent(this.next());
        }
        else
        {
            return com.skin.ayada.tagext.Tag.SKIP_BODY;
        }

        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return boolean
     */
    ForEachTag.prototype.hasNext = function(){
        return this.items.hasNext();
    };

    /**
     * @return boolean
     */
    ForEachTag.prototype.next = function(){
        this.setIndex(this.getIndex() + 1);
        return this.items.next();
    };

    /**
     * @param items
     */
    ForEachTag.prototype.setItems = function(items){
        var list = [];

        if(items != null)
        {
            if(typeof(items) == "number")
            {
                list = null;
            }
            else if(typeof(items) == "string")
            {
                list = items.split(",");
            }
            else
            {
                if(items.length == null)
                {
                    for(var i in items)
                    {
                        list.push(items[i]);
                    }
                }
                else
                {
                    list = items;
                }
            }
        }

        this.items = new ForEachIterator(list);
        this.hasItems = true;
    };

    /**
     * @param items
     */
    ForEachTag.prototype.getItems = function(){
        return this.items;
    };

    /*
     * $RCSfile: ForEachIterator.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ForEachIterator = com.skin.ayada.jstl.core.ForEachIterator = com.skin.framework.Class.create(null, function(items){
        this.index = 0;
        this.items = (items || []);
    });

    /**
     * @return boolean
     */
    ForEachIterator.prototype.hasNext = function(){
        return this.index < this.items.length;
    };

    /**
     * @return Object
     */
    ForEachIterator.prototype.next = function(){
        return this.items[this.index++];
    };

    /**
     * @return Object
     */
    ForEachIterator.prototype.iterator = function(items){
        var list = [];

        if(items != null)
        {
            if(typeof(items) == "number")
            {
                list = null;
            }
            else if(typeof(items) == "string")
            {
                list = items.split(",");
            }
            else
            {
                if(items.length == null)
                {
                    for(var i in items)
                    {
                        list.push(items[i]);
                    }
                }
                else
                {
                    list = items;
                }
            }
        }

        return list;
    };

    /*
     * $RCSfile: IfTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var IfTag = com.skin.ayada.jstl.core.IfTag = com.skin.framework.Class.create(com.skin.ayada.tagext.ConditionalTagSupport);

    /**
     * @return int
     */
    IfTag.prototype.doStartTag = function(){
        if(this.getCondition() == true)
        {
            return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
        }

        return com.skin.ayada.tagext.Tag.SKIP_BODY;
    };

    IfTag.prototype.setTest = function(b){
        this.setCondition(b);
    };

    /*
     * $RCSfile: OtherwiseTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var OtherwiseTag = com.skin.ayada.jstl.core.OtherwiseTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport);

    /**
     * @return int
     */
    OtherwiseTag.prototype.doStartTag = function(){
        var parent = this.getParent();

        if(parent == null)
        {
            throw new RuntimeException("when tag must be in choose tag !");
        }

        var chooseTag = parent;

        if(chooseTag.complete())
        {
            return com.skin.ayada.tagext.Tag.SKIP_BODY;
        }

        chooseTag.finish();
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    /*
     * $RCSfile: OutTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var OutTag = com.skin.ayada.jstl.core.OutTag = com.skin.framework.Class.create(com.skin.ayada.tagext.BodyTagSupport, function(){
        this.value = null;
        this.defaultValue = null;
        this.escapeXml = false;
    });

    OutTag.prototype.doStartTag = function(){
        var out = this.pageContext.getOut();

        if(this.value != null)
        {
            if(this.escapeXml == true || this.escapeXml == "true")
            {
                out.print(this.escape(this.value.toString()));
            }
            else
            {
                out.print(this.value);
            }
        }
        else if(this.defaultValue != null)
        {
            if(this.escapeXml == true || this.escapeXml == "true")
            {
                out.print(this.escape(this.defaultValue));
            }
            else
            {
                out.print(this.defaultValue);
            }
        }
        else
        {
            return com.skin.ayada.tagext.BodyTag.EVAL_BODY_BUFFERED;
        }

        return com.skin.ayada.tagext.Tag.SKIP_BODY;
    };

    /**
     * @return int
     */
    OutTag.prototype.doEndTag = function(){
        var content = null;
        var bodyContent = this.getBodyContent();

        if(bodyContent != null)
        {
            content = bodyContent.getString().replace(/(^\s*)|(\s*$)/g, "");

            if(this.escapeXml == true || this.escapeXml == "true")
            {
                content = this.escape(content);
            }

            this.pageContext.getOut().print(content);
        }
        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    /**
     * @param source
     * @return String
     */
    OutTag.prototype.escape = function(source){
        if(source == null)
        {
            return "";
        }

        var c;
        var buffer = [];

        for(var i = 0, size = source.length; i < size; i++)
        {
            c = source.charAt(i);

            switch (c)
            {
                case '&':
                {
                    buffer.push("&amp;");
                    break;
                }
                case '"':
                {
                    buffer.push("&quot;");
                    break;
                }
                case '<':
                {
                    buffer.push("&lt;");
                    break;
                }
                case '>':
                {
                    buffer.push("&gt;");
                    break;
                }
                case '\'':
                {
                    buffer.push("&#39;");
                }
                default :
                {
                    buffer.push(c);
                    break;
                }
            }
        }

        return buffer.join("");
    };

    /**
     * @return the value
     */
    OutTag.prototype.getValue = function(){
        return this.value;
    };

    /**
     * @param value the value to set
     */
    OutTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return
     */
    OutTag.prototype.getEscapeXml = function(){
        return this.escapeXml;
    };

    /**
     * @param escapseXml
     */
    OutTag.prototype.setEscapeXml = function(escapeXml){
        this.escapeXml = escapeXml;
    };

    /*
     * $RCSfile: SetTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var SetTag = com.skin.ayada.jstl.core.SetTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.variable = null;
        this.value = null;
    });

    /**
     * @return int
     */
    SetTag.prototype.doEndTag = function(){
        if(this.variable != null)
        {
            this.pageContext.setAttribute(this.variable, this.value);
        }

        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    /**
     * @return the var
     */
    SetTag.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param var the var to set
     */
    SetTag.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @return the value
     */
    SetTag.prototype.getValue = function(){
        return this.value;
    };

    /**
     * @param value the value to set
     */
    SetTag.prototype.setValue = function(value){
        this.value = value;
    };

    /*
     * $RCSfile: WhenTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var WhenTag = com.skin.ayada.jstl.core.WhenTag = com.skin.framework.Class.create(com.skin.ayada.tagext.ConditionalTagSupport);

    /**
     * @return int
     */
    WhenTag.prototype.doStartTag = function(){
        var parent = this.getParent();

        if(parent == null)
        {
            throw new RuntimeException("when tag must be in choose tag !");
        }

        var chooseTag = parent;

        if(chooseTag.complete())
        {
            return com.skin.ayada.tagext.Tag.SKIP_BODY;
        }

        if(this.getCondition())
        {
            chooseTag.finish();
            return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
        }

        return com.skin.ayada.tagext.Tag.SKIP_BODY;
    };

    /**
     * @return int
     */
    WhenTag.prototype.doEndTag = function(){
        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    WhenTag.prototype.setTest = function(b){
        this.setCondition(b);
    };

    /*
     * $RCSfile: ParameterTag.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ParameterTag = com.skin.ayada.jstl.core.ParameterTag = com.skin.framework.Class.create(com.skin.ayada.tagext.BodyTagSupport, function(){
        this.name = null;
        this.value = null;
    });

    ParameterTag.prototype.doEndTag = function(){
        var parent = this.getParent();

        if(parent.setParameter != null)
        {
            var value = this.getValue();

            if(value == null)
            {
                var body = this.getBodyContent();
                value = (body != null ? body.getString() : null);
            }

            parent.setParameter(this.getName(), value);
            return com.skin.ayada.tagext.Tag.EVAL_PAGE;
        }
        else
        {
            throw {"name": "RuntimeException", "message": "Illegal use of parameter-style tag without servlet as its direct parent"};
        }
    };

    /**
     * @param name the name to set
     */
    ParameterTag.prototype.setName = function(name){
        this.name = name;
    };

    /**
     * @return the name
     */
    ParameterTag.prototype.getName = function(){
        return this.name;
    };

    /**
     * @param value the value to set
     */
    ParameterTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return the value
     */
    ParameterTag.prototype.getValue = function(){
        return this.value;
    };

    if(typeof(com.skin.ayada.jstl.fmt) == "undefined"){
        com.skin.ayada.jstl.fmt = {};
    }

    /*
     * $RCSfile: DateFormatTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var DateFormatTag = com.skin.ayada.jstl.fmt.DateFormatTag = com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.variable = null;
        this.pattern = null;
        this.value = null;
    });

    /**
     * @param variable
     */
    DateFormatTag.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @return String
     */
    DateFormatTag.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param pattern
     */
    DateFormatTag.prototype.setPattern = function(pattern){
        this.pattern = pattern;
    };

    /**
     * @return String
     */
    DateFormatTag.prototype.getPattern = function(){
        return this.pattern;
    };

    /**
     * @param value
     */
    DateFormatTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return Date
     */
    DateFormatTag.prototype.getValue = function(){
        return this.value;
    };

    /**
     * @return int
     */
    DateFormatTag.prototype.doStartTag = function(){
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    DateFormatTag.prototype.doEndTag = function(){
        var text = com.skin.util.DateFormat.format(this.getValue(), this.getPattern());

        if(this.getVar() != null)
        {
            this.getPageContext().setAttribute(this.getVar(), text);
        }
        else
        {
            this.getPageContext().getOut().print(text);
        }

        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    if(typeof(com.skin.ayada.taglib) == "undefined"){
        com.skin.ayada.taglib = {};
    }

    /*
     * $RCSfile: ActionTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ActionTag = com.skin.ayada.taglib.ActionTag = /* implements com.skin.ayada.tagext.ParameterTag */ com.skin.framework.Class.create(com.skin.ayada.tagext.TagSupport, function(){
        this.className = null;
        this.method = null;
        this.page = null;
        this.parameters = {};
    });

    ActionTag.prototype.doStartTag = function(){
        this.parameters = {};
        ActionTag.$super.doStartTag.apply(this);
        return com.skin.ayada.tagext.Tag.EVAL_BODY_INCLUDE;
    };

    ActionTag.prototype.doEndTag = function(){
        var context = null;

        if(this.className != null)
        {
            context = ActionDispatcher.dispatch(this.pageContext, this.parameters, this.className, this.method);

            if(context != null)
            {
                context["request"] = this.pageContext.getAttribute("request");
                context["response"] = this.pageContext.getAttribute("response");
                context["session"] = this.pageContext.getAttribute("session");
            }
        }

        if(this.getPage() != null)
        {
            this.pageContext.include(this.getPage(), context);
        }

        return com.skin.ayada.tagext.Tag.EVAL_PAGE;
    };

    ActionTag.prototype.release = function(){
        this.parameters = {};
        ActionTag.$super.release.apply(this);
    };

    /**
     * @param className the className to set
     */
    ActionTag.prototype.setClassName = function(className){
        this.className = className;
    };

    /**
     * @return the className
     */
    ActionTag.prototype.getClassName = function(){
        return this.className;
    };

    /**
     * @param method the method to set
     */
    ActionTag.prototype.setMethod = function(method){
        this.method = method;
    };

    /**
     * @return the method
     */
    ActionTag.prototype.getMethod = function(){
        return this.method;
    };

    /**
     * @param page the page to set
     */
    ActionTag.prototype.setPage = function(page){
        this.page = page;
    };

    /**
     * @return the page
     */
    ActionTag.prototype.getPage = function(){
        return this.page;
    };

    /**
     * @param name
     * @param value
     */
    ActionTag.prototype.setParameter = function(name, value){
        this.parameters[name] = value;
    };

    /**
     * @param parameters the parameters to set
     */
    ActionTag.prototype.setParameters = function(parameters){
        this.parameters = parameters;
    };

    /**
     * @return the parameters
     */
    ActionTag.prototype.getParameters = function(){
        return this.parameters;
    };

    /*
     * $RCSfile: ActionDispatcher,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ActionDispatcher = com.skin.ayada.taglib.ActionDispatcher = com.skin.framework.Class.getInstance(function(){});

    /**
     * @param pageContext
     * @param parameters
     * @param className
     * @param methodName
     * @return Object
     */
    ActionDispatcher.dispatch = function(pageContext, parameters, className, methodName){
        var instance = this.getInstance(className);
        var method = null;

        if(methodName != null)
        {
            method = instance[methodName];
        }

        if(method == null)
        {
            method = instance["execute"];
        }

        if(method != null)
        {
            return method.apply(instance, [pageContext, parameters]);
        }
        else
        {
            return null;
        }
    };
    ActionDispatcher.getInstance = function(className){
        return (new Function("var type = typeof(" + className + "); if(type == \"function\"){return new " + className + "();}else{return " + className + "}"))();
    };
})();

/**
 * import
 */
var Ayada = (function(){
    if(typeof(Ayada) == "undefined")
    {
        Ayada = {};
    }
    else
    {
        return Ayada;
    }

    Ayada.StringWriter = com.skin.io.StringWriter;
    Ayada.TemplateContext = com.skin.ayada.template.TemplateContext;
    Ayada.TagLibraryFactory = com.skin.ayada.jstl.TagLibraryFactory;
    Ayada.TemplateFactory = com.skin.ayada.template.TemplateFactory;
    Ayada.JspFactory = com.skin.ayada.runtime.JspFactory;
    Ayada.ActionDispatcher = com.skin.ayada.taglib.ActionDispatcher;
    return Ayada;
})();