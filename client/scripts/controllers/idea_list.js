/* global angular */

'use strict';

angular.module('govote')
  .controller('IdeaListCtrl', function(ideas, $scope, safeApply, namespace) {

    ideas.namespace(namespace).then(function(ideas) {
      $scope.ideas = ideas.getAll();
    });

    $scope.$on('ideas:add', function(context, ideas) {
      safeApply($scope, function() {
        $scope.ideas = ideas;
      });
    });

  });

    // $scope.brainstormName = 'Whats your favorite social network!?';
    // $scope.ideaTitle = '';
    // $scope.ideaDesc = '';
    // $scope.ideas = [];
    // $scope.user = {};
