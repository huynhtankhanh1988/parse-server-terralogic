

module.exports = {
  //validate Schema Item
  validateSchemaItem: function(obj) {
    var propertiesItem=require("./item");
    validate(obj,"Item", propertiesItem);
  },

  //validate Schema Menu Item
  validateSchemaMenuItem: function(obj) {
    var propertiesMenuItem=require("./menu-item");
    validate(obj,"MenuItem", propertiesMenuItem);
  },

  //validate Schema Menu
  validateSchemaMenu: function(obj) {
    var propertiesMenu=require("./menu");
    validate(obj,"Menu", propertiesMenu);
  },

  //validate schema setting
  validateSchemaSetting: function(obj) {
    var propertiesSetting=require("./setting");
    validate(obj,"Setting", propertiesSetting);
  },
  //validate schema setting
  validateSchemaShare: function(obj) {
    var propertiesShare=require("./share");
    validate(obj,"Share", propertiesShare);
  },
  //validate schema setting
  validateSchemaStyle: function(obj) {
    var propertiesStyle=require("./style");
    validate(obj,"Style", propertiesStyle);
  }

};

function validate(obj,type, properties) {
  var keyPropertiesCheck;
  var checkValidate=true;
  var model=obj.req.object.toJSON();
  if((type==="Item"||type==="Menu" || type === "Setting" || type === "Style" ) && model && model.properties){
      keyPropertiesCheck=Object.keys(model.properties);
  }
  if(type==="MenuItem" && model && model.items && model.items.properties){
      keyPropertiesCheck=Object.keys(model.items.properties);
  }
  if(type==="Share" && model){
      keyPropertiesCheck=Object.keys(model);
  }

  if(keyPropertiesCheck){
    keyPropertiesCheck.map(function(itemProperties) {
        if(!(properties.indexOf(itemProperties) > -1)){
          console.log("itemProperties");
          console.log(itemProperties);
          checkValidate=false;
        }
    });
  }
  if(checkValidate){
    obj.res.success();
  }else{
    obj.res.error("Schemal invalid");
  }
};
