myApp.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory',
  function($scope, $location, UserAuthFactory) {
 
    $scope.isActive = function(route) {
      return route === $location.path();
    }
 
    $scope.logout = function () {
      UserAuthFactory.logout();
    }
  }
]);

myApp.controller("LoginCtrl", ['$scope', '$window',
  function($scope, $window) {
	$scope.name = "Log in Controller";
    $scope.errorMessage = "";
	  if($window.sessionStorage.user == ""){
		  $scope.isLoggedIn = false;
	  }else{
		  $scope.isLoggedIn = false;
	  }
  }
]);

myApp.controller("RegisterCtrl", ['$scope', 
  function($scope) {
	$scope.name = "Register Controller";
  }
]);
 
myApp.controller("TripViewerCtrl", ['$scope', '$http', '$window', 'tripViewer',
  function($scope, $http, $window, tripViewer) {
      $scope.name = "Trip Viewer Controller";

      $scope.selectedTrip = 'aa';

      $scope.refresh = function(){
          $http.get('http://snf-703110.vm.okeanos.grnet.gr:3000/api/v1/trips/' + $window.sessionStorage.user)
            .then(function(response) {
                $scope.trips = response.data.trips;
                tripViewer.setTrips($scope.trips);
                tripViewer.setSelectedTrip(false);
            });

      };

      $scope.numOfTrip = 0;

      $scope.view = function(id){

          for (i = 0; i < $scope.trips.length; i++) {
              if($scope.trips[i]['_id'] == id){
                  tripViewer.setSelectedTrip($scope.trips[i]);
                  break;
              }
          }

          $window.location.href = './#/tripviewer';

      };

      $scope.getTrip = function(){
          $scope.selectedTrip = tripViewer.getSelectedTrip();

          if( $scope.selectedTrip == false || $scope.selectedTrip == undefined){
              $window.location.href = './#/';
          }

          $scope.selectedVenues = [];
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Religion and Organizations']);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Museums']);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Nightlife']);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Public places']);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues["Shopping"]);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues["Food & drink"]);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Transportation & Accomondation']);
          $scope.selectedVenues = $scope.selectedVenues.concat($scope.selectedTrip.selectedVenues['Arts & Entertainment']);
          console.log($scope.selectedVenues);


          $scope.scheduledActivities = [];
          $scope.scheduledActivities = $scope.selectedTrip.scheduledActivities;
      };

      $scope.activitySelected = false;
      $scope.venueSelected = false;

      $scope.selectedActivity = null;
      $scope.selectedVenue = null;

      $scope.selectActivity = function(id){
          $scope.activitySelected = true;
          $scope.venueSelected = false;

          for(i=0; i<$scope.scheduledActivities.length; i++){
              if($scope.scheduledActivities[i]['_id'] == id){
                  $scope.selectedActivity = $scope.scheduledActivities[i];
                  break;
              }
          }

          slides.length = $scope.slides.length = 0;
          currIndex = 0;
          $scope.active = 0;

          for(i=0; i<$scope.selectedActivity.venue["photos"].length; i++){
              $scope.addSlide($scope.selectedActivity.venue["photos"][i]);
          }

          var day = $scope.selectedActivity.activityDay.substring(3);
          if(day == "1"){
              $scope.dayOfActivity = " " + day + "st day";
          }else if (day == "2"){
              $scope.dayOfActivity = " " + day + "nd day";
          }else if (day == "3"){
              $scope.dayOfActivity = " " + day + "rd day";
          }else{
              $scope.dayOfActivity = " " + day + "th day";
          }

          $scope.timeOfActivity = " " + $scope.selectedActivity.activityStartingTime + ":00 - " + $scope.selectedActivity.activityEndingTime + ":00";
      };

      $scope.selectVenue = function(id){
          $scope.venueSelected = true;
          $scope.activitySelected = false;

          for(i=0; i<$scope.selectedVenues.length; i++){
              if($scope.selectedVenues[i]['_id'] == id){
                  $scope.selectedVenue = $scope.selectedVenues[i];
                  break;
              }
          }


          slides.length = $scope.slides.length = 0;
          currIndex = 0;
          $scope.active = 0;

          for(i=0; i<$scope.selectedVenue["photos"].length; i++){
              $scope.addSlide($scope.selectedVenue["photos"][i]);
          }
      };

      //photos

      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;
      var slides = $scope.slides = [];
      var currIndex = 0;
      $scope.active = 0;

      $scope.addSlide = function(imageLink) {
          slides.push({
              image: imageLink,
              id: currIndex++
          });
      };




     
  }
]);

myApp.controller("TripCreatorCtrl", ['$scope', '$window', '$timeout', '$q', '$log', 'supportedCities', 'tripCreator',
  function($scope, $window, $timeout, $q, $log, supportedCities, tripCreator) {

      $scope.name = "Trip Creator Controller";

      $scope.isLoading = false;


      if($window.currentTrip == undefined){

          // Access the factory and get the latest cities list
          // Prepare the md-autocomplete element
          supportedCities.getCities().then(function(data) {
              $scope.cities = [];
              $scope.cities = data.data.cities;
              $scope.citiesInString = $scope.cities[0].city;
              for(k=1; k<$scope.cities.length; k++){
                  $scope.citiesInString += ", ";
                  $scope.citiesInString += $scope.cities[k].city;
              }
              $scope.states= loadAll();
              $scope.querySearch   = querySearch;
              $scope.selectedItemChange = selectedItemChange;
              $scope.searchTextChange   = searchTextChange;
              $scope.newState = newState;
              function newState(state) {
                  alert("Sorry! This city is not supported, yet! We will include it to our database soon.");
              }
              $scope.isDisabled = false;
          });


          // Preparing the md-autocomplete element (internal functions)

          $scope.simulateQuery = false;
          $scope.isDisabled    = true;
          var querySearch = function(query) {
              return query ? $scope.states.filter( createFilterFor(query) ) : $scope.states;
          };
          function searchTextChange(text) {
              $log.info('Text changed to ' + text);
          }
          function selectedItemChange(item) {
              $log.info('Item changed to ' + JSON.stringify(item));
          }
          var loadAll = function() {
              var allStates = $scope.citiesInString;

              return allStates.split(/, +/g).map( function (state) {
                  return {
                      value: state.toLowerCase(),
                      display: state
                  };
                  $log.info(allStates);
              });
          };
          function createFilterFor(query) {

              var lowercaseQuery = angular.lowercase(query);

              return function filterFn(state) {
                  return (state.value.indexOf(lowercaseQuery) === 0);
              };

          }

          //Creating datepicker elements

          $scope.inlineOptions = {
              customClass: getDayClass,
              minDate: new Date(),
              showWeeks: true
          };

          $scope.dateOptions = {
              dateDisabled: false,
              formatYear: 'yy',
              maxDate: new Date(2020, 5, 22),
              minDate: new Date(),
              startingDay: 1
          };

          $scope.inlineOptions2 = {
              customClass: getDayClass,
              minDate: $scope.dt == null ? new Date() :  $scope.dt,
              showWeeks: true
          };

          $scope.dateOptions2 = {
              dateDisabled: false,
              formatYear: 'yy',
              maxDate: new Date(2020, 5, 22),
              minDate: $scope.dt == null ? new Date() :  $scope.dt,
              startingDay: 1
          };

          // Disable weekend selection
          function disabled(data) {
              var date = data.date,
                  mode = data.mode;
              return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          }

          $scope.open1 = function() {
              $scope.popup1.opened = true;
          };

          $scope.open2 = function() {
              $scope.popup2.opened = true;

              $scope.inlineOptions2 = {
                  customClass: getDayClass,
                  minDate: $scope.dt == null ? new Date() :  $scope.dt,
                  showWeeks: true
              };

              $scope.dateOptions2 = {
                  dateDisabled: false,
                  formatYear: 'yy',
                  maxDate: new Date(2020, 5, 22),
                  minDate: $scope.dt == null ? new Date() :  $scope.dt,
                  startingDay: 1
              };
          };


          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];
          $scope.altInputFormats = ['M!/d!/yyyy'];


          $scope.popup1 = {
              opened: false
          };

          $scope.popup2 = {
              opened: false
          };

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 1);
          $scope.events = [
              {
                  date: tomorrow,
                  status: 'full'
              },
              {
                  date: afterTomorrow,
                  status: 'partially'
              }
          ];

          function getDayClass(data) {
              var date = data.date,
                  mode = data.mode;
              if (mode === 'day') {
                  var dayToCheck = new Date(date).setHours(0,0,0,0);

                  for (var i = 0; i < $scope.events.length; i++) {
                      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                      if (dayToCheck === currentDay) {
                          return $scope.events[i].status;
                      }
                  }
              }

              return '';
          }

          var validateDates = function(day, month, year){
              $log.info(day + " - " + month + " - " + year);
              if(year == null || year < 2016 || year > 2116){
                  return false
              }else{
                  if(month == null || month<1 || month>12){
                      return false;
                  }else{
                      var maxDays = 0;
                      if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
                          maxDays = 31;
                      }else if(month == 4 || month == 6 || month == 9 || month == 11){
                          maxDays = 30;
                      }else{
                          maxDays = 28;

                          if( year%4==0 && (year%100!=0 || year%400==0))
                              maxDays++;
                      }

                      if(day == null || day<1 || day>maxDays){
                          return false;
                      }else{
                          return true;
                      }
                  }
              }
          };

          var toDateFormat = function(day, month, year){
              return day+"/"+month+"/"+year;
          };

          // Preparing categories list
          $scope.artsAndEntertainment=false;
          $scope.museums=false;
          $scope.nightlife=false;
          $scope.foodAndDrink=false;
          $scope.publicPlaces=false;
          $scope.shopping=false;
          $scope.transportationAndAccomondation=false;
          $scope.religionAndOrganizations=false;


          // On submit function

          $scope.create = function(){
              if($scope.selectedItem == null){
                  alert("Please select a city and try again.");
              }else if(!($scope.artsAndEntertainment || $scope.museums || $scope.nightlife || $scope.publicPlaces || $scope.shopping || $scope.foodAndDrink || $scope.transportationAndAccomondation || $scope.religionAndOrganizations)){
                  alert("Please select a few interesting categories and try again.");
              }else if($scope.dt == undefined || $scope.dt2 == undefined){
                  alert("Your trip dates are not valid. Please try again.");
              }else if(($scope.dt2 - $scope.dt)/(3600000 * 24) > 30){
                  alert("Trip duration should not exceed a 30-days period");
              }else if( ($scope.dt2 - $scope.dt) < 0){
                  alert("Your trip dates are not valid. Please try again.");
              }else{
                  $scope.isLoading = true;
                  tripCreator.setCity($scope.selectedItem.display);
                  var categories = {
                      "artsAndEntertainment": $scope.artsAndEntertainment,
                      "museums": $scope.museums,
                      "nightlife": $scope.nightlife,
                      "publicPlaces": $scope.publicPlaces,
                      "shopping": $scope.shopping,
                      "foodAndDrink": $scope.foodAndDrink,
                      "transportationAndAccomondation": $scope.transportationAndAccomondation,
                      "religionAndOrganizations": $scope.religionAndOrganizations
                  };
                  tripCreator.setCategories(categories);
                  var startDate = toDateFormat($scope.dt.getDate(), $scope.dt.getMonth()+1, $scope.dt.getYear() + 1900);
                  var endDate = toDateFormat($scope.dt2.getDate(), $scope.dt2.getMonth()+1, $scope.dt2.getYear() + 1900);
                  var dates = {
                      "startDate": startDate,
                      "endDate": endDate
                  };
                  tripCreator.setDates(dates);
                  $window.currentTrip = {
                      tripDates: dates,
                      tripCategories: categories,
                      tripDestination: $scope.selectedItem.display,
                      selectedVenues: []
                  };
                  tripCreator.downloadVenuesAndProceed($window);
              }

          };


      } else{
          if($window.currentTrip.tripDates != undefined && $window.currentTrip.tripDestination != undefined && $window.currentTrip.tripCategories != undefined){

              $scope.isLoading = true;

              tripCreator.setCity($window.currentTrip.tripDestination);
              tripCreator.setDates($window.currentTrip.tripDates);
              tripCreator.setCategories($window.currentTrip.tripCategories);

              tripCreator.downloadVenuesAndProceed($window);
          }
      }

	
  }
]);

myApp.controller("VenuePresentationCtrl", ['$scope', '$window', 'supportedCities', 'tripCreator',
  function($scope, $window, supportedCities, tripCreator) {
      
      $scope.deleteCurrentTrip = function(){
          delete $window.currentTrip;

          $window.location.href = './';
      };
      
    $scope.name = "Venue Presentation Controller";

    $scope.selectedCity = tripCreator.getCity();

      //Receiving venues
      var allVenues =
      {
          "artsAndEntertainment" : tripCreator.getVenuesOfCategory("Arts & Entertainment"),
          "museums" : tripCreator.getVenuesOfCategory("Museums"),
          "nightlife" : tripCreator.getVenuesOfCategory("Nightlife"),
          "publicPlaces" : tripCreator.getVenuesOfCategory("Public places"),
          "shopping" : tripCreator.getVenuesOfCategory("Shopping"),
          "foodAndDrink" : tripCreator.getVenuesOfCategory("Food & drink"),
          "transportationAndAccomondation" : tripCreator.getVenuesOfCategory("Transportation & Accomondation"),
          "religionAndOrganizations" : tripCreator.getVenuesOfCategory("Religion and Organizations")
      };


    if($window.currentTrip == undefined){

        //Selected venues
        $scope.listOfSelectedVenues = [];

    }else{

       if($window.currentTrip.selectedVenues != undefined && $scope.listOfSelectedVenues == undefined ){
           $scope.listOfSelectedVenues = $window.currentTrip.selectedVenues;
           
       }
    }


      $scope.addToList = function(venue){
          for(i=0; i<$scope.listOfSelectedVenues.length;i++){
              if($scope.listOfSelectedVenues[i]['_id'] == venue['_id']){
                  return false;
              }
          }
          $scope.remove(venue);
          $scope.listOfSelectedVenues.push(venue);
          $window.currentTrip.selectedVenues = $scope.listOfSelectedVenues;
          console.log($window.currentTrip.selectedVenues);
      };

      $scope.removeFromList = function(venue){
          for(i=0; i<$window.currentTrip.selectedVenues.length;i++){
              if($window.currentTrip.selectedVenues[i]['_id'] == venue['_id']){
                  $window.currentTrip.selectedVenues.splice(i, 1);
              }
          }
          for(i=0; i<$scope.listOfSelectedVenues.length;i++){
              if($scope.listOfSelectedVenues[i]['_id'] == venue['_id']){
                  $scope.listOfSelectedVenues.splice(i, 1);
                  $scope.displayVenues.push(venue);
                  return true;
              }
          }
      };



	
	//Photo carousel
    $scope.displayedVenue;
	
	$scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    $scope.addSlide = function(imageLink) {
      slides.push({
        image: imageLink,
        id: currIndex++
      });
    };
	
	
	//Getting categories
	var categories = tripCreator.getCategories();

      $scope.selectedCity = tripCreator.getCity();
	
	$scope.categoriesList = [];
	
	if(categories != undefined){
	if(categories.artsAndEntertainment == true){
		var toAdd = 
		{
			"displayName": 'Arts and Entertainment',
			"value": 'artsAndEntertainment'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.museums == true){
		var toAdd = 
		{
			"displayName": 'Museums',
			"value": 'museums'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.nightlife == true){
		var toAdd = 
		{
			"displayName": 'Nightlife',
			"value": 'nightlife'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.publicPlaces == true){
		var toAdd = 
		{
			"displayName": 'Public places',
			"value": 'publicPlaces'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.shopping == true){
		var toAdd = 
		{
			"displayName": 'Shopping',
			"value": 'shopping'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.foodAndDrink == true){
		var toAdd = 
		{
			"displayName": 'Food and Drink',
			"value": 'foodAndDrink'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.transportationAndAccomondation == true){
		var toAdd = 
		{
			"displayName": 'Transportation and Accomondation',
			"value": 'transportationAndAccomondation'
		};
		$scope.categoriesList.push(toAdd);
	}
	if(categories.religionAndOrganizations == true){
		var toAdd = 
		{
			"displayName": 'Religion and Organizations',
			"value": 'religionAndOrganizations'
		};
		$scope.categoriesList.push(toAdd);
	}
	}
	
	

	  
	
	//Displaying all venues of a category
	$scope.displayVenues = [];
	
	$scope.updateCategory = function(){
		$scope.displayVenues = allVenues[$scope.selectedCategory];	
		for(i=0; i<$scope.displayVenues.length; i++){
			if($scope.displayVenues[i].photos.length == 0){
				$scope.displayVenues[i].photos.push("../img/noImage.jpg");
			}
		}
	}

      $scope.remove = function(venue){
          for(i=0; i<$scope.displayVenues.length;i++){
              if($scope.displayVenues[i]['_id'] == venue['_id']){
                  $scope.displayVenues.splice(i, 1);
                  $scope.displayedVenue = null;
                  return true;
              }
          }
      }
	
	//Displaying full details of one venue
	$scope.showVenueDetails = function(id){		
		
		for(i=0; i<$scope.displayVenues.length; i++){
			if($scope.displayVenues[i]["_id"] == id){
				$scope.displayedVenue = $scope.displayVenues[i];
			}
		}
		
		slides.length = $scope.slides.length = 0;
		currIndex = 0;
        $scope.active = 0;
		
		for(i=0; i<$scope.displayedVenue.photos.length; i++){
			$scope.addSlide($scope.displayedVenue.photos[i]);
		}
	}
	
	$scope.proceed = function(){
		if($scope.listOfSelectedVenues.length > 0){
			tripCreator.setSelectedVenues($scope.listOfSelectedVenues);
			$window.location.href = './#/proposals';
		}else {
			alert("You have not selected any venues yet. Please select venues that you are interested in and then proceed.");
		}
	}
	
  }
  
]);


myApp.controller("ProposalsCtrl", ['$scope', '$window', 'tripCreator',
    function($scope, $window, tripCreator) {

        $scope.deleteCurrentTrip = function(){
            delete $window.currentTrip;

            $window.location.href = './';
        };

		$scope.displayedVenue;
		$scope.recommendedVenues = [];

        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function(imageLink) {
            slides.push({
                image: imageLink,
                id: currIndex++
            });
        };

		$scope.categoriesList = tripCreator.getCategoriesOfSelectedVenues();
		
		$scope.updateCategory = function(){
			$scope.recommendedVenues = tripCreator.getRecommendationsForCategory($scope.chosenCategory);
		}

        $scope.remove = function(venue){
            for(i=0; i<$scope.recommendedVenues.length;i++){
                if($scope.recommendedVenues[i][0]['_id'] == venue['_id']){
                    $scope.recommendedVenues.splice(i, 1);
                    $scope.displayedVenue = null;
                    return true;
                }
            }
        }

        //Selected venues
        $scope.listOfSelectedVenues = [];

        $scope.listOfSelectedVenues = tripCreator.getSelectedVenues();
        
        $scope.addToList = function(venue){
            for(i=0; i<$scope.listOfSelectedVenues.length;i++){
                if($scope.listOfSelectedVenues[i]['_id'] == venue['_id']){
                    return false;
                }
            }
            $scope.remove(venue);
            $scope.listOfSelectedVenues.push(venue);
        };

        $scope.removeFromList = function(venue){
            for(i=0; i<$scope.listOfSelectedVenues.length;i++){
                if($scope.listOfSelectedVenues[i]['_id'] == venue['_id']){
                    $scope.listOfSelectedVenues.splice(i, 1);
                    $scope.recommendedVenues.push(venue);
                    return true;
                }
            }
        };

		//Displaying full details of one venue
		$scope.showVenueDetails = function(id){

			for(i=0; i<$scope.recommendedVenues.length; i++){

                if($scope.recommendedVenues[i][0]["_id"] == id){
					$scope.displayedVenue = $scope.recommendedVenues[i][0];

				}
			}

			slides.length = $scope.slides.length = 0;
			currIndex = 0;
            $scope.active = 0;

			for(i=0; i<$scope.displayedVenue["photos"].length; i++){
				$scope.addSlide($scope.displayedVenue.photos[i]);
			}
		};

        $scope.proceed = function(){
            if($scope.listOfSelectedVenues.length > 0){
                tripCreator.setSelectedVenues($scope.listOfSelectedVenues);
                $window.location.href = './#/scheduler';
            }else {
                alert("You have not selected any venues yet. Please select venues that you are interested in and then proceed.");
            }
        }
		
    }
  
]);

myApp.controller("SchedulerCtrl", ['$scope', '$window', 'supportedCities', 'tripCreator',
    function($scope, $window, supportedCities, tripCreator) {
        $scope.name = "Scheduler Controller";

        $scope.deleteCurrentTrip = function(){
            delete $window.currentTrip;

            $window.location.href = './';
        };

        $scope.listOfDisplayedVenues = [];
        $scope.generalCategoriesList = [];
        $scope.subCategoriesList = [];

        //Dates
        $scope.dates = tripCreator.getDates();

        var startDate = $scope.dates.startDate;
        var endDate = $scope.dates.endDate;

        var numberOfDays = tripCreator.computeDateDiff(startDate, endDate);

        console.log(numberOfDays);

        $scope.schedule = [];
        for(d=1; d<=numberOfDays; d++){
            var day = ["Day " + d, "day"+d];
            $scope.schedule.push(day);
        }

        //Scheduler contents
        $scope.scheduleActivitiesArray = [];
        for(i=1; i<=numberOfDays; i++){
            var DayActivitiesArray = [];
            for(j=0;j<24;j++){
                DayActivitiesArray.push("");
            }
            str= "day" + i;
            $scope.scheduleActivitiesArray[str] = DayActivitiesArray;
        }

        
        //Get selected venues        
        var selectedVenues =  {
            "Arts & Entertainment" : tripCreator.getSelectedVenuesOfCategory("Arts & Entertainment"),
            "Museums" : tripCreator.getSelectedVenuesOfCategory("Museums"),
            "Nightlife" : tripCreator.getSelectedVenuesOfCategory("Nightlife"),
            "Public places" : tripCreator.getSelectedVenuesOfCategory("Public places"),
            "Shopping" : tripCreator.getSelectedVenuesOfCategory("Shopping"),
            "Food & drink" : tripCreator.getSelectedVenuesOfCategory("Food & drink"),
            "Transportation & Accomondation" : tripCreator.getSelectedVenuesOfCategory("Transportation & Accomondation"),
            "Religion and Organizations" : tripCreator.getSelectedVenuesOfCategory("Religion and Organizations")
        };
    
        //Get general categories
        $scope.generalCategoriesList = tripCreator.getCategoriesOfSelectedVenues();

        //Choose category
        $scope.updateCategory = function(){
            
            $scope.listOfDisplayedVenues = selectedVenues[$scope.chosenCategory];

            $scope.subCategoriesList.length = 0;
            for(i=0; i<$scope.listOfDisplayedVenues.length; i++){
                var categories = $scope.listOfDisplayedVenues[i].categories.split(", ");
                for(j=0; j<categories.length; j++){
                    if($scope.subCategoriesList.indexOf(categories[j]) == -1 ){
                        $scope.subCategoriesList.push(categories[j]); 
                    }
                }
            }
            
        };

        //Choose sub-categories
        $scope.updateSubCategory = function(){

            $scope.listOfDisplayedVenues = [];

            if($scope.chosenSubCategory == "all"){
                $scope.listOfDisplayedVenues = selectedVenues[$scope.chosenCategory];
            }else{
                $scope.listOfDisplayedVenues.length = 0;
                for(i=0; i<selectedVenues[$scope.chosenCategory].length; i++){
                    if(selectedVenues[$scope.chosenCategory][i].categories.indexOf($scope.chosenSubCategory) > -1){
                        $scope.listOfDisplayedVenues.push(selectedVenues[$scope.chosenCategory][i]);
                    }
                }
            }

        };



        var arrivalTime, departureTime, startRestingTime, endRestingTime;

        //Set arrival/departure and resting times and update scheduler
        $scope.setArrivalTime = function(){
            var time = $scope.firstDayArrival;
            var id ="";
            if(arrivalTime != "" && arrivalTime != undefined){
                if(startRestingTime != undefined && startRestingTime != 0 && startRestingTime > arrivalTime){
                    for(i=0; i<startRestingTime; i++){
                        if(i==0){
                            id = "day1_0";
                        }else{
                            id = "day1_"+i;
                        }
                        if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                            document.getElementById(id).style.background = "#e6e6e6";
                        }
                    }
                }else{
                    for(i=0; i<24; i++){
                        if(i==0){
                            id = "day1_0";
                        }else{
                            id = "day1_"+i;
                        }
                        if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                            document.getElementById(id).style.background = "#e6e6e6";
                        }
                    }
                }
            }
            for(i=0; i<time; i++){
                if(i==0){
                    id = "day1_0";
                }else{
                    id = "day1_"+i;
                }
                document.getElementById(id).style.background = "red";
            }
            arrivalTime = time;
            $scope.checkWhatCollumnsToDisplay();
        };

        $scope.setDepartureTime = function(){

            var time = $scope.lastDayDeparture;
            var id = "";

            if(departureTime != "" && departureTime != undefined){

                if(endRestingTime != undefined && endRestingTime != 0 && endRestingTime < departureTime){

                    for(i=endRestingTime; i<24; i++){
                        if(i==0){
                            id = "day1_0";
                        }else{
                            id = "day1_"+i;
                        }
                        if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                            document.getElementById(id).style.background = "#e6e6e6";
                        }
                    }

                }else{

                    for(i=0; i<24; i++){
                        if(i==0){
                            id = "day1_0";
                        }else{
                            id = "day1_"+i;
                        }
                        if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                            document.getElementById(id).style.background = "#e6e6e6";
                        }
                    }

                }


            }

            for(i=time; i<24; i++){
                if(i==0){
                    id = "day" + numberOfDays + "_0";
                }else{
                    id = "day" + numberOfDays + "_" + i;
                }
                document.getElementById(id).style.background = "red";

            }

            departureTime = time;


            $scope.checkWhatCollumnsToDisplay();

        };

        $scope.setRestTime = function(){

            var startTime = $scope.startingRestTime;
            var endTime = $scope.endingRestTime;

            if(startTime != undefined && startTime != "" && endTime != undefined && endTime != ""){


                if(startRestingTime != undefined && startRestingTime != 0 && endRestingTime != undefined && endRestingTime != 0){
                    var id;

                    if(arrivalTime != undefined){
                        for(i=parseInt(arrivalTime, 10); i<24; i++){

                            id = "day1_"+i;

                            if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                                document.getElementById(id).style.background = "#e6e6e6";
                            }

                        }
                    }else{
                        var id;
                        for(i=0; i<24; i++){
                            if(i==0){
                                id = "day1_0";
                            }else{
                                id = "day1_"+i;
                            }
                            if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                                document.getElementById(id).style.background = "#e6e6e6";
                            }
                        }
                    }

                    var idToUse;

                    for(j=2; j<numberOfDays; j++){
                        var id = "day" + j + "_";
                        for(i=0; i<24; i++){
                            if(i==0){
                                idToUse = id + '0';
                            }else{
                                idToUse = id + i;
                            }
                            if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                                document.getElementById(id).style.background = "#e6e6e6";
                            }
                        }
                    }

                    if(departureTime != undefined){
                        for(i=0; i<parseInt(departureTime, 10); i++){
                            if(i==0){
                                id = "day" + numberOfDays + "_0";
                            }else{
                                id = "day" + numberOfDays + "_" + i;
                            }
                            if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                                document.getElementById(id).style.background = "#e6e6e6";
                            }
                        }
                    }else{
                        var id;
                        for(i=0; i<24; i++){
                            if(i==0){
                                id = "day" + numberOfDays + "_0";
                            }else{
                                id = "day" + numberOfDays + "_" + i;
                            }
                            if(document.getElementById(id).style.background.indexOf("#29ff1a") < 0){
                                document.getElementById(id).style.background = "#e6e6e6";
                            }
                        }
                    }

                }


                if(arrivalTime != undefined){

                    if(startTime < 24 && startTime > parseInt(arrivalTime, 10)){
                        id = "day1_";

                        for(i=startTime; i < 24; i++){

                            idToUse = id + i;
                            document.getElementById(idToUse).style.background = "red";

                        }
                    }

                }else{

                    id = "day1_";

                    for(i=startTime; i != endTime; i++){

                        if(i == 24){
                            i = 0;
                        }

                        idToUse = id + i;
                        document.getElementById(idToUse).style.background = "red";

                    }

                }

                for(j=2; j<numberOfDays; j++){

                    id = "day" + j + "_";

                    for(i=startTime; i != endTime; i++){

                        if(i == 24){
                            i = 0;
                        }

                        idToUse = id + i;
                        document.getElementById(idToUse).style.background = "red";

                    }
                }

                if(departureTime != undefined && departureTime != "" ){

                    console.log(endTime > 0 && endTime < parseInt(departureTime, 10));
                    if(endTime > 0 && endTime < parseInt(departureTime, 10)){

                        id = "day" + numberOfDays + "_";

                        for(i=0; i < endTime; i++){
                            if(i==0){
                                idToUse = id + "0";
                                document.getElementById(idToUse).style.background = "red";
                            }else{
                                idToUse = id + i;
                                document.getElementById(idToUse).style.background = "red";
                            }
                        }
                    }

                }else{

                    var id = "day" + numberOfDays + "_";

                    for(i=startTime; i != endTime; i++){

                        if(i == 24){
                            i = 0;
                        }

                        idToUse = id + i;
                        document.getElementById(idToUse).style.background = "red";

                    }

                }

                startRestingTime = startTime;
                endRestingTime = endTime;

            }

            $scope.checkWhatCollumnsToDisplay();

        };
        
        //Manage collumns display
        $scope.showCollumn = [];
        for(i=0;i<24;i++){
            $scope.showCollumn.push(true);
        }

        $scope.checkWhatCollumnsToDisplay = function(){

            var id;
            var count;

            for(i=0;i<24;i++){
                $scope.showCollumn[i] = true;
            }

            for(i=0; i<24; i++){

                count = 0;

                for(j=1;j<=numberOfDays;j++){

                    if(i==0){
                        id = "day" + j + "_0";
                    }else{
                        id = "day" + j + "_" + i;
                    }

                    if(document.getElementById(id).style.background.indexOf("red") > -1){
                        count++;
                    }

                }

                if(count == numberOfDays){
                    $scope.showCollumn[i] = false;
                }

            }

        };


        //Select venue to add/remove to/from schedule as an activity
        $scope.selectedForAddingVenue = false;
        $scope.selectedForRemovingVenue = false;

        $scope.addToSchedule = function(venue){
            $scope.selectedForAddingVenue = venue;
        };

        $scope.removeFromSchedule = function(venue){
            $scope.selectedForRemovingVenue = venue;
        };

        //Create and store activity
        $scope.scheduledActivities = [];

        $scope.addToScheduleFinal = function(){

            if($scope.selectedForAddingVenue == undefined){
                alert("Please select a venue!");
            }else if($scope.activityName == undefined || $scope.activityName == ""){
                alert("Please enter a name for the activity!");
            }else if($scope.activityDay == undefined || $scope.activityDay == ""){
                alert("Please select a day for the activity!");
            }else if($scope.activityStartingTime == undefined || $scope.activityEndingTime == ""){
                alert("Please select the starting time of the activity!");
            }else if($scope.activityEndingTime == undefined || $scope.activityDay == ""){
                alert("Please select the ending time of the activity!");
            }else{

                var scheduledActivity = {
                    "activityName" :  $scope.activityName,
                    "activityDay" :  $scope.activityDay,
                    "activityStartingTime" :  $scope.activityStartingTime,
                    "activityEndingTime" :  $scope.activityEndingTime,
                    "activityNotes" : $scope.activityNotes,
                    "venue": $scope.selectedForAddingVenue
                };

                $scope.scheduledActivities.push(scheduledActivity);

                console.log(scheduledActivity);


                //Display to schedule

                var id;

                if(parseInt($scope.activityStartingTime) <  parseInt($scope.activityEndingTime)) {
                    if (parseInt($scope.activityStartingTime) == 24) {
                        for (i = 0; i < parseInt($scope.activityEndingTime); i++) {
                            id = $scope.activityDay + "_" + i;
                            document.getElementById(id).style.background = "#29ff1a";
                            $scope.scheduleActivitiesArray[$scope.activityDay][i] = $scope.activityName + " at " + $scope.selectedForAddingVenue.name;
                        }
                    } else {
                        for (i = parseInt($scope.activityStartingTime); i < parseInt($scope.activityEndingTime); i++) {
                            id = $scope.activityDay + "_" + i;
                            document.getElementById(id).style.background = "#29ff1a";
                            $scope.scheduleActivitiesArray[$scope.activityDay][i] = $scope.activityName + " at " + $scope.selectedForAddingVenue.name;
                        }
                    }
                }else{
                    console.log(parseInt($scope.activityStartingTime) + ">=" + parseInt($scope.activityEndingTime));

                    for (i = parseInt($scope.activityStartingTime); i < 24; i++) {
                        id = $scope.activityDay + "_" + i;
                        console.log(id);
                        document.getElementById(id).style.background = "#29ff1a";
                        $scope.scheduleActivitiesArray[$scope.activityDay][i] = $scope.activityName + " at " + $scope.selectedForAddingVenue.name;
                    }

                    for (i = 0; i < parseInt($scope.activityEndingTime); i++) {

                        dayNum = parseInt($scope.activityDay.substring(3, $scope.activityDay.length));
                        nextDay = dayNum + 1;
                        id = "day" + nextDay + "_" + i;
                        document.getElementById(id).style.background = "#29ff1a";
                        nextDayStr = "day" + nextDay;
                        $scope.scheduleActivitiesArray[nextDayStr][i] = $scope.activityName + " at " + $scope.selectedForAddingVenue.name;
                    }
                }

                $scope.activityName = "";
                $scope.activityDay = "day1";
                $scope.activityStartingTime = "24";
                $scope.activityEndingTime = "24";
                $scope.activityNotes = "";

                $scope.selectedForAddingVenue = false;

                $scope.refreshScheduleDisplay();

            }

        };

        $scope.deleteActivityFromSchedule = function(activity){

            // delete drom display array and from storage

            var activityData = activity.split(" at ");
            var activityName = activityData[0];
            var venueName = activityData[1];

            console.log($scope.scheduledActivities.length);

            console.log($scope.scheduledActivities.length);
            //Dete from scheduledActivities array
            for(i=0; i<$scope.scheduledActivities.length; i++){
                if($scope.scheduledActivities[i]["activityName"] === activityName){
                    if($scope.scheduledActivities[i]["venue"]["name"] === venueName){

                        var id;
                        for (k = $scope.scheduledActivities[i].activityStartingTime; k < $scope.scheduledActivities[i].activityEndingTime; k++) {
                            id = $scope.scheduledActivities[i].activityDay + "_" + k;
                            document.getElementById(id).style.background = "#e6e6e6";
                            $scope.scheduleActivitiesArray[$scope.scheduledActivities[i].activityDay][k] = "";
                        }


                        $scope.scheduledActivities.splice(i,1);
                    }
                }
            }
            console.log($scope.scheduledActivities.length);

           
        };
        
        $scope.refreshScheduleDisplay = function(){

            //Clear schedule
            for(i=1; i<=numberOfDays; i++){
                for(j=0; j<24; j++){
                    id = "day" + i + "_" + j;
                    document.getElementById(id).style.background = "#e6e6e6";
                }
            }
            //Show all columns
            if($scope.showCollumn == undefined){
                $scope.showCollumn.length = 0;
                $scope.showCollumn = [];
                for(i=0;i<24;i++){
                    $scope.showCollumn.push(true);
                }
            }else{
                $scope.showCollumn = [];
                for(i=0;i<24;i++){
                    $scope.showCollumn.push(true);
                }
            }
            arrivalTime = "";
            departureTime = "";
            startRestingTime = "";
            endRestingTime = "";

            console.log('arrival');

            //Set arrival time
            if($scope.firstDayArrival != undefined && $scope.firstDayArrival != ""){
                console.log('in here');
                $scope.setArrivalTime();
            }

            console.log('depart');
            //Set departure time
            if($scope.lastDayDeparture != undefined && $scope.lastDayDeparture != ""){
               $scope.setDepartureTime();
            }

            console.log('rest');
            //Set rest time
            var startTime = $scope.startingRestTime;
            var endTime = $scope.endingRestTime;
            if(startTime != undefined && startTime != "" && endTime != undefined && endTime != ""){
                $scope.setRestTime();
            }

            //Set activities
            for(i=0; i<$scope.scheduledActivities.length; i++){
                var activityToAdd = $scope.scheduledActivities[i];

                //Display to schedule

                var id;

                if(parseInt(activityToAdd.activityStartingTime) <  parseInt(activityToAdd.activityEndingTime)) {
                    if (parseInt(activityToAdd.activityStartingTime) == 24) {
                        for (i = 0; i < parseInt(activityToAdd.activityEndingTime); i++) {
                            id = activityToAdd.activityDay + "_" + i;
                            document.getElementById(id).style.background = "#29ff1a";
                            $scope.scheduleActivitiesArray[activityToAdd.activityDay][i] = activityToAdd.activityName + " at " + activityToAdd.venue.name;
                        }
                    } else {
                        for (i = parseInt(activityToAdd.activityStartingTime); i < parseInt(activityToAdd.activityEndingTime); i++) {
                            id = activityToAdd.activityDay + "_" + i;
                            console.log(id);
                            document.getElementById(id).style.background = "#29ff1a";
                            $scope.scheduleActivitiesArray[activityToAdd.activityDay][i] = activityToAdd.activityName + " at " + activityToAdd.venue.name;
                        }
                    }
                }else{
                    console.log(parseInt(activityToAdd.activityStartingTime) + ">=" + parseInt(activityToAdd.activityEndingTime));

                    for (i = parseInt(activityToAdd.activityStartingTime); i < 24; i++) {
                        id = activityToAdd.activityDay + "_" + i;
                        console.log(id);
                        document.getElementById(id).style.background = "#29ff1a";
                        $scope.scheduleActivitiesArray[activityToAdd.activityDay][i] = activityToAdd.activityName + " at " + activityToAdd.venue.name;
                    }

                    for (i = 0; i < parseInt(activityToAdd.activityEndingTime); i++) {

                        dayNum = parseInt(activityToAdd.activityDay.substring(3, activityToAdd.activityDay.length));
                        nextDay = dayNum + 1;
                        id = "day" + nextDay + "_" + i;
                        document.getElementById(id).style.background = "#29ff1a";
                        nextDayStr = "day" + nextDay;
                        $scope.scheduleActivitiesArray[nextDayStr][i] = activityToAdd.activityName + " at " + activityToAdd.venue.name;
                    }
                }

            }
            
            
        };


        
        
        $scope.finalize = function(){

            var finalTrip = {

                "user" : $window.sessionStorage.user,

                "city" : tripCreator.getCity(),

                "startDate" : startDate,
                "endDate" : endDate,
                "numberOfDays" : numberOfDays,

                "selectedCategories" : $scope.generalCategoriesList,

                "selectedVenues" : selectedVenues,

                "scheduledActivities" : $scope.scheduledActivities
            };
            
            tripCreator.finalizeTrip(finalTrip).then(function(){
                $window.location.href = './#/home';
            });

        
        };
        
         
    }
]);

myApp.controller("AdminCtrl", ['$scope', '$window', 'supportedCities',
    function($scope, $window, supportedCities) {
        $scope.name = "Admin Controller";

        $scope.tools = {
            "editCities" : false
        };

        $scope.cities = [];

        supportedCities.getCities().then(function(data) {
            $scope.cities = data.data.cities;
        });

        $scope.showCitySelector = function (action) {
            if(action == "edit" || action == "delete"){
                return true;
            }else{
                return false;
            }
        };

        $scope.openTool = function(page){
            //make all tools false
            $scope.tools.editCities = false;

            //make selected tool true
            if(page = "editCities"){
                $scope.tools.editCities = true;


            }
        };






    }
]);