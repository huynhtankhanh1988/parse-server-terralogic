const deepcopy = require('deepcopy');
var cfg = require("./constraint-type");

//default constraint from data file.
var cache = require("./parse-server-constraints");

function buildShareConstraint(shareJson){

    //todo need to dynamic column name here.
    //hardcode temporary
    cache.definition.Channel = share.Channel;
    cache.definition.PremiumFeeds = share.PremiumFeeds;
    cache.definition.Search = share.Search;
    cache.definition.PushBehavior = share.PushBehavior;
    cache.definition.Analytics = share.Analytics;
    cache.definition.Advertising = share.Advertising;
    cache.definition.BreakingNews = share.BreakingNews;
    cache.definition.Weather = share.Weather;
    cache.definition.Connect = share.Connect;
    cache.definition.Video = share.Video;
    cache.definition.StoreAccounts = share.StoreAccounts;
}

function refineJson(data){
    if(data){
        var str = JSON.stringify(data);
        str = str.replace(/\"\#\$ref\":/g , "\"$ref\":");
        return JSON.parse(str);
    }
    return data;
}

function setConstraint(parseOjbArr){

    var style =  getSpecificConstraint(cfg.constraintType.style,parseOjbArr);
    var item =getSpecificConstraint(cfg.constraintType.item,parseOjbArr);
    var setting =getSpecificConstraint(cfg.constraintType.setting,parseOjbArr);
    var menu =getSpecificConstraint(cfg.constraintType.menu,parseOjbArr);
    var menuItem =getSpecificConstraint(cfg.constraintType.menuItem,parseOjbArr);
    var share = getSpecificConstraint(cfg.constraintType.share,parseOjbArr);

    //for style
    if(style != null){
        cache.definitions.StyleConfig = style;
    }

    //for share
    if(share!= null){
        buildShareConstraint(share);
    }

    //for item constraint
    if(item!= null){
        cache.definitions.ItemConfig = item;
    }

    //for setting constraint
    if(setting!= null){
        cache.definitions.SettingConfig = setting;
    }

    //for menu constraint
    if(menu!= null){
        cache.definitions.MenuConfig = menu;
    }

    //for menu item constraint
    if(menuItem!= null){
        cache.definitions.MenuItem = menuItem;

        //for child menu constraint
        var childMenuItem = deepcopy(menuItem);
        delete childMenuItem.items.properties["menu"];
json
        cache.definitions.ChildMenuItem = childMenuItem;

    }
    //
    cache = refineJson(cache);
}



function getSpecificConstraint(constraintType, parseOjbArr){
    var constraint = null;
    for(var i=0;i<parseOjbArr.length;i++){

        var  itemData = parseOjbArr[i].toJSON();

        if(itemData.constraintType === constraintType){
            constraint =itemData;
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
        if(key != ""){
           return cache.definitions[key];
        }
        return cache;

    },
    initConstraint: function(){
        var query = new Parse.Query(cfg.collectionName);
        query.find().then(function(result){
            if(result){
                setConstraint(result);
            }

        }).catch(function(error){
            console.log("initConstraint",error);
        });
    }
}
