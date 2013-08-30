/**
 * $RCSfile: UserManager.js,v $$
 * $Revision: 1.1 $
 * $Date: 2012-10-18 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var UserManager = {};

/**
 * your business method
 */
UserManager.getUserList = function(pageNum, pageSize){
    var userList = [];

    for(var i = 0; i < pageSize; i++)
    {
        var index = (pageNum - 1) * pageSize + i + 1;
        userList[i] = {"userName": "test" + index, "userAge": (21 + i), "birthday": new Date()};
    }

    return userList;
};

/**
 * your business method
 */
UserManager.getUserCount = function(){
    return 853;
};

if(typeof(module) != "undefined")
{
    module.exports.getUserList = UserManager.getUserList;
    module.exports.getUserCount = UserManager.getUserCount;
}