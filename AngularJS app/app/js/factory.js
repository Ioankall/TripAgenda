myApp.factory('supportedCities', function($http) {
  
  var urlBase = 'http://snf-703110.vm.okeanos.grnet.gr:3000/api/v1/cities';
  
  var _prodFactory = {};
 
  _prodFactory.getCities = function() {
    return $http.get(urlBase);
  }; 
 
  return _prodFactory;
});

myApp.factory('tripViewer', function($http, $window){

    var userTrips;
    var selectedTrip;

    function setTrips(trips){
        userTrips = trips;
    }

    function getTrips(){
        return userTrips;
    }

    function setSelectedTrip(trip){
        selectedTrip = trip;
    }

    function getSelectedTrip(){
        return selectedTrip;
    }

    return {
        setTrips: setTrips,
        getTrips: getTrips,
        setSelectedTrip: setSelectedTrip,
        getSelectedTrip: getSelectedTrip
    }
});

myApp.factory('tripCreator', function($http, $window) {

  
  var city;
  var categories;
  var dates;
  
  var allVenues;
  
  var selectedVenues;
    
  var finalTrip;
  
  function setCity(cityName) {
	  city = cityName;
  }
  
  function setCategories(categoriesArg) {
	  categories = categoriesArg;
  }
  
  function setDates(datesArg) {
	  dates = datesArg;
  }

  function daysOfMonth(month, year) {
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
      return maxDays;
  }

  function computeDateDiff(startDate, endDate){

	  var start_str = startDate.split('/');
      var end_str = endDate.split('/');

	  var start = [];
	  var end = [];

	  start[0] = parseInt(start_str[0]);
	  start[1] = parseInt(start_str[1]);
	  start[2] = parseInt(start_str[2]);

	  end[0] = parseInt(end_str[0]);
	  end[1] = parseInt(end_str[1]);
	  end[2] = parseInt(end_str[2]);

	  console.log("checkpoint 1 -->" + start[1] + " " + end[1]);
      //check if startDate is greater than the endDate.
      if(start[2] > end[2]){
		  console.log("checkpoint 3");
          return -1;
      }else if(start[2] == end[2]){
          if(start[1] > end[1]){
			  console.log("checkpoint 4");
              return -1;
          }else if(start[1] == end[1]){
              if(start[0] > end[0]){
				  console.log("checkpoint 5");
                  return -1;
              }
          }
      }

	  console.log("checkpoint 2");

      //find diff

      if(start[2] == end[2]){
          //Same year
          if(start[1] == end[1]){
              //Same month
              return end[0]-start[0] + 1;
          }else{
              //Next months
              var days = 0;

              days += parseInt(daysOfMonth(start[1],start[2]),10) - parseInt(start[0],10) + 1 + parseInt(end[0]);

              for(i=parseInt(start[1])+1; i<parseInt(end[1]); i++){
                  days += parseInt(daysOfMonth(i,start[2]),10);
              }
			  console.log(days);
              return days;
          }
      }else{
          //Next year(s)
          var days = 0;

          var endOfYear = [31, 12, start[2]];

          //days to end of year
          if(start[1] == endOfYear[1]){
              //Same month
              days = parseInt(endOfYear[0],10)-parseInt(start[0],10) + 1;
          }else{
              //Next months
              days += parseInt(daysOfMonth(start[1],start[2]),10) - parseInt(start[0],10) + 1 + parseInt(endOfYear[0],10);
              for(i=parseInt(start[1],10)+1; i<parseInt(endOfYear[1],10); i++){
                  days += parseInt(daysOfMonth(i,start[2]),10);
              }
          }
          console.log(days);
          var startOfYear = [1, 1, end[2]];

          //days to final day
          if(startOfYear[1] == end[1]){
              //Same month
              days += parseInt(end[0],10)-parseInt(startOfYear[0],10)+1;
          }else{
              //Next months
              var days = 0;
              days += parseInt(daysOfMonth(startOfYear[1],startOfYear[2]),10) - parseInt(startOfYear[0],10) + 1 + parseInt(end[0],10);
              for(i=parseInt(startOfYear[1],10)+1; i<parseInt(end[1],10); i++){
                  days += parseInt(daysOfMonth(i,startOfYear[2]),10);
              }
          }
          console.log(days);
          //if more than one year away
          days += (parseInt(end[2],10) - parseInt(start[2],10) - 1) * 365;
          console.log(days);
          return days;

      }

  }

  
  function getCity() {
	  return city;
  }
  
  function getCategories() {
	  return categories;
  }
  
  function getDates() {
	  return dates;
  }
  
  
  function getVenuesOfCategory(category) {
	  var venues = [];
	  
	  for(i=0; i<allVenues.length; i++){
		  if(allVenues[i].generalCategory.indexOf(category) > -1){
			  venues.push(allVenues[i]);
		  }
	  }

	  return venues;
  }

    function getSelectedVenuesOfCategory(category) {
        var venues = [];

        for(i=0; i<selectedVenues.length; i++){
            if(selectedVenues[i].generalCategory.indexOf(category) > -1){
                venues.push(selectedVenues[i]);
            }
        }

        return venues;
    }

  function downloadVenuesAndProceed($window) {

	  var urlBase = 'http://snf-703110.vm.okeanos.grnet.gr:3000/api/v1/venues/' + city;

	  var request = $http.get(urlBase)
	  .then(function(response) {
		 allVenues = response.data.venues;
	  })
	  .catch(function(response) {
		 console.error('Error in getting venues', response.status, response.data);
	  })
	  .finally(function() {
		 console.log("Redirecting after venues has received.");
		 $window.location.href = './#/venuePresentation';
	  });
  }

  function setSelectedVenues(list) {
      selectedVenues = list;
  }
  

  function getSelectedVenues(){
	  return selectedVenues;
  }

  function getCategoriesOfSelectedVenues(){
	  var categoriesList = [];

	  var artsAndEntertainment = false;
	  var museums = false;
	  var nightlife = false;
	  var foodAndDrink = false;
	  var publicPlaces = false;
	  var shopping = false;
	  var transportationAndAccommodation = false;
	  var religionAndOrganizations = false;

	  for(i=0; i<selectedVenues.length; i++){
		  if( selectedVenues[i].generalCategory.indexOf('Arts & Entertainment') > -1 && artsAndEntertainment == false){
			  artsAndEntertainment = true;
			  categoriesList.push('Arts & Entertainment');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Museums') > -1 && museums == false){
			  museums = true;
			  categoriesList.push('Museums');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Nightlife') > -1 && nightlife == false){
			  nightlife = true;
			  categoriesList.push('Nightlife');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Food & drink') > -1 && foodAndDrink == false){
			  foodAndDrink = true;
			  categoriesList.push('Food & drink');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Public places') > -1 && publicPlaces == false){
			  publicPlaces = true;
			  categoriesList.push('Public places');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Shopping') > -1 && shopping == false){
			  shopping = true;
			  categoriesList.push('Shopping');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Transportation & Accomondation') > -1 && transportationAndAccommodation == false){
			  transportationAndAccommodation = true;
			  categoriesList.push('Transportation & Accomondation');
		  }
		  if( selectedVenues[i].generalCategory.indexOf('Religion and Organizations') > -1 && religionAndOrganizations == false){
			  religionAndOrganizations = true;
			  categoriesList.push('Religion and Organizations');
		  }
	  }

	  return categoriesList;
  }

  function getSelectedVenuesOfCategory(category) {
	  var venues = [];

	  for(i=0; i<selectedVenues.length; i++){
		  if(selectedVenues[i].generalCategory.indexOf(category) > -1){
			  venues.push(selectedVenues[i]);
		  }
	  }
	  
	  return venues;
  }
  
  function isSelected(venue){
	  for(n=0; n<selectedVenues.length; n++){
		  if(selectedVenues[n]['name'] == venue['name'] ){
			  return true;
		  }
	  }
	  return false;
  }
  
  function getTagsAppearencesInVenues(venues){
	  
	  var tags = [];
	  var found = false;
	  
	  for(i=0; i<venues.length; i++){
		  var tagsFromVenue = [];
		  tagsFromVenue = venues[i].categories.split(", ");
		  for(j=0; j<tagsFromVenue.length; j++){
			  if(tagsFromVenue[j] == "" || tagsFromVenue[j] == " " || tagsFromVenue[j] == "test"){
				  continue;
			  }
			  found = false;
			  for(k=0; k<tags.length; k++){
				  if(tags[k][0] == tagsFromVenue[j]){
					  tags[k][1]++;
					  found = true;
					  break;
				  }
			  }
			  if(!found){
				  var entry = [tagsFromVenue[j], 1];
				  tags.push(entry);
			  }	
		  }
	  }
	  
	  return tags;
  }
  
  function getTagsOfSelectedVenuesByCategory(cat){
	  var venues = getSelectedVenuesOfCategory(cat);
	  return getTagsAppearencesInVenues(venues);
  }
  
  function getRecommendationsForCategory(category){
	  
	  var recommendations = [];
	  var tempRecommendations = [];
	  
	  var interestedIn = getTagsOfSelectedVenuesByCategory(category);
	  
	  console.log("fine with tags!");
	  var venuesOfCategory = getVenuesOfCategory(category);
	  console.log("fine with venues!" + venuesOfCategory.length);
	  
	  for(i=0; i<venuesOfCategory.length; i++){
		 
		 if(!isSelected(venuesOfCategory[i])){
			
			var level = 0;
			var commonTags = [];
			for(j=0; j<interestedIn.length; j++){
				if(venuesOfCategory[i].categories.indexOf(interestedIn[j][0]) > -1){
					commonTags.push(interestedIn[j][0]);
					level += interestedIn[j][1];
				}
			}
			
			var entry = [venuesOfCategory[i], level, commonTags.join()];
			
			if(entry[1]>0 && entry[0].rating>7.5){
				var found = false;
				for(z=0; z<recommendations.length;z++){
					if(recommendations[z][0].name == entry[0].name){
						found = true;
						if(recommendations[z][0].popularityScore < entry[0].popularityScore){
							recommendations[z] = entry;
						}
						break;
					}
				}	
				if(!found){
					recommendations.push(entry);
				}
			}
			
		 }
	  }
	  
	  recommendations.sort(function(a, b) { 
		 if (a[1] < b[1]) return 1;
		 if (a[1] > b[1]) return -1;
		 return 0;
	  });
	  
	  if(recommendations.length > 15){
		  tempRecommendations = recommendations.splice(0,15);
	  }
	  
	  tempRecommendations.sort(function(a, b) { 
		 if (a[0].popularityScore < b[0].popularityScore) return 1;
		 if (a[0].popularityScore > b[0].popularityScore) return -1;
		 return 0;
	  });
	  
	  if(tempRecommendations.length > 10){
		  recommendations = tempRecommendations.splice(0,10);
	  }
	  
	  return recommendations;
  }
    
    
  function finalizeTrip(trip){
      finalTrip = trip;
      
      //REST call to save the trip
      console.log(finalTrip);

      return $http.post('http://snf-703110.vm.okeanos.grnet.gr:3000/api/v1/trips', finalTrip);
  }

    var trips;
    function getAllTripsOfUser(){
        $http.get('http://snf-703110.vm.okeanos.grnet.gr:3000/api/v1/trips/' + $window.sessionStorage.user)
            .then(function(response) {
                trips = response.data.trips;
            });
    }

  
  return {
	setCity: setCity,
	getCity: getCity,
	setCategories: setCategories,
	getCategories: getCategories,
	setDates: setDates,
	getDates: getDates,
	getVenuesOfCategory: getVenuesOfCategory,
	downloadVenuesAndProceed: downloadVenuesAndProceed,
	setSelectedVenues: setSelectedVenues,
	getCategoriesOfSelectedVenues: getCategoriesOfSelectedVenues,
	getTagsOfSelectedVenuesByCategory: getTagsOfSelectedVenuesByCategory,
	getRecommendationsForCategory: getRecommendationsForCategory,
    getSelectedVenues: getSelectedVenues,
    computeDateDiff: computeDateDiff,
    getSelectedVenuesOfCategory: getSelectedVenuesOfCategory,
    finalizeTrip: finalizeTrip,
    getAllTripsOfUser: getAllTripsOfUser
  };
  
});
