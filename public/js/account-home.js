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
      		console.log(tracksWithAudioProfiles);
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
	console.log(tracks);
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





