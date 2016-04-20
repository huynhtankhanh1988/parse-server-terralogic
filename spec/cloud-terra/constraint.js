var collection = require("./constraint-collections");
var defaultDefinition = require("./parse-server-constraints");
var definition = null;
function buildConstraint(json){

    var style = json.style;
    var item =json.item;
    var setting =json.setting;
    var menu =json.menu;
    var menuItem =json.menuItem;
    var share = json.share;

    if(style == null || item == null || setting == null || menu == null || menuItem == null || share == null){
        console.log("One of constraints have not been set in DB so, get default from file");
        definition = defaultDefinition;
    }

    //0 get style constraint

    //1 get item constraint

    //2 get setting constraint

    //3 get menu constraint

    //4 get menu item constraint
}
function getDataConstraint(collName){
    var query = new Parse.Query(collName);
    return query.first()
}

module.exports = {
    notifySaved: function(json){
    },
    getConstraint(json){
        if(definition != null){
            //return constraint definition
        }

        //0 get style constraint

        //1 get item constraint

        //2 get setting constraint

        //3 get menu constraint

        //4 get menu item constraint

    },
    initConstraint(json){
        var promises = [];
        //0 style constraint
        promises.push(getDataConstraint(collection.styleConstraint));

        //1 item constraint
        promises.push(getDataConstraint(collection.itemConstraint));

        //2 setting constraint
        promises.push(getDataConstraint(collection.settingConstraint));

        //3 get menu constraint
        promises.push(getDataConstraint(collection.menuConstraint));

        //4 get menu item constraint
        promises.push(getDataConstraint(collection.menuItemConstraint));

        //5 get share constraint
        promises.push(getDataConstraint(collection.shareConstraint));

        Promise.all(promises).then(function(results){
            var style = JSON.parse(results[0]);
            var item = JSON.parse(results[1]);
            var setting = JSON.parse(results[2]);
            var menu = JSON.parse(results[3]);
            var menuItem = JSON.parse(results[4]);
            var share = JSON.parse(results[5]);
            buildConstraint({
                style:      (style.results.length > 0 ? style.results[0]: null)
                ,item:      (item.results.length > 0 ? item.results[0]: null)
                ,setting:   (setting.results.length > 0 ? setting.results[0]: null)
                ,menu:      (menu.results.length > 0 ? menu.results[0]: null)
                ,menuItem:  (menuItem.results.length > 0 ? menuItem.results[0]: null)
                ,share:    (shared.results.length > 0 ? shared.results[0]: null)
            });
        }).catch(function(error){
            console.log("initConstraint",error);
        });
    }
}