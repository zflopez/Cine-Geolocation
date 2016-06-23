function getData() {
	var cinemaName = $("input[name='cinema']");
	var latName = $("input[name='latitude']");
	var lonName = $("input[name='longitude']");

	var cinema = {};
	cinema["name"] = cinemaName;
	cinema["latitude"] = latName;
	cinema["longitude"] = lonName;

	var storedCinemas = JSON.parse(window.localStorage.getItem('cinemas')) || {};
	storedCinemas[Object.keys(storedCinemas).length + 1] = cinema;

	window.localStorage.setItem("cinemas", JSON.stringify(storedCinemas));
}

$(document).ready(function() {
	$('.buttonSubmit').click(function(e){
		e.preventDefault();
		getData();
	});
});








//!= ""