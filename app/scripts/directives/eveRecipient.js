'use strict';

angular.module('evenlyApp')
  .directive('eveRecipient', ['User','$http', function (User, $http) {
    return {
      templateUrl: 'views/recipient.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.getUsers = function(query) {
          console.debug("querying " + query);

          return User.all(query)
            .then(function(users) {
              return _.map(users, function(u){ 
                return {
                  name: u.name,
                  email: u.email
                }; 
              });
            });
        }

        scope.onSelect = function($item, $model, $label) {
          console.log($item);
          console.log($model);
          console.log($label);
        }

      }
    };
  }]);