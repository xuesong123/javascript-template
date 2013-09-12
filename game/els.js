var fs = require("fs");

var Cursor = function(stream){
    this.stream = stream;
    this.prefix = "\033[";
    this.suffix = "m";
};

Cursor.prototype.write = function(){
    this.stream.write.apply(this.stream, arguments);
    return this;
};

Cursor.prototype.beep = function (){
    this.write("\007");
    return this;
};

Cursor.prototype.setColor = function(color){
    this.write(this.prefix + String(color) + this.suffix);
    return this;
};

Cursor.prototype.setPosition = function (x, y){
    x = x | 0
    y = y | 0
    this.write(this.prefix + y + ";" + x + "H");
    return this;
};

var cursor = new Cursor(process.stdout);
var E = require("./book_donate.js").E;

E.prototype.baseX = 23;
E.prototype.baseY = 1;

/**
 * @Override
 */
E.prototype.create = function(score){
    this.clear();
    var pool = [
        "#################################",
        "#            #                  #",
        "#            # Speed: 8888888888#",
        "#            # Score: 8888888888#",
        "#            #                  #",
        "#            #                  #",
        "#            #                  #",
        "#            #                  #",
        "#            #                  #",
        "#            # 1111             #",
        "#            # 1111             #",
        "#            # 1111             #",
        "#            #                  #",
        "#            #                  #",
        "#            #                  #",
        "#            #                  #",
        "#            # Hurry up!        #",
        "#            #                  #",
        "#            #                  #",
        "#################################"
    ];

    cursor.setColor(90);

    for(var i = 0; i < pool.length; i++)
    {
        cursor.setPosition(this.baseX, this.baseY + i);
        cursor.write(pool[i].replace(/1/g, "\1"));
    }

    this.setSpeed(0);
    this.setScore(0);
    this.info("Hurry up !");
};

/**
 * @Override
 */
E.prototype.clear = function(){
    for(var i = 1; i <= 25; i++)
    {
        cursor.setPosition(1, i);
        cursor.write("                                                                                ");
    }
};

/**
 * @Override
 */
E.prototype.setSpeed = function(speed){
    cursor.setPosition(this.baseX + 15, this.baseY + 2);
    cursor.write("                 ");
    cursor.setPosition(this.baseX + 15, this.baseY + 2);
    cursor.write("Speed: " + speed);
};

/**
 * @Override
 */
E.prototype.setScore = function(score){
    cursor.setPosition(this.baseX + 15, this.baseY + 3);
    cursor.write("                 ");
    cursor.setPosition(this.baseX + 15, this.baseY + 3);
    cursor.write("Score: " + score);
};

/**
 * @Override
 */
E.prototype.info = function(text){
    cursor.setPosition(this.baseX + 15, this.baseY + 16);
    cursor.write("                 ");
    cursor.setPosition(this.baseX + 15, this.baseY + 16);
    cursor.setColor(31);
    cursor.write(text);
};

/**
 * @Override
 */
E.prototype.copy = function(i, j){
    var ri = this.toBinaryString(this.p[i]);
    cursor.setPosition(this.baseX + 1, this.baseY + j + 1);
    cursor.write(ri.substring(3, 15).replace(/0/g, " ").replace(/1/g, "\1"));
};

/**
 * @Override
 */
E.prototype.setVisible = function(i, j, color){
    cursor.setPosition(this.baseX + j + 1, this.baseY + i + 1);

    if(color == this.bgcolor)
    {
        cursor.write(" ");
    }
    else
    {
        cursor.setColor(color);
        cursor.write("\1");
    }
};

/**
 * @Override
 */
E.prototype.setNextVisible = function(i, j, color, text){
    cursor.setPosition(this.baseX + j + 15, this.baseY + i + 9);

    if(color == this.bgcolor)
    {
        cursor.write(" ");
    }
    else
    {
        cursor.setColor(color);
        cursor.write("\1");
    }
};

var els = new E();
els.colors = [34, 36, 32, 35, 31, 33, 91, 92, 93, 94, 95, 96];
els.bgcolor = 30;

/*
els.create();
els.start();
return;
*/

/*
els.create();
els.paint();
els.copy(4, 5);
els.rand();
els.rand();
els.next();
cursor.setPosition(1, 22);
return;
*/

var http = require("http");
var server = http.createServer(function(request, response){
    var url = request.url;
    response.setHeader("Content-Type", "text/html; charset=UTF-8");

    switch(url)
    {
        case "/index":{
            index(request, response);
            return;
        }
        case "/start":{
            els.create();
            els.start();
            response.end("start");
            break;
        }
        case "/pause":{
            els.pause();
            response.end("pause");
            break;
        }
        case "/left":{
            els.left();
            response.end("left");
            break;
        }
        case "/right":{
            els.right();
            response.end("right");
            break;
        }
        case "/up":{
            els.up();
            response.end("up");
            break;
        }
        case "/down":{
            els.down(1);
            response.end("down");
            break;
        }
        case "/downx":{
            els.down(18);
            response.end("downx");
            break;
        }
        case "/change":{
            els.change();
            response.end("change");
            break;
        }
        case "/pool":{
            var text = els.getPoolString();
            response.writeHead(200, "OK", {"Content-type": "text/html; charset=UTF-8"});
            response.end(text);
            break;
        }
        default:{
            response.writeHead(404, "Not Found", {"Content-type": "text/html; charset=UTF-8"});
            response.end("<h4>404 Not Found</h4>");
            break;
        }
    }
});

function index(request, response){
    var stats = fs.statSync("index.html");
    var stream = fs.createReadStream("index.html");
    response.setHeader("Content-length", stats.size);
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    response.writeHead(200, "OK");
    stream.pipe(response);
}

server.listen(80);