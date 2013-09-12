var prefix = "\033["; // For all escape codes
var suffix = "m";     // Only for color codes

var Cursor = function(stream){
    this.stream = stream;
};

Cursor.prototype.write = function(){
    this.stream.write.apply(this.stream, arguments)
};

Cursor.prototype.beep = function (){
    this.write("\007");
    return this;
};

Cursor.prototype.setColor = function(color){
    this.write(prefix + String(color) + suffix);
    return this;
};

Cursor.prototype.setPosition = function (x, y){
    x = x | 0
    y = y | 0
    this.write(prefix + y + ";" + x + "H");
    return this;
};

var c = new Cursor(process.stdout);
c.setPosition(40, 5);

// c.setColor(38 + ";2;" + rgb(210, 255, 0));
// c.write("Hello World !");

var colors = {
    white: 37,
    black: 30,
    blue: 34,
    cyan: 36,
    green: 32,
    magenta: 35,
    red: 31,
    yellow: 33,
    grey: 90,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97
};

var styles = {
    bold: 1,
    italic: 3,
    underline: 4,
    inverse: 7
};

/*
process.stdout.write("\033[32;3;4m");
process.stdout.write("Hello World !");
process.stdout.write("\1");
*/

showBlock(40, 5, 1);

function showBlock(x, y, type){
    c.setPosition(40, 5);
    process.stdout.write("\1");
    c.setPosition(40, 6);
    process.stdout.write("\1\1");
    c.setPosition(41, 7);
    process.stdout.write("\1");
};

function rgb (r, g, b){
    var red = r / 255 * 5;
    var green = g / 255 * 5;
    var blue = b / 255 * 5;
    return rgb5(red, green, blue);
}

/**
 * Turns rgb 0-5 values into a single ANSI color code to use.
 */
function rgb5 (r, g, b){
    var red = Math.round(r);
    var green = Math.round(g);
    var blue = Math.round(b);
    return 16 + (red * 36) + (green * 6) + blue;
}

/*
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", function(chunk) {
    process.stdout.write("data: " + chunk);
});
*/