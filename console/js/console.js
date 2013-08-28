/**
 * Skin JavaScript Library v1.0.0
 * Copyright (c) 2010 xuesong.net
 * 
 * mailto: xuesong.net@163.com
 * Date: 2010-04-28 10:24:21
 * Revision: 1012
 */
var logger = {};
var Console = {};

Console.count = 0;
Console.scroll = true;
Console.setting = {};
Console.setting.maxCacheSize = 9000;

Console.getDateTime = function(date)
{
    if(date == null)
    {
        date = new Date();
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

Console.select = function()
{
    var e = Console.container;

    if(e == null)
    {
        e = document.getElementById("console");
    }

    if(document.all)
    {
        /* for IE */
        var range = document.body.createTextRange();
        range.moveToElementText(e);
        range.select();
    }
    else
    {
        var selection = window.getSelection();

        if(selection.setBaseAndExtent)
        {
            /* for Safari */
            selection.setBaseAndExtent(myDiv, 0, myDiv, 1);
        }
        else
        {
            /* for FF, Opera */
            var range = document.createRange();
            range.selectNodeContents(e);
            selection.removeAllRanges();
            selection.addRange(range);

            window.focus();
        }
    }
};

Console.println = function(s, b)
{
    var e = Console.container;

    if(e == null)
    {
        e = document.getElementById("console");
        var target = e.getAttribute("scroll");

        if(target != null)
        {
            if(target == "window" || "document")
            {
                Console.target = document.documentElement;
            }
            else
            {
                Console.target = document.getElementById(target);
            }
        }
        else
        {
            Console.target = e;
        }

        Console.container = e;
    }

    if(e != null)
    {
        if(this.count >= Console.setting.maxCacheSize)
        {
            this.count = 0;
            e.innerHTML = "";
        }

        var p = document.createElement("p");
        var span = document.createElement("span");

        span.className = "time";

        if(this.count >= 1000)
        {
            span.appendChild(document.createTextNode(this.count + " - " + this.getDateTime() + " [DEBUG]: "));
        }
        else if(this.count >= 100)
        {
            span.appendChild(document.createTextNode("0" + this.count + " - " + this.getDateTime() + " [DEBUG]: "));
        }
        else if(this.count >= 10)
        {
            span.appendChild(document.createTextNode("00" + this.count + " - " + this.getDateTime() + " [DEBUG]: "));
        }
        else
        {
            span.appendChild(document.createTextNode("000" + this.count + " - " + this.getDateTime() + " [DEBUG]: "));
        }

        p.appendChild(span);

        if(s != null)
        {
            if(typeof(s) != "string")
            {
                s = s.toString();
            }

            var position = 0;

            for(var i = 0; i < s.length; i++)
            {
                if(s.charAt(i) == "\n")
                {
                    if(i > 0 && s.charAt(i - 1) == "\r")
                    {
                        p.appendChild(document.createTextNode(s.substring(position, i - 1)));
                    }
                    else
                    {
                        p.appendChild(document.createTextNode(s.substring(position, i)));
                    }
                    p.appendChild(document.createElement("br"));
                    position = i + 1;
                }
            }

            if(position < s.length)
            {
                p.appendChild(document.createTextNode(s.substring(position, s.length)));
            }
        }
        else
        {
            p.appendChild(document.createTextNode("null"));
        }

        e.appendChild(p);

        if(Console.scroll == true)
        {
            if(b != false && Console.target != null)
            {
                if(Console.timer == null)
                {
                    Console.timer = setTimeout(function(){Console.target.scrollTop = Console.target.scrollHeight; Console.timer = null;}, 500);
                }
            }
        }

        this.count++;
    }
};


Console.setScroll = function(enabled)
{
    if(enabled == true || enabled == false)
    {
        this.scroll = enabled;
    }
    else
    {
        this.scroll = !(this.scroll);
    }
};

Console.clear = function()
{
    var e = document.getElementById("console");

    if(e != null)
    {
        this.count = 0;
        e.innerHTML = "";
    }
};

Console.open = function()
{
    var e = document.getElementById("console");

    if(e != null)
    {
        e.style.display = "block";
    }
};

Console.close = function()
{
    var e = document.getElementById("console");

    if(e != null)
    {
        e.style.display = "none";
    }
};

logger.debug = function(s, b)
{
    Console.println(s, b);
};

logger.getDateTime = function(date)
{
    return Console.getDateTime(date);
};

logger.test = function()
{
    var e = document.getElementById("console");

    if(e != null)
    {
        this.debug(e.scrollTop + ": " + e.scrollHeight);
    }
};
