/* global angular */

'use strict';

angular.module('govote')
  .controller('IdeaListCtrl', function(ideas, $scope, namespace) {

    var instance = null;
    ideas.namespace(namespace).then(function(ideas) {
      instance = ideas;
      $scope.ideas = ideas.getIdeas();
    });
  });
