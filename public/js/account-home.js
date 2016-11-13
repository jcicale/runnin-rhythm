$('.clear-all').on('click', function(){
	$('input:checkbox[name=cbox1]').attr('checked', false);
	$('input:checkbox[name=cbox2]').attr('checked', false);
	$('input:checkbox[name=cbox3]').attr('checked', false);
	$('input:checkbox[name=cbox4]').attr('checked', false);
	$('input:checkbox[name=cbox5]').attr('checked', false);
});


function updateLengthFilter(val) {
    document.getElementById('slider-value').value=val; 
};

function updateSlider(val) {
    document.getElementById('slider').value=val; 
};

function addPlaylist() {
		var $background = $("<div>");
		var $cover = $("<div>");
		var $information = $("<div><h4>Groovin' 5K</h4><h5>Pace: 9:30</h5><h5>Length: 3.1 Miles</h5><h5>Genre: Pop</h5></div>");
		$('#playlist-container').append($background);
		$background.append($cover);
		$cover.addClass("flex-item artwork-cover")
		$background.addClass("background flex-item");
		$background.css("background-image", "url('images/album-art/adele.jpg')");
		$cover.append($information);
		$information.addClass("playlist-info");
	}

$('#add-playlist').on('click', function(){
	addPlaylist();
});

function loadUser() {
	function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	};

    var access_token = getUrlParameter('access_token');

	$.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function(response) {
      $('#avatar').attr('src', response.images[0].url);
    }
});
}

$(document).ready(loadUser);





