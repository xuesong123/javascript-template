var logger = {debug: function(s, b){}};

var E = function(){
    this.x = 5;
    this.y = 0;
    this.n = 0;
    this.t = 0;
    this.c = 0;

    this.p = [
        0x2001, 0x2001, 0x2001, 0x2001,
        0x2001, 0x2001, 0x2001, 0x2001,
        0x2001, 0x2001, 0x2001, 0x2001,
        0x2001, 0x2001, 0x2001, 0x2001,
        0x2001, 0x2001, 0xffff, 0xffff
    ];

    this.d = [
        [0xcc00],
        [0x4444, 0xf000],
        [0x8c40, 0x6c00],
        [0x4c80, 0xc600],
        [0x44c0, 0x8e00, 0xc880, 0xe200],
        [0x88c0, 0xe800, 0xc440, 0x2e00],
        [0x4e00, 0x8c80, 0xe400, 0x4c40]
        // [0x4e40],
        // [0x9f00, 0xc88c, 0xf900, 0xc44c]
    ];

    this.texts = [
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            ",
        "            "
    ];

    this.colors = ["#008000", "#4d0099", "#000093", "#777722", "#b500b5", "#800064"];
    this.colors = ["#008000", "#4d0099", "#000093", "#777722", "#b500b5", "#800064"];
    this.colors = ["#999999", "#0000ff", "#80ffff", "#80ff80", "#ffff00", "#ff8000", "#ff00ff", "#ff0000"];
    this.colors = ["#1941a5", "#afd8f8", "#0099cc", "#8bba00", "#a66edd", "#f984a1", "#0099ff", "#006f00"];
    this.colors = ["#1941a5", "#4d0099", "#0099cc", "#8bba00", "#a66edd", "#f984a1", "#0099ff", "#006f00"];
    this.bgcolor = "#f2b05c";
    this.score  = 0;
    this.speed  = 0;
    this.delay  = 50;
    this.state  = 0;
};

E.prototype.create = function(id, rows, cells){
    var a = [];
    a[a.length] = "<table id=\"" + id + "\" class=\"blocks\">";

    for(var i = 0; i < rows; i++)
    {
        a[a.length] = "<tr>";

        for(var j = 0; j < cells; j++)
        {
            a[a.length] = "<td>&nbsp;</td>";
        }

        a[a.length] = "</tr>";
    }

    a[a.length] = "</table>";
    return a.join("");
};

E.prototype.parse = function(a){
    var p = [];

    for(var i = 0; i < a.length; i++)
    {
        p[i] = parseInt(a[i], 2);
    }

    return p;
};

E.prototype.print = function(){
    logger.debug(this.getPoolString());
};

E.prototype.getPoolString = function(){
    var b = [];
    var p = this.p;

    for(var i = 0; i < p.length; i++)
    {
        b.push(this.toBinaryString(p[i]));
    }

    return b.join("\r\n");
};

E.prototype.toString = function(b, x, y){
    var a = [];

    for(var i = 0; i < 4; i++)
    {
        var v = (b & (0xf << (12 - i * 4))) << (i * 4) >> x;

        for(var j = 15; j > -1; j--)
        {
            a[a.length] = ((v >> j) & 0x1);
        }
    }

    return a.join("");
};

E.prototype.toBinaryString = function(b){
    var s = b.toString(2);

    if(s.length < 16)
    {
        var buffer = [
            "0", "0", "0", "0",
            "0", "0", "0", "0",
            "0", "0", "0", "0",
            "0", "0", "0", "0"
        ];

        var j = 16 - s.length;

        for(var i = 0; i < s.length; i++)
        {
            buffer[j++] = s.charAt(i);
        }

        return buffer.join("");
    }
    else
    {
        return s;
    }
};

E.prototype.setScore = function(score){
    document.getElementById("score").innerHTML = score;
};

E.prototype.setSpeed = function(speed){
    document.getElementById("speed").innerHTML = speed;
};

E.prototype.info = function(text){
    document.getElementById("good").innerHTML = text;
};

E.prototype.bind = function(target, method){
    var args = [];

    for(var i = 2; i < arguments.length; i++)
    {
        args[i - 2] = arguments[i];
    }

    return function(){
        method.apply(target, args);
    };
};

E.prototype.left = function(){
    if(this.state == 1)
    {
        var x = this.x - 1;
        var y = this.y + 0;
        var b = this.d[this.n][this.t];

        if(this.move(b, x, y))
        {
            this.draw(b, x + 1, y, 0);
            this.draw(b, x + 0, y, 1);
            this.x = x;
            return true;
        }
    }

    return false;
};

E.prototype.right = function(){
    if(this.state == 1)
    {
        var x = this.x + 1;
        var y = this.y + 0;
        var b = this.d[this.n][this.t];

        if(this.move(b, x, y))
        {
            this.draw(b, x - 1, y, 0);
            this.draw(b, x + 0, y, 1);
            this.x = x;
            return true;
        }
    }

    return false;
};

E.prototype.change = function(){
    if(this.state == 1)
    {
        var x = this.x;
        var y = this.y;
        var t = this.t;
        var b = this.d[this.n][this.t];
        var c = this.d[this.n][(t + 1) % (this.d[this.n].length)];

        if(this.move(c, this.x, this.y))
        {
            this.draw(b, x, y, 0);
            this.draw(c, x, y, 1);
            this.t = (t + 1) % (this.d[this.n].length);
            return true;
        }
    }

    return false;
};

E.prototype.up = function(){
    if(this.state == 1)
    {
        var x = this.x + 0;
        var y = this.y - 1;
        var b = this.d[this.n][this.t];

        if(this.move(b, x, y))
        {
            this.draw(b, x, y + 1, 0);
            this.draw(b, x, y + 0, 1);
            this.y = y;
            return true;
        }
    }

    return false;
};

E.prototype.down = function(offset){
    if(this.state == 1)
    {
        var i = 0;
        var x = this.x;
        var y = this.y;
        var z = this.y;
        var b = this.d[this.n][this.t];

        while(i < offset && this.move(b, x, z + 1))
        {
            z++;
            i++;
        }

        if(z > this.y)
        {
            this.draw(b, x, y, 0);
            this.draw(b, x, z, 1);
            this.y = z;
        }

        return i;
    }

    return 0;
};

E.prototype.test = function(n){
    if(this.state == 1)
    {
        var x = this.x;
        var y = this.y;
        var b = this.d[this.n][this.t];
        this.draw(b, x, y, 0);

        this.x = 5;
        this.y = 0;
        this.n = n;
        this.t = 0;
        var c = this.d[this.n][this.t];
        this.draw(c, this.x, this.y, 1);
        return true;
    }

    return false;
};

E.prototype.move = function(b, x, y){
    x = x + 3;

    for(var i = 0, j = y; i < 4; i++, j++)
    {
        var v = (b & (0xf << (12 - i * 4))) << (i * 4) >> x;

        if(j < 0 || j > this.p.length)
        {
            if(v > 0)
            {
                return false;
            }
            else
            {
                continue;
            }
        }

        if((v & this.p[y + i]) > 0)
        {
            return false;
        }
    }

    return true;
};

E.prototype.task = function(){
    if(this.state == 0)
    {
        return;
    }

    if(this.down(1) < 1)
    {
        var x = this.x + 3;
        var y = this.y + 0;
        var b = this.d[this.n][this.t];

        for(var i = 0, j = y; i < 4; i++, j++)
        {
            var v = (b & (0xf << (12 - i * 4))) << (i * 4) >> x;

            if(j < 0 || j >= this.p.length)
            {
                continue;
            }

            this.p[y + i] = (v | this.p[y + i]);
        }

        var line = [];

        for(var i = 0; i < 18; i++)
        {
            if(this.p[i] == 0x3FFF)
            {
                line[line.length] = i;

                for(var j = i; j > 0; j--)
                {
                    this.p[j] = this.p[j - 1];
                }

                this.y++;
            }
        }

        if(this.y == 0)
        {
            this.gameover();
            return;
        }

        if(line.length > 0)
        {
            this.score = this.score + (Math.pow(2, line.length) - 1) * 100;

            for(var i = 0; i < 20; i++)
            {
                if(this.score >= ((i + 1) * (i + 2) * 1000))
                {
                    this.speed = i;
                }
                else
                {
                    break;
                }
            }

            this.setSpeed(this.speed);
            this.setScore(this.score);
        }

        var callback = this.getCallback(line);
        this.animate(0, line, callback);
    }
    else
    {
        this.schedule();
    }
};

E.prototype.schedule = function(){
    if(this.timer != null)
    {
        clearTimeout(this.timer);
    }

    if(this.handler == null)
    {
        this.handler = this.bind(this, this.task);
    }

    var timeout = 1000 - this.speed * this.delay;
    this.timer = setTimeout(this.handler, (timeout > 50 ? timeout : 50));
};

E.prototype.start = function(){
    if(this.timer != null)
    {
        clearTimeout(this.timer);
    }

    for(var i = 0; i < 18; i++)
    {
        this.p[i] = 0x2001;
    }

    this.state = 0;
    this.play(35, function(){
        this.state = 1;
        this.paint();
        this.rand();
        this.rand();
        this.next();
        this.schedule();
    });
};

E.prototype.pause = function(){
    if(this.state == 1)
    {
        this.state = 2;
        this.info("PAUSE");

        if(this.timer != null)
        {
            clearTimeout(this.timer);
        }
    }
    else if(this.state == 2)
    {
        this.state = 1;
        this.schedule();
    }
};

E.prototype.gameover = function(){
    this.state = 0;
    this.info("Game Over");

    for(var i = 0; i < 4; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            this.setNextVisible(i, j, this.bgcolor, this.texts[i].charAt(j));
        }
    }

    this.play(35);
};

E.prototype.play = function(i, callback){
    if(i >= 0)
    {
        var r = Math.max(i % 18, 0);
        var t = Math.floor(i / 18) & 0x1;

        if(t == 1)
        {
            this.show(r, 1);
            setTimeout(this.bind(this, this.play, i - 1, callback), 100);
        }
        else
        {
            this.show(17 - r, 0);
            setTimeout(this.bind(this, this.play, i - 1, callback), 100);
        }
    }
    else
    {
        if(callback != null)
        {
            callback.apply(this);
        }
    }
};

E.prototype.animate = function(count, line, callback){
    if(line.length > 0)
    {
        var color = ((count & 0x1) < 1 ? this.bgcolor : "#008000");

        for(var i = 0; i < 4 && line[i] > 0; i++)
        {
            for(var j = 0; j < 12; j++)
            {
                this.setVisible(line[i], j, color);
            }
        }

        this.info((color != 0 ? "Good ! Good !" : ""));

        if(count >= 6)
        {
            if(callback != null)
            {
                callback();
            }
        }
        else
        {
            setTimeout(this.bind(this, this.animate, count + 1, line, callback), (color != 0 ? 100 : 50));
        }
    }
    else
    {
        if(callback != null)
        {
            callback();
        }
    }
};

E.prototype.getCallback = function(line){
    var callback = function(line){
        if(line.length > 0)
        {
            for(var i = 0; i < line.length; i++)
            {
                for(var j = line[i]; j > 0; j--)
                {
                    this.copy(j - 1, j);
                }
            }
        }

        this.next();
        this.schedule();
    };

    return this.bind(this, callback, line);
};

E.prototype.rand = function(){
    var i = 0;
    this.n = this._n;
    this.t = this._t;
    this.c = this._c;

    while(i < 10 && this.n == this._n)
    {
        this.n = this._n;
        this.t = this._t;
        this._n = Math.floor(Math.random() * this.d.length);
        this._t = Math.floor(Math.random() * this.d[this._n].length);
        i++;
    }

    i = 0;

    while(i < 10 && this.c == this._c)
    {
        this.c = this._c;
        this._c = Math.floor(Math.random() * this.colors.length);
        i++;
    }
};

E.prototype.next = function(){
    this.x = 5;
    this.y = 0;
    this.rand();
    var b = this.d[this.n][this.t];
    this.draw(b, this.x, this.y, 1);

    var x = 4;
    var y = 0;
    var b = this.d[this._n][this._t]
    this.info("Hurry up");

    for(var i = 0; i < 4; i++)
    {
        var v = (b & (0xf << (12 - i * 4))) << (i * 4) >> x;

        for(var j = 0; j < 4; j++)
        {
            var t = v & (0x1 << (15 - x - j));

            if(t > 0)
            {
                this.setNextVisible(i, j, this.colors[this._c], "1");
            }
            else
            {
                this.setNextVisible(i, j, this.bgcolor, "0");
            }
        }
    }
};

E.prototype.paint = function(){
    var color = this.colors[this.c];

    for(var i = 0; i < 18; i++)
    {
        var v = this.p[i];

        for(var j = 0; j < 12; j++)
        {
            if((v & (0x1000 >> j)) > 0)
            {
                this.setVisible(i, j, color);
            }
            else
            {
                this.setVisible(i, j, this.bgcolor);
            }
        }
    }
};

E.prototype.draw = function(b, x, y, d){
    x = x + 4;
    var color = (d > 0 ? this.colors[this.c] : this.bgcolor);

    for(var i = 0; i < 4; i++)
    {
        var v = (b & (0xf << (12 - i * 4))) << (i * 4) >> x;

        for(var j = 0; j < 4; j++)
        {
            var t = v & (0x1 << (15 - x - j));

            if(t > 0)
            {
                this.setVisible(y + i, x + j - 4, color);
            }
        }
    }
};

E.prototype.show = function(i, b){
    for(var j = 0; j < 12; j++)
    {
        if(b > 0)
        {
            var color = Math.floor(Math.random() * this.colors.length);
            this.setVisible(i, j, this.colors[color]);
        }
        else
        {
            this.setVisible(i, j, this.bgcolor);
        }
    }
};

E.prototype.copy = function(i, j){
    var table = document.getElementById("PoolTable");

    for(var k = 0; k < 12; k++)
    {
        table.rows[j].cells[k].innerHTML = table.rows[i].cells[k].innerHTML;
        table.rows[j].cells[k].style.backgroundColor = table.rows[i].cells[k].style.backgroundColor;
    }
};

E.prototype.setVisible = function(i, j, color){
    var table = document.getElementById("PoolTable");
    table.rows[i].cells[j].innerHTML = (color != this.bgcolor ? this.texts[i].charAt(j) : "0");
    table.rows[i].cells[j].style.backgroundColor = color;
};

E.prototype.setNextVisible = function(i, j, c, t){
    var table = document.getElementById("NextTable");
    table.rows[i].cells[j].style.backgroundColor = c;
    table.rows[i].cells[j].innerHTML = t;
};

E.prototype.event = function(e){
    if(e.ctrlKey)
    {
        return false;
    }

    var key = e.keyCode;
    logger.debug("key: " + key);

    switch(key)
    {
        case 37: // <
        case 65: // A
        {
            this.left();
            break;
        }
        case 39: // >
        case 68: // D
        {
            this.right();
            break;
        }
        case 38: // ^
        case 87: // W
        case 70: // F
        {
            this.change();
            break;
        }
        case 40: // v
        case 83: // S
        {
            this.down(1);
            break;
        }
        case 32: // -
        {
            this.down(18);
            break;
        }
        case 85: // U
        {
            this.up();
            break;
        }
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
        case 53: // 5
        case 54: // 6
        case 55: // 7
        {
            this.test(key - 49);
            break;
        }
        case 80: // P
        {
            this.print();
            break;
        }
        case 113: // F2
        {
            this.start();
            break;
        }
        case 13: // Enter
        {
            this.pause();
            break;
        }
        default:
        {
            break;
        }
    }

    if(e.stopPropagation)
    {
        e.stopPropagation();
    }
    else
    {
        e.cancelBubble = true;
    }

    if(e.preventDefault)
    {
        e.preventDefault();
    }

    e.cancel = true;
    e.returnValue = false;
    return false;
};

/*
E.prototype.setScore = function(score);
E.prototype.setSpeed = function(speed);
E.prototype.info = function(text);
E.prototype.copy = function(i, j);
E.prototype.setVisible = function(i, j, color);
E.prototype.setNextVisible = function(i, j, c, t);
*/

/**
 * nodejs support
 */
if(typeof(module) != "undefined")
{
    module.exports.E = E;
}
