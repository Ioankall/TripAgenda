/* Log in controller. In this part we manage the log in function of the website. We get the username
and the password that the user has typed in the UI, we validate them through the login function of the
UserAuthFactory, and if the credentials are right the user will be logged in and the session id along with
his role and his username are being kept to the session storage.
 */

myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
    
 
    $scope.login = function() {
 
      var username = $scope.user.username, password = $scope.user.password;
	 
      if (username !== undefined && password !== undefined) {
        UserAuthFactory.login(username, password).success(function(data) {
		  
          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data.user[0].username;
          AuthenticationFactory.userRole = data.user[0].role;
 
          $window.sessionStorage.token = data.token;
          $window.sessionStorage.user = data.user[0].username; // to fetch the user details on refresh
          $window.sessionStorage.userRole = data.user[0].role; // to fetch the user details on refresh

          $location.path("/");
		  
        }).error(function(status) {
          $scope.errorMessage = "Invalid credentials";
        });
      } else {
        alert('Invalid credentials');
      }
 
    };
 
  }
]);

/* In this part of the website we have the register controller. We take the data that user typed in the UI and
through a function in the User Auth Factory we register and log in the user.
*/

myApp.controller('RegisterCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
 
    $scope.register = function() {
	  
      var username = $scope.user.username, password = $scope.user.password, email = $scope.user.email, name = $scope.user.name, role = "user";
	 
      if (username !== undefined && password !== undefined && email !== undefined && name !== undefined) {
        
		UserAuthFactory.register(username, password, email, name, role).success(function(data) {
				if(data.error){
					$scope.errorMessage = data.message;
				}else{
					UserAuthFactory.login(data.user.username, data.user.password).success(function(data2) {

                        alert("Registration completed successfully! Please log in using your credentials!");
						AuthenticationFactory.isLogged = false;
						AuthenticationFactory.user = data2.user.username;
						AuthenticationFactory.userRole = data2.user.role;


						$window.sessionStorage.token = data2.token;
						$window.sessionStorage.user = data2.user.username; // to fetch the user details on refresh
						$window.sessionStorage.userRole = data2.user.role; // to fetch the user details on refresh
 
						$location.path("/");
		  
					}).error(function(status) {
						$scope.errorMessage = "Invalid credentials";
					});
				}
				
			}).error(function(status) {
				$scope.errorMessage = 'An error occured.';
			});
		} else {
			$scope.errorMessage = 'An error occured.';
		}
 
    };
 
  }
]);