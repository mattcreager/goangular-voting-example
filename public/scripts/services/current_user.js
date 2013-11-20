/* global angular */

angular.module('govote')
  .factory('currentUser', function(goUsers, safeApply, $rootScope, $q) {
    'use strict';

    var deferred = $q.defer();

    goUsers.room('lobby').initialize().then(function(goUsers) {
      var currentUser = goUsers.getSelf();

      safeApply($rootScope, function() {
        deferred.resolve(currentUser);
      });
    }, deferred.reject);

    return deferred.promise;
  });
