var genres = ["Alternative", "Christian", "Country", "EDM/Dance", "Folk", "Hip-Hop", "Indie", "Jazz", "Metal",  "Party", "Pop", "RnB", "Rock", "Soul" ];
var paces = ["6:00", "6:15", "6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00"];

function createGenreClickListener(i) {
	return function() {
		$("#filter-genre-dropdown-title").html(genres[i]);
		$(".dropdown").blur();
	};
};

function createModalGenreClickListener(i) {
	return function() {
		$("#modal-genre-dropdown-title").html(genres[i]);
		$(".dropdown").blur();
	};
};

function createPaceClickListener(i) {
	return function() {
		$("#modal-pace-dropdown-title").html(paces[i] + " min");
		$(".dropdown").blur();
	};
};

function populateDropdowns() {
	var genreLength = genres.length;
	for (var i = 0; i < genreLength; i ++) {
		var $listItem = $("<li></li>");
		var $button = $("<button>");
		var genre = genres[i];
		$button.html(genres[i]);
		$listItem.append($button);
		$("#filter-genre-dropdown ul").append($listItem);
		$listItem.on("click", createGenreClickListener(i));
	}
	for (var i = 0; i < genreLength; i ++) {
		var $listItem = $("<li></li>");
		var $button = $("<button>" + genres[i] + "</button>");
		$listItem.append($button);
		$("#modal-genre-dropdown ul").append($listItem);
		$listItem.on("click", createModalGenreClickListener(i));
	}
	var paceLength = paces.length;
	for (var i = 0; i < paceLength; i ++) {
		var $listItem = $("<li></li>");
		var $button = $("<button>" + paces[i] + " min" + "</button>");
		$listItem.append($button);
		$("#modal-pace-dropdown ul").append($listItem);
		$listItem.on("click", createPaceClickListener(i));
	}
};

//generate playlist button
$("#generate-playlist").on("click", function(){
	var playlistName = $("#playlist-name").val();
	var runLengthSelection = $("#run-length").val();
	var paceSelection = $("#modal-pace-dropdown-title").html();
	var genreSelection = $("#modal-genre-dropdown-title").html();
	if (playlistName == "" || paceSelection == "Select Pace" || genreSelection == "Select Genre") {
		$("#create-playlist-modal").append("<p>Please enter a value for all fields to continue</p>");
	}
	else {
		$("#modal-container").hide();
		var spinner = new Spinner({color: "#fff"}).spin();
		$("#create-playlist-modal").append(spinner.el);
		$("#create-playlist-modal").modal({
  			escapeClose: false,
 			clickClose: false,
  			showClose: false
		});
		}
		//$.modal.close();
});

//filter checkbox
$('.clear-all').on('click', function(){
	$('input:checkbox[name=cbox1]').attr('checked', false);
	$('input:checkbox[name=cbox2]').attr('checked', false);
	$('input:checkbox[name=cbox3]').attr('checked', false);
	$('input:checkbox[name=cbox4]').attr('checked', false);
	$('input:checkbox[name=cbox5]').attr('checked', false);
});

//filter slider
function updateLengthFilter(val) {
    document.getElementById('slider-value').value=val; 
};

function updateSlider(val) {
    document.getElementById('slider-filter').value=val; 
};

//playlist slide panel
var slider = $('#slider').slideReveal({
	position: "right",
	top: 66,
	width: '65%',
	push: false,
	overlay: true,
	overlayColor: 'rgba(0,0,0,.5)'
});

$("#slider").addClass("slider-class");

//dynamically add playlists
function addPlaylist() {
		var $background = $("<div>");
		var $cover = $("<div>");
		var playlistObject = {
			name: "Groovin' 5K",
			pace: "9:30",
			length: "3.1 Miles",
			genre: "Pop"
		};
		function addInformation(playlistObject) {
			var $information = $("<div></div>");
			$information.append("<h4>" + playlistObject.name +"</h4>");
			$information.append("<h5>" + playlistObject.pace +"</h5>");
			$information.append("<h5>" + playlistObject.length +"</h5>");
			$information.append("<h5>" + playlistObject.genre +"</h5>");
			$information.addClass("playlist-info");
			return $information;
		}
		$('#playlists-container').append($background);
		$background.append($cover);
		$cover.addClass("flex-item artwork-cover")
		$background.addClass("background flex-item");
		$background.css("background-image", "url('images/album-art/adele.jpg')");
		$cover.append(addInformation(playlistObject));

		$cover.on('click', function() {
			slider.slideReveal("toggle");
		});

	}

$('#add-playlist').on('click', function(){
	addPlaylist();
});

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

function loadAll() {
 loadUser();
 loadSongs();
 populateDropdowns();
}

function loadSongs() {
	var access_token = getUrlParameter('access_token');
	$.ajax({
    	url: 'https://api.spotify.com/v1/search',
    	headers: {
      		'Authorization': 'Bearer ' + access_token
    	},
    	success: function(response) {
      		getAudioProfile(response.tracks.items);
    	},
    	data: {
    		"q" : "genre:Electronic",
    		"type" : "track",
    		"market" : "US",
    		"limit" : "50"
    	}
	});
}

function getTrackIDsFromSpotifyTracks(tracks) {
	return tracks.map(function(track) {
		return track.id;
	})
}

function getAudioProfile(tracks) {
	var trackIDs = getTrackIDsFromSpotifyTracks(tracks);
	var access_token = getUrlParameter('access_token');
	$.ajax({
    	url: 'https://api.spotify.com/v1/audio-features',
    	headers: {
      		'Authorization': 'Bearer ' + access_token
    	},
    	success: function(response) {
      		var audioProfileDictionary = convertAudioProfilesToDictionary(response.audio_features);
      		var tracksWithAudioProfiles = addAudioProfileToTrack(tracks, audioProfileDictionary);
      		var average = 0;
      		for (var i = 0; i < tracksWithAudioProfiles.length; i++) {
      			average += tracksWithAudioProfiles[i].audioProfile.tempo;
      		}
      		average = average/50;
      		console.log(average);
    	},
    	data: {
    		"ids" : trackIDs.join()
    	}
	});
}

function convertAudioProfilesToDictionary(audioProfiles) {
	var dictionary = {};
	for (var i = 0; i < audioProfiles.length; i++) {
		var profile = audioProfiles[i];
		dictionary[profile.id] = profile;
	}
	return dictionary;
}

function addAudioProfileToTrack(tracks, audioProfiles) {
	for (var i = 0; i < tracks.length; i++) {
		var track = tracks[i];
		track.audioProfile = audioProfiles[track.id];
	}
	return tracks;
}

//get user info from spotify
function loadUser() {
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

$(document).ready(loadAll);





