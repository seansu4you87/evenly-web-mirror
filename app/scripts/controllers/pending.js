'use strict';

angular.module('evenlyApp')
  .controller('PendingCtrl', ['$scope', 'Me', 'Request', '$rootScope', 'GroupRequest', '$timeout', 'Restangular', function ($scope, Me, Request, $rootScope, GroupRequest, $timeout, Restangular) {
    $rootScope.getPending = function() {
      Me.pending()
        .then(function(pending) {
          pending = _.map(pending, function(request) {
            if (request.class === 'GroupCharge') {
              request.subject = request.to === 'me' ? 'You' : request.to;
              request.directObject = request.title;

              var record = _.find(request.records, function(record) {
                return record.user.id === $rootScope.me.id;
              });

              if (record) {
                var tier = _.find(request.tiers, function(tier) {
                  return tier.id === record.tier_id
                });

                if (tier) {
                  request.amount = tier.price;
                }
              }
            } else if (request.class === 'Charge' || request.class === 'SignUpCharge') {
              request.subject = request.to.name || 'You';
              request.directObject = request.description;
            }

            if (request.from === 'me') {
              request.type = 'coming';
              request.imageUrl = request.to.avatar_url || $rootScope.defaultProfilePic(request.to.id)
            } else {
              request.type = 'leaving';
              request.imageUrl = request.from.avatar_url || $rootScope.defaultProfilePic(request.from.id)
              $rootScope.actionable = true;
            }

            request.formattedDate = Date.parse(request.created_at);
            request.target = request.from.name || request.from;
            request.verb = request.to.name ? 'owes' : 'owe';
            if (request.amount) {
              request.amount = Number(request.amount).toFixed(2);
            }
            return request;
          });

          $rootScope.pending = pending;
        });
    }

    $scope.removeRequestFromPending = function(request) {
      var index = $scope.pending.indexOf(request);
      $scope.pending.splice(index, 1);
    };

    $scope.toastGenericFailure = function(response) {
      toastr.error(response.data, 'Error, please try again');
    };

    $scope.cancelButtonTitle = function () {
      return $scope.canceling ? "Canceling..." : "Cancel Request"
    };

    $scope.remindButtonTitle = function () {
      return $scope.reminding ? "Reminding..." : "Remind"
    };

    $scope.rejectButtonTitle = function () {
      return $scope.rejecting ? "Rejecting..." : "Reject Request"
    };

    $scope.payButtonTitle = function () {
      return $scope.paying ? "Paying..." : "Pay Request"
    };

    $scope.cancel = function(request) {
      if ($scope.canceling) { return; }
      if ($scope.reminding) { return; }

      $scope.canceling = true;
      Request.cancel(request.id)
        .then(function() {
          toastr.success('Canceled your $' + request.amount + ' Request to ' + request.to.name + ' for ' + request.description);
          $scope.removeRequestFromPending(request);
          $scope.close()
          $scope.canceling = false;
        }, function(response) {
          $scope.presentRequest(request);
          $scope.toastGenericFailure(response);
          $scope.canceling = false;
        });
    };

    $scope.remind = function(request) {
      if ($scope.canceling) { return; }
      if ($scope.reminding) { return; }

      $scope.reminding = true;
      Request.remind(request.id)
        .then(function() {
          toastr.success('Reminded ' + request.to.name + ' to pay you $' + request.amount + ' for ' + request.description);
          $scope.close();
          $scope.reminding = false;
        }, function(response) {
          $scope.presentRequest(request);
          $scope.toastGenericFailure(response);
          $scope.reminding = false;
        });
    };

    $scope.reject = function(request) {
      if ($scope.rejecting) { return; }
      if ($scope.paying) { return; }

      $scope.rejecting = true;
      Request.deny(request.id)
        .then(function() {
          toastr.success('Rejected ' + request.from.name + '\'s $' + request.amount + ' Request for ' + request.description);
          $scope.removeRequestFromPending(request);
          $scope.close();
          $scope.rejecting = false;
        }, function(response) {
          $scope.presentRequest(request);
          $scope.toastGenericFailure(response);
          $scope.rejecting = false;
        });
    };

    $scope.pay = function(request) {
      if ($scope.rejecting) { return; }
      if ($scope.paying) { return; }

      $scope.paying = true;
      Request.complete(request.id)
        .then(function() {
          toastr.success('Paid ' + request.from.name + '\'s $' + request.amount + ' Request for ' + request.description);
          $scope.removeRequestFromPending(request);
          $scope.close();
          $scope.paying = false;
        }, function(response) {
          $scope.presentRequest(request);
          $scope.toastGenericFailure(response);
          $scope.paying = false;
        });
    };

    $scope.rejectGroupRequest = function(groupRequest) {
      if ($scope.rejecting) { return; }
      if ($scope.paying) { return; }

      $scope.rejecting = true;

      var record = _.find(groupRequest.records, function(record) {
        return record.user.id === $rootScope.me.id;
      });

      GroupRequest.reject(groupRequest.id, record.id)
        .then(function() {
          toastr.success('Rejected ' + groupRequest.from.name + '\'s Request for ' + groupRequest.description);
          $scope.removeRequestFromPending(groupRequest);
          $scope.close();
          $scope.rejecting = false;
        }, function(response) {
          $scope.presentRequest(groupRequest);
          $scope.toastGenericFailure(response);
          $scope.rejecting = false;
        });
    };

    $scope.payGroupRequest = function(groupRequest) {
      if ($scope.rejecting) { return; }
      if ($scope.paying) { return; }

      $scope.paying = true;

      var record = _.find(groupRequest.records, function(record) {
        return record.user.id === $rootScope.me.id;
      });

      var tier = _.find(groupRequest.tiers, function(tier) {
        return tier.id === record.tier_id
      });

      GroupRequest.pay(groupRequest.id, record.id, tier.price)
        .then(function() {
          toastr.success('Paid ' + groupRequest.from.name + '\'s $' + tier.price + ' Request for ' + groupRequest.title)
          $scope.removeRequestFromPending(groupRequest);
          $scope.close();
          $scope.paying = false;
        }, function(response) {
          $scope.presentRequest(groupRequest);
          $scope.toastGenericFailure(response);
          $scope.paying = false;
        });
    };

    $scope.presentRequest = function(request) {
      console.log(request);
      $scope.modalOpen = true;
      $scope.currentRequest = request;
      if (request.class === 'GroupCharge') {
        if (request.to === 'me') {
          $scope.pendingReceivedGroupRequestModalShouldBeOpen = true;
        } else if (request.from === 'me') {
          $scope.pendingSentGroupRequestModalShouldBeOpen = true;
        }
      } else if (request.class === 'Charge' || request.class === 'SignUpCharge') {
        if (request.to === 'me') {
          $scope.pendingReceivedRequestModalShouldBeOpen = true;
        } else if (request.from === 'me') {
          $scope.pendingSentRequestModalShouldBeOpen = true;
        }
      }
    };

    $scope.close = function() {
      $timeout(function() {
        $scope.modalOpen = false;
      }, 100);

      $scope.pendingReceivedRequestModalShouldBeOpen = false;
      $scope.pendingSentRequestModalShouldBeOpen = false;
      $scope.pendingReceivedGroupRequestModalShouldBeOpen = false;
      $scope.pendingSentGroupRequestModalShouldBeOpen = false;
    }

    $scope.opts = {
      backdropFade: true,
      dialogFade: true
    }

    var hidePopover = function(e) {
      console.log('clicking html');
      if ($scope.popoverOpen && !$scope.modalOpen) {
        console.log('hiding popover');
        $('a[bs-popover="views/pending.html"]').popover('hide');
        $('html').unbind('click', hidePopover);
        $scope.popoverOpen = false;
      }
    };

    $scope.popoverOpen = false;
    $scope.clickedPendingButton = function() {
      $scope.popoverOpen = !$scope.popoverOpen;

      if ($scope.popoverOpen) {
        $timeout(function() {
          $('html').bind('click', hidePopover);
        }, 100);
      } else {
        $('html').unbind('click', hidePopover);
      }
    }

    $scope.getPending();
  }]);
