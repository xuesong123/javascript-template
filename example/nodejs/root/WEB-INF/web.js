var servletConfig = {"servletChain": []};

servletConfig.path = "/";
servletConfig.status = 1;
servletConfig.applicationName = "ROOT";
servletConfig.displayName = "ROOT";

servletConfig.watchConfig = {
    /**
     * default: 3 * 60
     */
    interval: 3 * 60
};

if(typeof(module) != "undefined")
{
    module.exports.servletConfig = servletConfig;
}