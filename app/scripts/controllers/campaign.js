'use strict';

angular.module('evenlyApp')
  .controller('CampaignCtrl', ['$scope', function ($scope) {
    $scope.welcomeTextForCampaign = function(campaignCode) {
      var map = {
        'unc': 'Welcome Tar Heels!',
        'fsu': 'Welcome Noles!'
      };
      return map[campaignCode];
    };
  }]);
