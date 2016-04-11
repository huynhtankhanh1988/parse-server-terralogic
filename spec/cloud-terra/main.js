var config=require("./config.json");
var models=config["models"];

var validation=require("./validation.js");

// Demo example cloud code event save and delete
//
// Parse.Cloud.beforeSave('enviroment_model', function(req, res) {
//   res.success();
// });
//
// Parse.Cloud.afterSave('enviroment_model', function(req) {
//   var obj = new Parse.Object('enviroment_model');
//   obj.set('proof', req.object.id);
//   obj.save();
// });
//
// Parse.Cloud.beforeDelete('enviroment_model', function(req, res) {
//   res.success();
// });
//
// Parse.Cloud.afterDelete('enviroment_model', function(req) {
//   var obj = new Parse.Object('enviroment_model');
//   obj.set('proof', req.object.id);
//   obj.save();
// });

// for list model check from file config.json
models.forEach(function(model) {
  Parse.Cloud.beforeSave(model, function(req, res) {
    console.log(">>>>>>> model >>> " + model);
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
