/* global angular, _ */

angular.module('govote')
  .factory('Idea', function($rootScope, $q, currentUser) {
    'use strict';

    function Idea(model, id) {
      _.bindAll(this);
      this.id = id;
      this.status = null;
      this.model = model;
      this.localId = null;

      var self = this;

      model.$sync();
      currentUser.then(function(user) {
        self.localId = user.id;

        model.$on('ready', function() {
          self.watchVoters();
          self.calcVotes();

          self.setStatus();
        });
      });
    }

    Idea.prototype.watchVoters = function() {
      var self = this;

      var opts = {
        local: true,
        bubble: true,
        listener: function(val, context) {
          self.model.voters = self.model.voters || {};
          self.model.voters[context.userId] = val;

          self.calcVotes();
        }
      };

      this.model.$key('voters').$on('set', opts);
    };

    Idea.prototype.setStatus = function(vote) {
      if (_.isUndefined(vote)) {
        if (this.model.voters) {
          vote = this.model.voters[this.localId];
        }
      }

      var self = this;

      switch(vote) {
        case 1:
          self.status = 'idea-upvoted';
          break;
        case -1:
          self.status = 'idea-downvoted';
          break;
        default:
          self.status = null;
      }
    };

    Idea.prototype.calcVotes = function() {
      var votes = _.reduce(this.model.voters, function(result, vote) {
          return result + vote;
      }, 0);

      this.model.$key('votes').$set(parseFloat(votes));

      if (!this.model.voters) {
        return;
      }
    };

    Idea.prototype.upVote = function() {
      var self = this;
      var deferred = $q.defer();

      currentUser.then(function(user) {
        var userId = user.id;
        var vote = 1;

        if (self.model.voters &&
            self.model.voters[userId] &&
            self.model.voters[userId] === vote) {
              vote = 0;
        }

        self.model.$key('voters').$key(userId).$set(vote).then(function() {
          self.setStatus(vote);

        }).catch(function(err) {
          deferred.reject(err);
        });
      });

      return deferred.promise;
    };

    Idea.prototype.downVote = function() {
      var self = this;
      var deferred = $q.defer();

      currentUser.then(function(user) {
        var userId = user.id;
        var vote = -1;

        if (self.model.voters &&
            self.model.voters[userId] &&
            self.model.voters[userId] === vote) {
              vote = 0;
        }

        self.model.$key('voters').$key(userId).$set(vote).then(function() {
          self.setStatus(vote);

        }).catch(function(err) {
          deferred.reject(err);
        });
      });

      return deferred.promise;
    };

    return Idea;
  });
