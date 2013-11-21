/* global angular, _ */

angular.module('govote')
  .factory('Idea', function(safeApply, $rootScope, $q, currentUser) {
    'use strict';

    function Idea(key, attributes) {
      _.bindAll(this);
      _.extend(this, {
        status: null,
        votes: 0,
        props: {
          votes: {},
          timestamp: new Date().getTime(),
        },
        collection: key,
        key: (!attributes.id ? null : key.key(attributes.id))
      });

      this.timestamp = ( attributes.timestamp || this.props.timestamp );
      this.set(_.clone(attributes));
      this.calcVotes();

      if (this.key) {
        this.watchVotes();
      }
    }

    Idea.prototype.watchVotes = function() {
      var self = this;

      self.key.key('votes').on('set', {
        bubble: true,
        listener: function(vote, context) {
          var voterId = _.last(context.key.split('/'));

          self.props.votes[voterId] = vote;
          self.calcVotes();
        }
      });
    };

    Idea.prototype.set = function(attribute, value) {
      var self = this;

      if (_.isObject(attribute)) {
        _.each(attribute, function(value, attribute) {
          self.set(attribute, value);
        });
      }

      this.props[attribute] = value;
    };

    Idea.prototype.getAttributes = function() {
      return _.clone(this.props);
    };

    Idea.prototype.save = function() {
      var self = this;
      var deferred = $q.defer();

      self.collection.add(self.getAttributes(), function(err, value, context) {
        if (err) {
          return safeApply($rootScope, function() {
            deferred.reject(err);
          });
        }

        self.id = _.last(context.addedKey.split('/'));
        self.props.id = self.id;
        self.key = self.collection.key(self.id);
        self.watchVotes();

        safeApply($rootScope, function() {
          deferred.resolve(self);
        });
      });

      return deferred.promise;
    };

    Idea.prototype.get = function(attribute) {
      return _.clone(this.props[attribute]);
    };

    Idea.prototype.calcVotes = function() {
      var self = this;

      var votes = _.reduce(self.props.votes, function(result, vote) {
          return result + vote;
      }, 0);

      safeApply($rootScope, function() {
        self.votes = parseFloat(votes);
      });

      currentUser.then(function(user) {
        var userId = user.get('id');
        var status;

        self.props.votes[userId] = self.props.votes[userId] || 0;

        if (self.props.votes[userId] === 0) {
          status = null;
        }

        if (self.props.votes[userId] === 1) {
          status = 'idea-upvoted';
        }

        if (self.props.votes[userId] === -1) {
          status = 'idea-downvoted';
        }

        safeApply($rootScope, function() {
          self.status = status;
        });
      });
    };

    Idea.prototype.upVote = function() {
      var self = this;
      var deferred = $q.defer();

      currentUser.then(function(user) {
        var userId = user.get('id');
        var vote = 1;

        if (self.props.votes[userId] && self.props.votes[userId]=== vote) {
          vote = 0;
        }

        self.key.key('votes/' + userId).set(vote, function(err) {
          if (err) {
            safeApply($rootScope, function() {
              deferred.reject(err);
            });
          }

          self.props.votes[userId] = vote;
          self.calcVotes();
        });
      });

      return deferred.promise;
    };

    Idea.prototype.downVote = function() {
      var self = this;
      var deferred = $q.defer();

      currentUser.then(function(user) {
        var userId = user.get('id');
        var vote = -1;

        if (self.props.votes[userId] && self.props.votes[userId] === vote) {
          vote = 0;
        }

        self.key.key('votes/' + userId).set(vote, function(err) {
          if (err) {
            safeApply($rootScope, function() {
              deferred.reject(err);
            });
          }

          self.props.votes[userId] = vote;
          self.calcVotes();
        });
      });

      return deferred.promise;
    };

    return Idea;
  });
