const deepcopy = require('deepcopy');
var cfg = require("./constraint-type");

//default constraint from data file.
var cache = require("./parse-server-constraints");

//store all controlled objectId and constraint Type from DB
var cacheObjInfo =[];

var cacheCopy = buildFullConstraints();

function buildShareConstraint(share){
    //todo need to dynamic column name here.
    //hardcode temporary
    cache.definitions.Channel = share.Channel;
    cache.definitions.PremiumFeeds = share.PremiumFeeds;
    cache.definitions.Search = share.Search;
    cache.definitions.PushBehavior = share.PushBehavior;
    cache.definitions.Analytics = share.Analytics;
    cache.definitions.Advertising = share.Advertising;
    cache.definitions.BreakingNews = share.BreakingNews;
    cache.definitions.Weather = share.Weather;
    cache.definitions.Connect = share.Connect;
    cache.definitions.Video = share.Video;
    cache.definitions.StoreAccounts = share.StoreAccounts;
}
function buildFullConstraints(){

    var item = require("./collection-config/item");
    var menu = require("./collection-config/menu");
    var menuItem = require("./collection-config/menu-item");
    var setting = require("./collection-config/setting");
    var share = require("./collection-config/share");
    var style = require("./collection-config/style");

    var cfgData = {definitions:share};
    cfgData.definitions.StyleConfig = style;
    cfgData.definitions.ItemConfig = item;
    cfgData.definitions.SettingConfig = setting;
    cfgData.definitions.MenuConfig = menu;
    cfgData.definitions.MenuItem = menuItem;

    //the last menu Item
    var childMenuItem = deepcopy(menuItem);
    delete childMenuItem.items.properties["menu"];
    cfgData.definitions.ChildMenuItem = childMenuItem;

    cfgData = refineJson(cfgData);

    return cfgData;
}

function refineJson(data){
    if (data) {
        var str = JSON.stringify(data);
        str = str.replace(/\"\#\$ref\":/g , "\"$ref\":");
        return JSON.parse(str);
    }
    return data;
}

function setConstraint(parseOjbArr){
    var style =  getSpecificConstraint(cfg.constraintType.style,parseOjbArr);
    var item = getSpecificConstraint(cfg.constraintType.item,parseOjbArr);
    var setting = getSpecificConstraint(cfg.constraintType.setting,parseOjbArr);
    var menu = getSpecificConstraint(cfg.constraintType.menu,parseOjbArr);
    var menuItem = getSpecificConstraint(cfg.constraintType.menuItem,parseOjbArr);
    var share = getSpecificConstraint(cfg.constraintType.share,parseOjbArr);

    //for style
    if (style != null) {
        cache.definitions.StyleConfig = style;
    }

    //for share
    if (share != null) {
        buildShareConstraint(share);
    }

    //for item constraint
    if (item != null) {
        cache.definitions.ItemConfig = item;
    }

    //for setting constraint
    if (setting != null) {
        cache.definitions.SettingConfig = setting;
    }

    //for menu constraint
    if (menu != null) {
        cache.definitions.MenuConfig = menu;
    }

    //for menu item constraint
    if (menuItem != null) {
        cache.definitions.MenuItem = menuItem;

        //for child menu constraint
        var childMenuItem = deepcopy(menuItem);
        delete childMenuItem.items.properties["menu"];

        cache.definitions.ChildMenuItem = childMenuItem;
    }
}

function getSpecificConstraint(constraintType, parseOjbArr){
    var constraint = null;
    for (var i = 0; i < parseOjbArr.length; i++) {

        //append cache object information
        var existed = false;
        for(var i =0;i< cacheObjInfo.length;i++){
            if(cacheObjInfo[i].objectId === parseOjbArr[i].get("objectId")
            || cacheObjInfo[i].constraintType === parseOjbArr[i].get("constraintType"))
            {
                existed = true;
            }
        }

        if(!existed){
            cacheObjInfo.push({objectId:parseOjbArr[i].get("objectId")
                                ,constraintType:parseOjbArr[i].get("constraintType")});
        }

        //end append cache object infornamtion

        constraint = parseOjbArr[i].toJSON();
        if (constraint.constraintType === constraintType) {

            //remove unused fields
            delete constraint["constraintType"];
            delete constraint["createdAt"];
            delete constraint["updatedAt"];
            delete constraint["objectId"];
            break;
        }
    }
    return constraint;
};

module.exports = {
    notifySaved: function(parseOjbArr){
        setConstraint(parseOjbArr);
    },
    getConstraint: function(json){
        var key = json ? (json.key ? json.key : "" ) : "";
        if (key != "") {
           return cache.definitions[key];
        }
        return cache;

    },
    initConstraint: function(){
        var query = new Parse.Query(cfg.collectionName);
        query.find().then(function(result){
            if (result) {
              setConstraint(result);
            }

        }).catch(function(error){
            console.log("initConstraint",error);
        });
    },
    isExisted : function(json){
        var objectId = (json && json.objectId) ? json.objectId : "";
        var constraintType = (json && json.constraintType) ? json.constraintType : "";
        var exist = false;
        var count = 0;
        for(var i=0;i< cacheObjInfo.length;i++){
          //by objectId
          if(cacheObjInfo[i].objectId === objectId){
              count++;
          }

          //by constraintType
          if(cacheObjInfo[i].constraintType === constraintType){
              exist = true;
              break;
          }
        }

        exist = exist ? exist:(count > 1: true :false);
        return exist;
    },
    removeItems:function(json){

        var objectId = (json && json.objectId)? json.objectId : "";
        var constraintType = (json && json.constraintType)? json.constraintType : "";

        for(var i=0;i< cacheObjInfo.length;i++){
            if(cacheObjInfo[i].objectId === objectId || cacheObjInfo[i].constraintType === constraintType ){
                cacheObjInfo.splice(i,1);
                break;
            }
        }
    }
}
