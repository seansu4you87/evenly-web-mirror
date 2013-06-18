'use strict';

Evenly.factory('Session', ['Restangular', '$rootScope', '$cookieStore', function(Restangular, $rootScope, $cookieStore) {
  return {
    create: function(email, password) {
      return Restangular
        .all('sessions')
        .post({email:email, password: password})
        .then(function(result) {
          console.debug('Session retrieved: ' + result.authentication_token);

          $cookieStore.put('vine_token', result.authentication_token);
          $rootScope.authenticationToken = result.authentication_token;
          return result;
        });
    },
    destroy: function() {
      return Restangular.one('sessions', '')
        .remove();
    }
  };
}]);

Evenly.factory('User', ['Restangular', function(Restangular) {
  return {
    create: function(params) {
      return Restangular.all('users')
        .post(params);
    },
    all: function(query) {
      return Restangular.all('users')
        .getList({query: query});
    },
    me: function() {
      return Restangular.one('me', '')
        .get();
    }
  };
}]);

Evenly.factory('Me', ['Restangular', '$rootScope', '$http', '$cookieStore', function(Restangular, $rootScope, $http, $cookieStore) {
  var base = Restangular.one('me', '');

  var authenticationToken = null;
  if ($cookieStore.get('vine_token') !== null) {
    authenticationToken = $cookieStore.get('vine_token');
  } else {
    authenticationToken = $rootScope.authenticationToken;
  }
  $http.defaults.headers.common['Authorization'] = authenticationToken;

  return {
    timeline: function(params) {
      return base
        .getList('timeline');
    },
    newsfeed: function(params) {
      return base
        .getList('newsfeed');
    },
    history: function(params) {
      return base
        .getList('history');
    }
  };
}]);

Evenly.factory('Payment', ['Restangular', function(Restangular) {
  return {
    create: function(params) {
      return Restangular.all('payments')
        .post(params);
    }
  };
}]);

Evenly.factory('Request', ['Restangular', function(Restangular) {
  return {
    create: function(params) {
      return Restangular.all('charges')
        .post(params);
    }
  };
}]);

Evenly.factory('Deposit', ['Restangular', function(Restangular) {
  return {
    create: function(params) {
      return Restangular.all('withdrawals')
        .post(params);
    }
  };
}]);

Evenly.factory('CreditCard', ['Restangular', function(Restangular) {
  return {
    all: function() {
      return Restangular.all('creditcards')
        .getList();
    },
    create: function(params) {
      return Restangular.all('creditcards')
        .post(params);
    },
    destroy: function(id) {
      return Restangular.one('creditcards', id)
        .remove();
    },
    activate: function(id) {
      return Restangular.one('creditcards', id)
        .customPUT('activate');
    }
  };
}]);

Evenly.factory('BankAccount', ['Restangular', function(Restangular) {
  return {
    all: function() {
      return Restangular.all('bankaccounts')
        .getList();
    },
    create: function(params) {
      return Restangular.all('bankaccounts')
        .post(params);
    },
    destroy: function(id) {
      return Restangular.one('bankaccounts', id)
        .remove();
    },
    activate: function(id) {
      return Restangular.one('bankaccounts', id)
        .customPUT('activate');
    }
  };
}]);