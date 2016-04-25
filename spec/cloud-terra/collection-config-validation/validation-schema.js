var propertiesItem=require("./item");
var propertiesMenuItem=require("./menu-item");
var propertiesMenu=require("./menu");
var propertiesSetting=require("./setting");
var propertiesShare=require("./share");
var propertiesStyle=require("./style");
var cfg = require("/spec/cloud-terra/constraint-type");

module.exports = {
  //validate Schema Item
  validateSchemaItem: function(obj) {
    validate(obj,cfg.constraintType.item, propertiesItem);
  },

  //validate Schema Menu Item
  validateSchemaMenuItem: function(obj) {
    validate(obj,cfg.constraintType.menuItem, propertiesMenuItem);
  },

  //validate Schema Menu
  validateSchemaMenu: function(obj) {
    validate(obj,cfg.constraintType.menu, propertiesMenu);
  },

  //validate schema setting
  validateSchemaSetting: function(obj) {
    validate(obj,cfg.constraintType.setting, propertiesSetting);
  },
  //validate schema setting
  validateSchemaShare: function(obj) {
    validate(obj,cfg.constraintType.share, propertiesShare);
  },
  //validate schema setting
  validateSchemaStyle: function(obj) {
    validate(obj,cfg.constraintType.style, propertiesStyle);
  }

};


//validate data public
function validate(obj,type, properties) {
  // properties check list
  var keyPropertiesCheck;
  var checkValidate=true;
  var model=obj.req.object.toJSON();
  if((type===cfg.constraintType.item||type===cfg.constraintType.menu || type === cfg.constraintType.setting || type === cfg.constraintType.style ) && model && model.properties){
      keyPropertiesCheck=Object.keys(model.properties);
  }else if(type===cfg.constraintType.menuItem && model && model.items && model.items.properties){
      keyPropertiesCheck=Object.keys(model.items.properties);
  }else if(type===cfg.constraintType.share && model){
      keyPropertiesCheck=Object.keys(model);
  }
  if(keyPropertiesCheck){
    keyPropertiesCheck.map(function(itemProperties) {
        if(!(properties.indexOf(itemProperties) > -1)){
          checkValidate=false;
        }
    });
  }
  if(checkValidate){
    obj.res.success();
  }else{
    obj.res.error("Schemal "+type+" invalid");
  }
};
