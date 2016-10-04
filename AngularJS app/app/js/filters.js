myApp.filter('checkmark', function() {
  /** https://docs.angularjs.org/guide/filter **/

  var filterFunction = function(input) {
    return input ? '\u2713' : '\u2718';
  };

  return filterFunction;
});

myApp.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});