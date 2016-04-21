var config = require("./config.json");
var models = config["models"];
var validation = require("./validation.js");
var cfg = require("./constraint-type");

// for list model check from file config.json
models.forEach(function(model) {
  Parse.Cloud.beforeSave(model, function(req, res) {
    // create object put param validate
    var object={modelName:model,req:req,res:res};
    //validate menu
    if(model.indexOf("Menu")>=0){
      validation.validateMenu(object);
    //validate style
    }else if(model.indexOf("Style")>=0){
      validation.validateStyle(object);
    //validate setting
    }else if(model.indexOf("Setting")>=0){
       validation.validateSetting(object);
      // res.success();
    } else if(model.indexOf("Item")>=0){
      validation.validateItem(object);
      // res.success();
    } else{
      res.success();
    }
  });
});

var cacheConstraint = require("./constraint");
var constraint = require('./constraint-type');


Parse.Cloud.beforeSave(cfg.collectionName, function(req,res) {

  if(!req.object.get("constraintType")){
      res.error("constraintType is required");
      return;
  }

  if(!constraint.constraintType[req.object.get("constraintType")]){
      res.error("constraintType is invalid");
      return;
  }

  // check duplicate
  var query = new Parse.Query(cfg.collectionName);
  query.equalTo("constraintType", req.object.get("constraintType"));
  if(req.object.id){
      query.notEqualTo("objectId", req.object.id);
  }
  query.first().then(function(results){
    if(results){
        res.error("constraintType is duplicated");
    }else{
        res.success();
    }
  }).catch(function(error){
        res.error(error);
  });

});

Parse.Cloud.afterSave(cfg.collectionName, function(req) {

  // save history
  var query = new Parse.Query(cfg.collectionName);
  query.get(req.object.id, {

    success: function(objectDataBase) {

        if(objectDataBase){
            console.log("AfterSave: " + cfg.collectionName + "Ok");
            var parseObjArr = [objectDataBase];
            cacheConstraint.notifySaved(parseObjArr);
        }
    },

    error: function(object, error) {
      console.log("AfterSave: " + cfg.collectionName , error);
    }
  });

});

Parse.Cloud.define('getAllConstraints', function(req, res) {
  res.success(cacheConstraint.getConstraint(null));
});
