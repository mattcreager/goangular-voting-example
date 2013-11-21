/* global angular, _ */

angular.module('govote')
  .filter('orderIdeasBy', function() {
    'use strict';

    return function(input, attribute) {
      if (!_.isObject(input)) {
        return;
      }

      return _.sortBy(input, ['votes', 'timestamp']).reverse();
    };
  });
