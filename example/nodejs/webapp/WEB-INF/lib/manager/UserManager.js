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
UserManager.getById = function(userId){
    return {"userId": userId, "userName": "test" + userId, "userAge": (21 + userId), "birthday": new Date()};
};

/**
 * your business method
 */
UserManager.getUserList = function(pageNum, pageSize){
    var userList = [];

    for(var i = 0; i < pageSize; i++)
    {
        var index = (pageNum - 1) * pageSize + i + 1;
        userList[i] = {"userId": index, "userName": "test" + index, "userAge": (21 + i), "birthday": new Date()};
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
    module.exports.getById = UserManager.getById;
    module.exports.getUserList = UserManager.getUserList;
    module.exports.getUserCount = UserManager.getUserCount;
}