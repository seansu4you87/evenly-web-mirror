'use strict';

angular.module('evenlyApp')
  .controller('SignupCtrl', ['$scope', '$location', 'User', '$FB', '$timeout', '$rootScope', function ($scope, $location, User, $FB, $timeout, $rootScope) {
    $scope.signup = function() {
      if (!$scope.submitting) {
        $scope.submitting = true;

        User.create({
          name: $scope.name,
          email: $scope.email,
          phone_number: $scope.phoneNumber,
          password: $scope.password,
          password_confirmation: $scope.password,
          facebook_token: $rootScope.fbToken
        }).then(function(user) {
          console.log("created user " + user.name);
          $scope.submitting = false;
        }, function(response) {
          console.log(response);
          $scope.submitting = false;
          if (response.data.error) {
            $scope.serverErrors = [response.data.error];
          } else {
            $scope.serverErrors = response.data.errors;
          }
        });
      }
    };

    $scope.serverErrors = [];

    $scope.$watch('submitting', function(value) {
      $scope.buttonTitle = value ? 'Signing Up...' : 'Sign Up';
    });

    console.log("in SignupCtrl");
    $timeout(function() {
      console.log("loading /me");
      $FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.email = response.email;
        $scope.$apply();
        console.log('loaded /me');
        console.log(response);
      });
    }, 1000);

    $scope.$watch(function() {
      return $FB.isAuthenticated();
    }, function(value) {
      console.log("FB.isAuthenticated() ? " + value);
    })
  }]);
