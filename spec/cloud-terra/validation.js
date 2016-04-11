var tv4 = require('tv4');
var constraints = require('./parse-server-constraints.json');

tv4.addSchema('#/definitions/PushBehavior', constraints.definitions.PushBehavior);
tv4.addSchema('#/definitions/Analytics', constraints.definitions.Analytics);
tv4.addSchema('#/definitions/Advertising', constraints.definitions.Advertising);
tv4.addSchema('#/definitions/BreakingNews', constraints.definitions.BreakingNews);
tv4.addSchema('#/definitions/Weather', constraints.definitions.Weather);
tv4.addSchema('#/definitions/Traffic', constraints.definitions.Traffic);
tv4.addSchema('#/definitions/Connect', constraints.definitions.Connect);
tv4.addSchema('#/definitions/Video', constraints.definitions.Video);
tv4.addSchema('#/definitions/StoreAccounts', constraints.definitions.StoreAccounts);

module.exports = {

  //validate menu
  validateMenu: function(object) {
    var result = {};
    // name of model
    var modelName = object.modelName;
    // request
    var req  = object.req;
    //response
    var res  = object.res;
    // model
    var model= req.object.toJSON();

    console.log("body after remove>>> " + JSON.stringify(model));
    result = tv4.validateMultiple(model, constraints.definitions.MenuConfig);

    console.log("valid menu ? " + result.valid);

    //check validate
    if (!result.valid) {
      res.error(result);
    } else {
      res.success();
    }
  },

  //validate style
  validateStyle: function(object) {
    console.log("validateStyle");
    var result = {};
    // name of model
    var modelName = object.modelName;
    // request
    var req  = object.req;
    //response
    var res  = object.res;
    // model
    var model= req.object.toJSON();
    model = removeEmptyFields(model);

    result = tv4.validateMultiple(model, constraints.definitions.StyleConfig, true);
    //check validate
    if (!result.valid) {
      var endResult = customizeResult(result.errors);
      res.error(result.errors);
    } else {
      res.success();
    }
  },

  //validate setting
  validateSetting: function(object) {
    console.log(">>>>>>validateSetting");
    var result = {};
    // name of model
    var modelName = object.modelName;
    // request
    var req  = object.req;
    //response
    var res  = object.res;
    // model
    var model= req.object.toJSON();
    model = removeEmptyFields(model);

    result = tv4.validateMultiple(model, constraints.definitions.SettingConfig);
    //check validate
    if (!result.valid) {
      var endResult = customizeResult(result.errors);
      res.error(endResult);
    } else {
      res.success();
    }
  },

  //validate setting
  validateItem: function(object) {
    console.log("validateItem");
    var result = {};
    // name of model
    var modelName = object.modelName;
    // request
    var req  = object.req;
    //response
    var res  = object.res;
    // model
    var model = req.object.toJSON();

    result = tv4.validateMultiple(model, constraints.definitions.ItemConfig);
    //check validate
    if (!result.valid) {
      var endResult = customizeResult(result.errors);
      res.error(endResult);
    } else {
      res.success();
    }
  }
};

function customizeResult(jsonError) {
  for (var i = 0; i < jsonError.length; i ++) {
    var dataPath = jsonError[i]["dataPath"];
    dataPath = dataPath.substring(1, dataPath.length).replace(/[/]/g, '.');
    jsonError[i]["dataPath"] = dataPath;
    delete jsonError[i]["params"];
    delete jsonError[i]["schemaPath"];
    delete jsonError[i]["subErrors"];
    delete jsonError[i]["stack"];
  }
  return jsonError;
}

function groupingItemConfigErrors(jsonError) {
  var setting = [];
  var theme = [];
  for (var i = 0; i < jsonError.length; i ++) {
    var error = {};
    var dataPath = jsonError[i]["dataPath"];
    console.log(">>>> " + dataPath);
    error['message'] = jsonError[i]["message"];
    error['dataPath'] = dataPath;
    if (dataPath.startsWith('setting')) {
      console.log("setting");
      setting.push[error];
      delete jsonError[i];
    } else if (dataPath.startsWith('theme')) {
      theme.push[error];
      delete jsonError[i];
    }
  }
  //
  jsonError.push(setting);
  jsonError.push(theme);

  return jsonError;
}

/**
  Remove null, empty fields
*/
function removeEmptyFields(json) {
  for (var att in json) {
    if (isEmpty(json[att])) {
      delete json[att];
    } else {
      var child = json[att];
      if (typeof(child) == 'object') {
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i ++) {
            removeEmptyFields(child[i]);
          }
        } else {
          removeEmptyFields(child);
        }
      }
    }
  }
  return json;
}

/**
  Check if a properties is empty or not
*/
function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.length == 0 ? true : false;
  }
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}
