/* global angular */

angular
  .module('govote', ['ngRoute', 'angularMoment', 'goangular', 'angular-md5'])
  .constant('namespace', 'v2')
  .config(function ($routeProvider, $goConnectionProvider) {
    'use strict';

    $goConnectionProvider.$set('https://goinstant.net/cmac/goangular');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({ redirectTo: '/' });
  });
