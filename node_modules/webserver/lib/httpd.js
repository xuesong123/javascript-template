var fs = require("fs");
var URL = require("url");
var path = require("path");
var http = require("http");
var zlib = require("zlib");

var MimeType = {
    "abs":         "audio/x-mpeg",
    "ai":          "application/postscript",
    "aif":         "audio/x-aiff",
    "aifc":        "audio/x-aiff",
    "aiff":        "audio/x-aiff",
    "aim":         "application/x-aim",
    "art":         "image/x-jg",
    "asf":         "video/x-ms-asf",
    "asx":         "video/x-ms-asf",
    "au":          "audio/basic",
    "avi":         "video/x-msvideo",
    "avx":         "video/x-rad-screenplay",
    "bcpio":       "application/x-bcpio",
    "bin":         "application/octet-stream",
    "bmp":         "image/bmp",
    "body":        "text/html",
    "cdf":         "application/x-cdf",
    "cer":         "application/x-x509-ca-cert",
    "class":       "application/java",
    "cpio":        "application/x-cpio",
    "csh":         "application/x-csh",
    "css":         "text/css",
    "dib":         "image/bmp",
    "doc":         "application/msword",
    "dtd":         "application/xml-dtd",
    "dv":          "video/x-dv",
    "dvi":         "application/x-dvi",
    "eps":         "application/postscript",
    "etx":         "text/x-setext",
    "exe":         "application/octet-stream",
    "gif":         "image/gif",
    "gtar":        "application/x-gtar",
    "gz":          "application/x-gzip",
    "hdf":         "application/x-hdf",
    "hqx":         "application/mac-binhex40",
    "htc":         "text/x-component",
    "htm":         "text/html",
    "html":        "text/html",
    "hqx":         "application/mac-binhex40",
    "ief":         "image/ief",
    "jad":         "text/vnd.sun.j2me.app-descriptor",
    "jar":         "application/java-archive",
    "java":        "text/plain",
    "jnlp":        "application/x-java-jnlp-file",
    "jpe":         "image/jpeg",
    "jpeg":        "image/jpeg",
    "jpg":         "image/jpeg",
    "js":          "text/javascript",
    "jsf":         "text/plain",
    "jspf":        "text/plain",
    "kar":         "audio/x-midi",
    "latex":       "application/x-latex",
    "m3u":         "audio/x-mpegurl",
    "mac":         "image/x-macpaint",
    "man":         "application/x-troff-man",
    "mathml":      "application/mathml+xml",
    "me":          "application/x-troff-me",
    "mid":         "audio/x-midi",
    "midi":        "audio/x-midi",
    "mif":         "application/x-mif",
    "mov":         "video/quicktime",
    "movie":       "video/x-sgi-movie",
    "mp1":         "audio/x-mpeg",
    "mp2":         "audio/x-mpeg",
    "mp3":         "audio/x-mpeg",
    "mp4":         "video/mp4",
    "mpa":         "audio/x-mpeg",
    "mpe":         "video/mpeg",
    "mpeg":        "video/mpeg",
    "mpega":       "audio/x-mpeg",
    "mpg":         "video/mpeg",
    "mpv2":        "video/mpeg2",
    "ms":          "application/x-wais-source",
    "nc":          "application/x-netcdf",
    "oda":         "application/oda",
    "odb":         "application/vnd.oasis.opendocument.database",
    "odc":         "application/vnd.oasis.opendocument.chart",
    "odf":         "application/vnd.oasis.opendocument.formula",
    "odg":         "application/vnd.oasis.opendocument.graphics",
    "odi":         "application/vnd.oasis.opendocument.image",
    "odm":         "application/vnd.oasis.opendocument.text-master",
    "odp":         "application/vnd.oasis.opendocument.presentation",
    "ods":         "application/vnd.oasis.opendocument.spreadsheet",
    "odt":         "application/vnd.oasis.opendocument.text",
    "otg":         "application/vnd.oasis.opendocument.graphics-template",
    "oth":         "application/vnd.oasis.opendocument.text-web",
    "otp":         "application/vnd.oasis.opendocument.presentation-template",
    "ots":         "application/vnd.oasis.opendocument.spreadsheet-template ",
    "ott":         "application/vnd.oasis.opendocument.text-template",
    "ogx":         "application/ogg",
    "ogv":         "video/ogg",
    "oga":         "audio/ogg",
    "ogg":         "audio/ogg",
    "spx":         "audio/ogg",
    "flac":        "audio/flac",
    "anx":         "application/annodex",
    "axa":         "audio/annodex",
    "axv":         "video/annodex",
    "xspf":        "application/xspf+xml",
    "pbm":         "image/x-portable-bitmap",
    "pct":         "image/pict",
    "pdf":         "application/pdf",
    "pgm":         "image/x-portable-graymap",
    "pic":         "image/pict",
    "pict":        "image/pict",
    "pls":         "audio/x-scpls",
    "png":         "image/png",
    "pnm":         "image/x-portable-anymap",
    "pnt":         "image/x-macpaint",
    "ppm":         "image/x-portable-pixmap",
    "ppt":         "application/vnd.ms-powerpoint",
    "pps":         "application/vnd.ms-powerpoint",
    "ps":          "application/postscript",
    "psd":         "image/x-photoshop",
    "qt":          "video/quicktime",
    "qti":         "image/x-quicktime",
    "qtif":        "image/x-quicktime",
    "ras":         "image/x-cmu-raster",
    "rdf":         "application/rdf+xml",
    "rgb":         "image/x-rgb",
    "rm":          "application/vnd.rn-realmedia",
    "roff":        "application/x-troff",
    "rtf":         "application/rtf",
    "rtx":         "text/richtext",
    "sh":          "application/x-sh",
    "shar":        "application/x-shar",
    "smf":         "audio/x-midi",
    "sit":         "application/x-stuffit",
    "snd":         "audio/basic",
    "src":         "application/x-wais-source",
    "sv4cpio":     "application/x-sv4cpio",
    "sv4crc":      "application/x-sv4crc",
    "svg":         "image/svg+xml",
    "svgz":        "image/svg+xml",
    "swf":         "application/x-shockwave-flash",
    "t":           "application/x-troff",
    "tar":         "application/x-tar",
    "tcl":         "application/x-tcl",
    "tex":         "application/x-tex",
    "texi":        "application/x-texinfo",
    "texinfo":     "application/x-texinfo",
    "tif":         "image/tiff",
    "tiff":        "image/tiff",
    "tr":          "application/x-troff",
    "tsv":         "text/tab-separated-values",
    "txt":         "text/plain",
    "ulw":         "audio/basic",
    "ustar":       "application/x-ustar",
    "vxml":        "application/voicexml+xml",
    "xbm":         "image/x-xbitmap",
    "xht":         "application/xhtml+xml",
    "xhtml":       "application/xhtml+xml",
    "xls":         "application/vnd.ms-excel",
    "xml":         "application/xml",
    "xpm":         "image/x-xpixmap",
    "xsl":         "application/xml",
    "xslt":        "application/xslt+xml",
    "xul":         "application/vnd.mozilla.xul+xml",
    "xwd":         "image/x-xwindowdump",
    "vsd":         "application/x-visio",
    "wav":         "audio/x-wav",
    "wbmp":        "image/vnd.wap.wbmp",
    "wml":         "text/vnd.wap.wml",
    "wmlc":        "application/vnd.wap.wmlc",
    "wmls":        "text/vnd.wap.wmlscript",
    "wmlscriptc":  "application/vnd.wap.wmlscriptc",
    "wmv":         "video/x-ms-wmv",
    "wrl":         "x-world/x-vrml",
    "wspolicy":    "application/wspolicy+xml",
    "Z":           "application/x-compress",
    "z":           "application/x-compress",
    "zip":         "application/zip"
};

function Httpd(host, home, path){
    this.host = host;
    this.home = home;
    this.path = path;

    this.config = {
        compress: new RegExp("^js$|^gif$|^jpg$|^png$|^css$|^htm$|^html$"),
        expires:  new RegExp("^js$|^gif$|^jpg$|^png$|^css$|^htm$|^html$"),
        maxAge:   180 * 24 * 60 * 60,
        welcome:  "index.html"
    };
}

/**
 * @param host
 */
Httpd.prototype.setHost = function(host){
    this.host = host;
};

/**
 * @param name
 */
Httpd.prototype.setHome = function(home){
    this.home = home;
};

/**
 * @param path
 */
Httpd.prototype.setPath = function(path){
    this.path = path;
};

/**
 * @param request
 * @param response
 */
Httpd.prototype.service = function(request, response){
    var uri = URL.parse(request.url).pathname;

    if(uri == null || uri == undefined || uri.slice(-1) == "/")
    {
        uri = "/" + this.config.welcome;
    }

    if(this.path != "/" && this.startsWith(uri, this.path + "/"))
    {
        uri = uri.substring(this.path.length);
    }

    /**
     * contextPath: /app2
     * http://localhost/app2
     * uri: /app2, path: /app2
     */
    if(uri == this.path)
    {
        uri = "/";
    }

    var homePath = fs.realpathSync(this.home);
    var realPath = path.join(homePath, path.normalize(uri));

    if(this.startsWith(realPath, homePath) == false)
    {
        response.writeHead(403, "Forbidden", {"Content-Type": "text/html"});
        response.end();
        return;
    }

    if(fs.existsSync(realPath) == false)
    {
        response.writeHead(404, "Not Found", {"Content-Type": "text/html"});
        response.end("<h1 error=\"httpd.404\">Request URL: " + request.url + " not found !</h1>");
        return;
    }

    var stats = fs.statSync(realPath);

    if(stats.isDirectory())
    {
        var indexList = ["index.htm", "index.html", "default.htm", "default.html"];

        for(var i = 0; i < indexList.length; i++)
        {
            var tempPath = path.join(realPath, indexList[i]);

            if(fs.existsSync(tempPath))
            {
                stats = fs.statSync(tempPath);

                if(stats.isFile())
                {
                    realPath = tempPath;
                    break;
                }
            }
        }
    }

    if(stats.isFile() == false)
    {
        response.writeHead(404, "Not Found", {"Content-Type": "text/html"});
        response.end("<h1 error=\"httpd.404\">Request URL: " + request.url + " not found !</h1>");
        response.end();
        return;
    }

    var length = stats.size;
    var fileName = this.getFileName(realPath);
    var extension = this.getExtension(realPath);
    var createTime = stats.mtime;
    var lastModified = stats.mtime;
    var contentType = this.getMimeType(realPath);
    var etag = this.getETag(lastModified.getTime());
    var compress = this.config.compress.test(extension);

    response.setHeader("Last-Modified", lastModified.toUTCString());
    response.setHeader("ETag", etag);
    response.setHeader("Date", createTime.toUTCString());
    response.setHeader("Content-Type", contentType);

    if(this.config.expires.test(extension))
    {
        var expires = new Date();
        expires.setTime(expires.getTime() + this.config.maxAge * 1000);
        response.setHeader("Expires", expires.toUTCString());
        response.setHeader("Cache-Control", "max-age=" + this.config.maxAge);
    }

    if(request.headers["range"] != null)
    {
        var range = this.getRange(request, length);

        if(range != null)
        {
            response.setHeader("Content-length", (range.end - range.start + 1)); // TODO: GZIP.length
            response.setHeader("Content-Disposition", "attachment;filename=\""+ encodeURIComponent(fileName) + "\"");
            response.setHeader("Content-Range", range.range);
            this.write(request, response, fs.createReadStream(realPath, {"start": range.start, "end": range.end}), compress, 206, "Partial");
        }
        else
        {
            response.setHeader("Content-Length", 0);
            response.writeHead(416, "Request Range Not Satisfiable");
            response.end();
        }
    }
    else
    {
        var ifModifiedSince = request.headers["if-modified-since"];
        var ifNoneMatch = request.headers["if-none-match"];
        var modified = true;
        var noneMath = true;

        if(ifModifiedSince != null && ifModifiedSince == lastModified.toUTCString())
        {
            modified = false;
        }

        if(ifNoneMatch != null && ifNoneMatch == etag)
        {
            noneMath = false;
        }

        if(modified == false && noneMath == false)
        {
            response.writeHead(304, "Not Modified");
            response.end();
            return;
        }

        response.setHeader("Content-length", length); // TODO: GZIP.length
        this.write(request, response, fs.createReadStream(realPath), compress, 200, "OK");
        return;
    }
};

/**
 * @param request
 * @param response
 * @param stream
 * @param compress
 * @param statusCode
 * @param reasonPhrase
 * @return boolean
 */
Httpd.prototype.write = function(request, response, stream, compress, statusCode, reasonPhrase){

    if(compress == true)
    {
        var acceptEncoding = request.headers["accept-encoding"];

        if(acceptEncoding != null)
        {
            if(/\bgzip\b/.test(acceptEncoding))
            {
                var zip = stream.pipe(zlib.createGzip());
                response.removeHeader("Content-Length");
                response.setHeader("Content-Encoding", "gzip");
                response.writeHead(statusCode, reasonPhrase);
                // response.setHeader("Content-length", length); reset contentLength
                zip.pipe(response);
                return true;
            }
            else if(/\bdeflate\b/.test(acceptEncoding))
            {
                var zip = stream.pipe(zlib.createDeflate());
                response.removeHeader("Content-Length");
                response.setHeader("Content-Encoding", "deflate");
                // response.setHeader("Content-length", length); reset contentLength
                response.writeHead(statusCode, reasonPhrase);
                zip.pipe(response);
                return true;
            }
        }
    }

    response.writeHead(statusCode, reasonPhrase);
    stream.pipe(response);
    return false;
};

/**
 * @param request
 * @param length
 * @return Range
 */
Httpd.prototype.getRange = function(request, length){
    var range = request.headers["range"];

    if(range != null)
    {
        var start = 0;
        var end = -1;

        if(this.startsWith(range, "bytes="))
        {
            range = range.substring(6);
        }

        var a = range.split("-");

        if(a.length > 1)
        {
            start = parseInt(a[0], 10);
            end = parseInt(a[1], 10);

            if(isNaN(start))
            {
                start = length - end;
                end = length - 1;
            }

            if(isNaN(end))
            {
                end = length - 1;
            }
        }

        if(isNaN(start) || isNaN(end) || start > end || end > length)
        {
            return;
        }

        return {"start": start, "end": end, "range": "bytes " + start + "-" + end + "/" + length};
    }

    return null;
};

/**
 * @param lastModified
 * @param start
 * @param end
 * @return String
 */
Httpd.prototype.getETag = function(lastModified, start, end){
    return ("W/\"f-" + lastModified + "\"");
};

/**
 * @param path
 * @return String
 */
Httpd.prototype.getMimeType = function(path){
    var mimeType = null;
    var ext = this.getExtension(path);

    if(ext.length > 0)
    {
        mimeType = MimeType[ext.toLowerCase()];
    }

    return (mimeType != null ? mimeType : "application/octet-stream");
};

/**
 * @param path
 * @return String
 */
Httpd.prototype.getFileName = function(path){
    if(path != null && path.length > 0)
    {
        var i = path.length - 1;

        for(; i > -1; i--)
        {
            var c = path.charAt(i);

            if(c == "/" || c == "\\" || c == ":")
            {
                break;
            }
        }

        return path.substring(i + 1);
    }

    return "";
};

/**
 * @param path
 * @return String
 */
Httpd.prototype.getExtension = function(path){

    var i = path.lastIndexOf(".");

    if(i > -1)
    {
        return path.substring(i + 1);
    }

    return "";
};

/**
 * @param source
 * @param search
 * @return String
 */
Httpd.prototype.startsWith = function(source, search){
    return (source.length >= search.length && source.substring(0, search.length) == search)
};

if(typeof(module) != undefined)
{
    module.exports.create = function(host, home, path){
        return new Httpd(host, home, path);
    };
}

/**
Content-Length:4
Content-Type:text/html;charset=UTF-8
Date:Sun, 28 Oct 2012 08:16:10 GMT
Server:Apache-Coyote/1.1
Set-Cookie:test1=test1; Domain=www.mytest.com; Expires=Sun, 28-Oct-2012 08:21:10 GMT; Path=/test
Set-Cookie:test2=test2; Domain=www.mytest.com; Expires=Sun, 28-Oct-2012 08:21:10 GMT; Path=/test
Set-Cookie:test3=test3; Domain=www.mytest.com; Expires=Sun, 28-Oct-2012 08:21:10 GMT; Path=/test
Set-Cookie:test4=test4; Domain=www.mytest.com; Expires=Sun, 28-Oct-2012 08:21:10 GMT; Path=/test
*/
