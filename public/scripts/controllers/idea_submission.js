/* global angular */

'use strict';

angular.module('govote')
  .controller('IdeaSubmissionCtrl', function(ideas, $scope, namespace) {

    ideas.namespace(namespace).then(function(ideas) {
      $scope.addIdea = function () {
        var attributes = {
          title: $scope.ideaTitle,
          desc: $scope.ideaDesc
        };

        ideas.create(attributes).then(clearAddIdeaForm);
      };

      function clearAddIdeaForm() {
        $scope.ideaTitle = '';
        $scope.ideaDesc = '';
      }
    });

    // $scope.brainstormName = 'Whats your favorite social network!?';
    // $scope.ideaTitle = '';
    // $scope.ideaDesc = '';
    // $scope.ideas = [];
    // $scope.user = {};
  });
