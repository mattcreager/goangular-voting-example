/* global angular */

angular.module('govote')
  .factory('currentUser', function($goConnection, $goKey, $rootScope, $q) {
    'use strict';

    var deferred = $q.defer();

    $goConnection.$ready().then(function(connection) {
      var room = connection.room('lobby');
      var currentUser = $goKey(room.self().name).$sync();

      currentUser.$on('ready', function() {
        deferred.resolve(currentUser);

      }, deferred.reject);

    });

    return deferred.promise;
  });
