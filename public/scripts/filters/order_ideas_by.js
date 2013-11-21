/* global angular, _ */

angular.module('govote')
  .filter('orderIdeasBy', function() {
    'use strict';

    return function(input, attribute) {
      if (!_.isObject(input)) {
        return;
      }

      return _.toArray(input).sort(function(a, b) {
        var diff = b.votes - a.votes;
        if (diff !== 0) {
          return diff;
        }

        return a.timestamp - b.timestamp;
      });
    };
  });
