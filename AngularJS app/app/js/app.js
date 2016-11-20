var myApp = angular.module('ngclient', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

myApp.config(function($routeProvider, $httpProvider) {
 
  $httpProvider.interceptors.push('TokenInterceptor');
 
  $routeProvider
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false,
        requiredAdministrator: false
      }
    }).when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterCtrl',
      access: {
        requiredLogin: false,
        requiredAdministrator: false
      }
    }).when('/', {
      templateUrl: 'partials/home.html',
      controller: 'TripViewerCtrl',
      access: {
        requiredLogin: true,
        requiredAdministrator: false
      }
    }).when('/tripviewer', {
    templateUrl: 'partials/tripviewer.html',
    controller: 'TripViewerCtrl',
    access: {
      requiredLogin: true,
      requiredAdministrator: false
    }
  }).when('/tripcreator', {
      templateUrl: 'partials/tripcreator.html',
      controller: 'TripCreatorCtrl',
      access: {
        requiredLogin: true,
        requiredAdministrator: false
      }
    }).when('/venuePresentation', {
      templateUrl: 'partials/venuePresentation.html',
      controller: 'VenuePresentationCtrl',
      access: {
        requiredLogin: true,
        requiredAdministrator: false
      }
    }).when('/proposals', {
      templateUrl: 'partials/proposals.html',
      controller: 'ProposalsCtrl',
      access: {
        requiredLogin: true,
        requiredAdministrator: false
      }
    }).when('/scheduler', {
      templateUrl: 'partials/scheduler.html',
      controller: 'SchedulerCtrl',
      access: {
        requiredLogin: true,
        requiredAdministrator: false
      }
    }).when('/admin', {
    templateUrl: 'partials/admin.html',
    controller: 'AdminCtrl',
    access: {
      requiredLogin: true,
      requiredAdministrator: true
    }
  }).otherwise({
      redirectTo: '/login'
    });
});
 
myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
  // when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();
  $rootScope.showAdminPage = false;
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      if((nextRoute.access.requiredAdministrator) && !(AuthenticationFactory.userRole == 'admin')){
        $location.path('/');
      } else {
        // check if user object exists else fetch it. This is incase of a page refresh
        if (!AuthenticationFactory.user)
          AuthenticationFactory.user = $window.sessionStorage.user;
        if (!AuthenticationFactory.userRole)
          AuthenticationFactory.userRole = $window.sessionStorage.userRole;
      }

    }
  });
 
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    if(AuthenticationFactory.userRole == 'admin') $rootScope.showAdminPage = true;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});
