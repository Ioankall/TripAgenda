var myApp = angular.module('ngclient', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

myApp.config(function($routeProvider, $httpProvider) {
 
  $httpProvider.interceptors.push('TokenInterceptor');
 
  $routeProvider
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false
      }
    }).when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterCtrl',
      access: {
        requiredLogin: false
      }
    }).when('/', {
      templateUrl: 'partials/home.html',
      controller: 'TripViewerCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/tripviewer', {
    templateUrl: 'partials/tripviewer.html',
    controller: 'TripViewerCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/tripcreator', {
      templateUrl: 'partials/tripcreator.html',
      controller: 'TripCreatorCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/venuePresentation', {
      templateUrl: 'partials/venuePresentation.html',
      controller: 'VenuePresentationCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/proposals', {
      templateUrl: 'partials/proposals.html',
      controller: 'ProposalsCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/scheduler', {
      templateUrl: 'partials/scheduler.html',
      controller: 'SchedulerCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/page3', {
      templateUrl: 'partials/page3.html',
      controller: 'Page3Ctrl',
      access: {
        requiredLogin: true
      }
    }).otherwise({
      redirectTo: '/login'
    });
});
 
myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
  // when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();
 
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });
 
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});
