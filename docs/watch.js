

ServletContext.prototype.watch = function(){
    var lib = path.join(this.getRealPath("/"), "WEB-INF/lib");

    if(fs.existsSync(lib) == true)
    {
        var instance = this;

        if(this.watchFileList == null)
        {
            this.watchFileList = [];
        }
        else
        {
            this.unwatch();
        }

        FileIterator.each(lib, function(file){
            var stats = fs.statSync(file);

            if(stats.isDirectory())
            {
                console.log("[ServletContext]: WATCH: " + file);
                instance.watchFileList.push(file);

                fs.watchFile(file, function(curr, prev){
                    console.log(file + " - the current mtime is: " + DateUtil.toString(curr.mtime));
                    console.log(file + " - the previous mtime was: " + DateUtil.toString(prev.mtime));

                    if(instance.watchTimer != null)
                    {
                        clearTimeout(instance.watchTimer);
                    }

                    instance.watchTimer = setTimeout(function(){instance.reload();}, 10000);
                });
            }
        });
    }

    this.watchStatus = 1;
};

ServletContext.prototype.unwatch = function(){
    if(this.watchFileList != null)
    {
        for(var i = 0, length = this.watchFileList.length; i < length; i++)
        {
            console.log("[ServletContext]: UNWATCH: " + this.watchFileList[i]);
            fs.unwatchFile(this.watchFileList[i]);
        }
        this.watchFileList = [];
    }

    this.watchStatus = 0;
};