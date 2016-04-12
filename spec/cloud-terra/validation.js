var tv4 = require('tv4');
var constraints = require('./parse-server-constraints.json');

tv4.addSchema('#/definitions/PremiumFeeds', constraints.definitions.PremiumFeeds);
tv4.addSchema('#/definitions/Search', constraints.definitions.Search);
tv4.addSchema('#/definitions/PushBehavior', constraints.definitions.PushBehavior);
tv4.addSchema('#/definitions/Analytics', constraints.definitions.Analytics);
tv4.addSchema('#/definitions/Advertising', constraints.definitions.Advertising);
tv4.addSchema('#/definitions/BreakingNews', constraints.definitions.BreakingNews);
tv4.addSchema('#/definitions/Weather', constraints.definitions.Weather);
tv4.addSchema('#/definitions/Traffic', constraints.definitions.Traffic);
tv4.addSchema('#/definitions/Connect', constraints.definitions.Connect);
tv4.addSchema('#/definitions/Video', constraints.definitions.Video);
tv4.addSchema('#/definitions/StoreAccounts', constraints.definitions.StoreAccounts);
tv4.addSchema('#/definitions/Channel', constraints.definitions.Channel);

tv4.addSchema('#/definitions/MenuItem', constraints.definitions.MenuItem);
tv4.addSchema('#/definitions/ChildMenuItem', constraints.definitions.ChildMenuItem);

/**
  Checking field data with date time format
*/
tv4.addFormat('date-time', function (data, schema) {
    if (!data) {
      return null;
    }
    var check = new Date(data);
    valid = !isNaN(check.valueOf());

    if (!valid) {
      return "Invalid date";
    } else {
      return null;
    }
});

module.exports = {
  //validate menu
  validateMenu: function(object) {
    console.log(">>>>>validateMenu");
    validate(object, constraints.definitions.MenuConfig);
  },

  //validate style
  validateStyle: function(object) {
    console.log(">>>>>validateStyle");
    validate(object, constraints.definitions.StyleConfig);
  },

  //validate setting
  validateSetting: function(object) {
    console.log(">>>>>validateSetting");
    validate(object, constraints.definitions.SettingConfig);
  },

  //validate setting
  validateItem: function(object) {
    console.log(">>>>>validateItemConfig");
    validate(object, constraints.definitions.ItemConfig);
  }
};

function validate(object, constraints) {
  var result = {};
  // model
  var model = object.req.object.toJSON();
  model = removeEmptyFields(model);

  result = tv4.validateMultiple(model, constraints);
  console.log("valid: " + result.valid);
  //check validate
  if (!result.valid) {
    var endResult = customizeErrors(result.errors);
      console.log("Errors: " + JSON.stringify(endResult));
    object.res.error(endResult);
  } else {
    object.res.success();
  }

}

function customizeErrors(jsonError) {
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
  if (typeof(obj) === 'boolean') {
    return false;
  }

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
