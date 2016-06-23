var map;

function getData() {
	var cinemaName = $("input[name='cinema']").val();
	var latName = $("input[name='latitude']").val();
	var lonName = $("input[name='longitude']").val();

	var cinema = {};
	cinema["name"] = cinemaName;
	cinema["latitude"] = latName;
	cinema["longitude"] = lonName;

	toLocalStorage();	
}

function toLocalStorage() {
	var storedCinemas = JSON.parse(window.localStorage.getItem('cinemas')) || {};
	storedCinemas[Object.keys(storedCinemas).length + 1] = cinema;

	window.localStorage.setItem("cinemas", JSON.stringify(storedCinemas));
}

function getLocation() {
	console.log('Getting your location...');

	var options = {
		enableHighAccuracy: true
	};

	navigator.geolocation.getCurrentPosition(onLocation, onError, options);	
}

function onLocation(position){
	map = new google.maps.Map(document.getElementById('map'),{
		zoom:10,
		center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var storedCinemas = JSON.parse(window.localStorage.getItem('cinemas')) || {};
	var nearestCinema;
	var nearestCinemaDistance = Infinity;

	var locations = [
	['You', position.coords.latitude, position.coords.longitude, 0]
	];

	for(cinemaIndex in storedCinemas){
		console.log(storedCinemas[cinemaIndex].name);
		var distanceAux = distance(position.coords.latitude, position.coords.longitude, storedCinemas[cinemaIndex].latitude, storedCinemas[cinemaIndex].longitude, "km");	

		var cinema = [storedCinemas[cinemaIndex].name, storedCinemas[cinemaIndex].latitude, storedCinemas[cinemaIndex].longitude, distanceAux];
		locations.push(cinema);

		if(distanceAux < nearestCinemaDistance){
			nearestCinema = storedCinemas[cinemaIndex];
		}
	}

	getMarkers(locations);

	var arrayAux = locations.sort(function(a, b) {
		if (a[3] > b[3])
			return 1;
		
		if (a[3] < b[3])
			return -1;
		
		return 0;
	});

	console.log(arrayAux);

	var i;
	var htmlList = "<li>" + arrayAux[i] + "</li>";
	$('.locationList').append(htmlList);

}

function getMarkers(array) {
	var infowindow = new google.maps.InfoWindow();
	var marker, i;

	for (i = 0; i < array.length; i++) {
		console.log(array[i][1]);
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(array[i][1], array[i][2]),
			map: map,
			icon: 'https://maps.google.com/mapfiles/kml/shapes/' + 'schools_maps.png'
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(array[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
}

function onError (error) {
	console.log("Getting location failed: " + error);
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.853159;

	return dist;
}

$(document).ready(function() {
	$('.buttonSubmit').click(function(e){
		e.preventDefault();
		getData();
	});

	if ("geolocation" in navigator) {
		getLocation();	
	} else {
		alert("Geolocation is not available")
	}
});


//!= ""