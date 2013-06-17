'use strict';

angular.module('evenlyApp')
  .controller('HistoryCtrl', ['$scope', 'Me', function ($scope, Me) {
    Me.history()
      .then(function(history) {
        $scope.history = _.map(history, function(item) {
          if (item.class === "Withdrawal") {
            item.verb = "deposited into"
            item.subject = "You";
            item.object = item.bank_name;
            item.topic = "Deposit into " + item.bank_name;
          } else { // Payment or SignUpPayment
            item.verb = "paid";
            item.subject = (item.from !== "me") ? item.from.name : "You";
            item.object = (item.to !== "me") ? item.to.name : "You";
            item.topic = ((item.from === "me") ? item.to.name : item.from.name) + " · " + item.description;
          }

          item.formattedDate = Date.parse(item.created_at);
          item.amountClass = (item.subject === "You") ? "history-item-amount-sent" : "history-item-amount-received";
          
          var amountStringPrefix = (item.subject === "You") ? "+$" : "-$"
          item.amountString = amountStringPrefix + item.amount;

          return item;
        });

      });
  }]);