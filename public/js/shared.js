var paces = ["6:00", "6:15", "6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00"];
var genres = ["Pop", "Rock", "Hip-Hop", "Electronic", "Indie"];

var genre_seeds = {
	"Pop": ["pop,power-pop,hip-hop,rock,dance"],
	"Rock": ["alternative,rock,hard-rock,punk-rock,rock-n-roll"],
	"Hip-Hop": ["hip-hop,r-n-b,jazz,blues,soul"],
	"Electronic": ["electronic,edm,dubstep,synth-pop,house"],
	"Indie": ["indie,indie-pop,folk,happy,acoustic"]
};

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
		$("#modal-pace-dropdown-title").html(paces[i] + " pace");
		$(".dropdown").blur();
	};
};

function resetModalInputsToDefault() {
  $("#modal-genre-dropdown-title").html("Select Genre");
  $("#modal-pace-dropdown-title").html("Select Pace");  
  $("#playlist-name").val("");
  $("#run-length").val(3);
}

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
		var $button = $("<button>" + paces[i] + " pace" + "</button>");
		$listItem.append($button);
		$("#modal-pace-dropdown ul").append($listItem);
		$listItem.on("click", createPaceClickListener(i));
	}
};

//filter functionality
$("#filter-button").on("click", function(callback) {
  var filteredLength = $("#slider-filter").val();
  $(".playlist-info-length").each(function() {
      var currentLength = $(this).html();
      currentLength = parseInt(currentLength.split(" ")[0]);
      if (!($(this).is(":visible")) && currentLength > filteredLength) {
        $(this).parent().parent().parent().show();
      }     
      if (currentLength < filteredLength) {
        $(this).parent().parent().parent().hide();
      }
  });
  var filteredGenre = $("#filter-genre-dropdown-title").html();
  if (filteredGenre != "Select Genre") {
    $(".playlist-info-genre").each(function() {
      var currentGenre = $(this).html();
      if (currentGenre != filteredGenre) {
        $(this).parent().parent().parent().hide();
      } else if (currentGenre == filteredGenre) {
        $(this).parent().parent().parent().show();
      }
    });
  }
});

$("#reset-button").on("click", function() {
  $(".background").each(function() {
    $(this).show();
  })
  $("#filter-genre-dropdown-title").html("Select Genre");
  $("#slider-filter").val(0);
  $("#slider-value").val(0);
});

//generate playlist button
$("#generate-playlist").on("click", function(){
	var playlistName = $("#playlist-name").val();
	var runLengthSelection = $("#run-length").val();
	var paceSelection = $("#modal-pace-dropdown-title").html();
	var genreSelection = $("#modal-genre-dropdown-title").html();
	if (playlistName == "" || paceSelection == "Select Pace" || genreSelection == "Select Genre") {
		$("#validation-warning").removeClass("validation-warning-mask");
	}
	else if(playlistName != "" && paceSelection != "Select Pace" && genreSelection != "Select Genre") {
		$("#validation-warning").addClass("validation-warning-mask");
        $("#modal-container").hide();
		var spinner = new Spinner({color: "#00c2b2"}).spin();
		$("#create-playlist-modal").append(spinner.el);
		$("#create-playlist-modal").modal({
  			escapeClose: false,
 			  clickClose: false,
  			showClose: false
		});
		getTracksFromSpotify(playlistName, runLengthSelection, paceSelection, genreSelection, function(playlist){
      $(".spinner").empty();
      $("#create-playlist-modal").modal({
        escapeClose: true,
        clickClose: true,
        showClose: true
      }); 
      $.modal.close();
      $("#modal-container").show();
      resetModalInputsToDefault();
      addPlaylist(playlist);      
    });
		}
		//$.modal.close();
});


//filter checkbox
$('.clear-all').on('click', function() {
	$('input:checkbox[name=cbox1]').attr('checked', false);
	$('input:checkbox[name=cbox2]').attr('checked', false);
	$('input:checkbox[name=cbox3]').attr('checked', false);
	$('input:checkbox[name=cbox4]').attr('checked', false);
	$('input:checkbox[name=cbox5]').attr('checked', false);
});

//hamburger toggle
function toggleHamburger() {
    var navigation = $("#top-navigation");
    var classNamed = navigation.attr("class");
    if (classNamed === "top-nav fa-ul") {
        navigation.addClass("responsive");
    } else {
        navigation.removeClass("responsive");
    }
}

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
	width: '65%',
	push: false,
	overlay: true,
	overlayColor: 'rgba(0,0,0,.5)'
});

$("#slider").addClass("slider-class");

function createPlaylistListener(playlist) {
  return function() {
    $("#slider").removeClass("slider-mask");
      showPlaylist(playlist);
      slider.slideReveal("toggle");
      
  }
}
//dynamically add playlists
function addPlaylist(playlistObject) {
		var $background = $("<div>");
		var $cover = $("<div>");
		function addInformation(playlistObject) {
			var $information = $("<div></div>");
			$information.append("<h4>" + playlistObject.name +"</h4>");
			$information.append("<h5 class='playlist-info-pace'>" + playlistObject.pace +"</h5>");
			$information.append("<h5 class='playlist-info-length'>" + playlistObject.length +"</h5>");
			$information.append("<h5 class='playlist-info-genre'>" + playlistObject.genre +"</h5>");
			$information.addClass("playlist-info");
			return $information;
		}
		$('#playlists-container').append($background);
		$background.append($cover);
		$cover.addClass("flex-item artwork-cover")
		$background.addClass("background flex-item");
		$background.css("background-image", "url('" + playlistObject.backgroundImage + "')");
		$cover.append(addInformation(playlistObject));

		$cover.on('click', createPlaylistListener(playlistObject));

	}

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

function onDocumentReady() {
  loadUser();
  populateDropdowns();
  $("#popular-playlists").attr("href", "/account-home.html?access_token=" + getUrlParameter("access_token"));
  $("#my-playlists").attr("href", "/my-playlists.html?access_token=" + getUrlParameter("access_token"));
  $("#new-playlist").attr("href", "/my-playlists.html?access_token=" + getUrlParameter("access_token") + "&new-playlist=true");
}

function convertPaceToTempo(paceSelection) {
	switch (paceSelection) {
  		case "6:00 pace":
    		return {min : 93, max : 96};
    		break;
  		case "6:15 pace":
    		return {min : 92, max : 95};
    		break;
  		case "6:30 pace":
    		return {min : 91, max : 94};
    		break;
  		case "6:45 pace":
    		return {min : 89, max : 92};
    		break;     		
  		case "7:00 pace":
    		return {min : 88, max : 91};
    		break;
  		case "7:15 pace":
    		return {min : 87, max : 90};
    		break;
  		case "7:30 pace":
    		return {min : 86, max : 89};
    		break;
  		case "7:45 pace":
    		return {min : 84, max : 87};
    		break;     		
  		case "8:00 pace":
    		return {min : 83, max : 86};
    		break;
  		case "8:15 pace":
    		return {min : 82, max : 85};
    		break;
  		case "8:30 pace":
    		return {min : 81, max : 84};
    		break;
  		case "8:45 pace":
    		return {min : 79, max : 82};
    		break;     		
  		case "9:00 pace":
    		return {min : 78, max : 81};
    		break;
  		case "9:15 pace":
    		return {min : 77, max : 80};
    		break;
  		case "9:30 pace":
    		return {min : 76, max : 79};
    		break;
  		case "9:45 pace":
    		return {min : 74, max : 77};
    		break;     		
  		case "10:00 pace":
    		return {min : 73, max : 76};
    		break;
  		case "10:15 pace":
    		return {min : 72, max : 75};
    		break;
  		case "10:30 pace":
    		return {min : 71, max : 74};
    		break;
  		case "10:45 pace":
    		return {min : 70, max : 73};
    		break;     		
  		case "11:00 pace":
    		return {min : 69, max : 72};
    		break;    
  		case "11:15 pace":
    		return {min : 68, max : 71};
    		break;
  		case "11:30 pace":
    		return {min : 67, max : 70};
    		break;
  		case "11:45 pace":
    		return {min : 66, max : 69};
    		break;     		
  		case "12:00 pace":
    		return {min : 65, max : 68};
    		break;     				
	}
}

function convertPaceSelectionToMilliseconds(paceSelection) {
  var stringPace = paceSelection.replace(" pace", "");
  var parts = stringPace.split(":");
  var minutes = parseInt(parts[0]);
  var seconds = parseInt(parts[1]);
  var durationInMilliseconds = ((minutes * 60) + seconds) * 1000;
  return durationInMilliseconds;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createPlaylist(playlistName, paceSelection, runLengthSelection, genreSelection, tracks) {
  var paceInMilliseconds = convertPaceSelectionToMilliseconds(paceSelection);
  var durationCountdown = paceInMilliseconds * runLengthSelection;
  var shuffledTracks = shuffle(tracks);
  var selectedTracks = [];
  var i = 0;

  while (durationCountdown > 0 && i < tracks.length) {
    var track = tracks[i];
    selectedTracks.push(track);
    durationCountdown -= track.duration_ms;
    i++;
  }

  var playlist = {
      name: playlistName,
      pace: paceSelection,
      length: runLengthSelection + " Miles",
      genre: genreSelection,
      tracks: selectedTracks,
      complete: durationCountdown <= 0,
      backgroundImage: selectedTracks[0].album.images[1].url,
      duration: (paceInMilliseconds * runLengthSelection) + durationCountdown
    };

    return playlist;
}

function getTracksFromSpotify(playlistName, runLengthSelection, paceSelection, genreSelection, completion) {
	var access_token = getUrlParameter('access_token');
	var tempo = convertPaceToTempo(paceSelection);

  $.when( 
      $.ajax({
        url: 'https://api.spotify.com/v1/recommendations',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        data: {
          "limit" : 100,
          "seed_genres": genre_seeds[genreSelection].join(),
          "min_tempo" : tempo.min,
          "max_tempo" : tempo.max,
          "target_popularity": 80
        }
      }),
      $.ajax({
        url: 'https://api.spotify.com/v1/recommendations',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        data: {
          "limit" : 100,
          "seed_genres": genre_seeds[genreSelection].join(),
          "min_tempo" : tempo.min * 2,
          "max_tempo" : tempo.max * 2
        }
      })
  ).done(function(halfBPMResponse, fullBPMResponse) {
      var tracks = halfBPMResponse[0].tracks.concat(fullBPMResponse[0].tracks);
      var playlist = createPlaylist(playlistName, paceSelection, runLengthSelection, genreSelection, tracks); 
      completion(playlist);
  });
}

var userID = "";

//get user info from spotify
function loadUser() {
    var access_token = getUrlParameter('access_token');
	$.ajax({
    	url: 'https://api.spotify.com/v1/me',
    	headers: {
      		'Authorization': 'Bearer ' + access_token
    	},
    	success: function(response) {
        console.log(response.images[0].url);
      		$('#avatar-img').attr('src', response.images[0].url);
          userID = response.id;
    	}
	});
}

function convertMillisecondsToString(milliseconds){
    var seconds = parseInt((milliseconds/1000)%60), 
        minutes = parseInt((milliseconds/(1000*60))%60),
        hours = parseInt((milliseconds/(1000*60*60))%24);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    hours = (hours < 10) ? "0" + hours : hours;

    if (hours != 0) {
      return hours + ":" + minutes + ":" + seconds
    } else {
      return minutes + ":" + seconds;
    }

    
}

function showPlaylist(playlist) {
  $(".playlist-img").attr("src", playlist.backgroundImage);
  $("#slider-playlist-name").html(playlist.name);
  $("#slider-pace").html("Pace: " + playlist.pace);
  $("#slider-length").html("Length: " + playlist.length);
  $("#slider-genre").html("Genre: " + playlist.genre);
  $("#total-time").html(convertMillisecondsToString(playlist.duration));
  $("#num-songs").html(playlist.tracks.length + " songs");
  $("#slider-table .song-row").empty();
  $('.song-row').remove();

  for (var i = 0; i < playlist.tracks.length; i++) {
    var track = playlist.tracks[i];
    var row = $("<tr>");
    row.addClass("row");
    row.addClass("song-row");
    row.append("<td><a target='_blank' href='" + track.external_urls.spotify + "'>" + track.name + "</a></td>");
    row.append("<td><a target='_blank' href='" + track.external_urls.spotify + "'>" + track.artists.map(function(artist){return artist.name}).join(", ") + "</a></td>");
    row.append("<td><a target='_blank' href='" + track.external_urls.spotify + "'>" + track.album.name + "</a></td>");
    row.append("<td>" + convertMillisecondsToString(track.duration_ms) + "</td>");
    $("#slider-table").append(row);
  }
  var access_token = getUrlParameter('access_token');
  $("#export-spotify-btn").on('click', function(){
    var playlistUrl = "";
    var createPlaylist = $.ajax({
      headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type' : 'application/json'
      },
      type: "POST",
      url: "https://api.spotify.com/v1/users/" + userID + "/playlists",
      data: JSON.stringify({
        name: playlist.name
      })
    });
    var done = createPlaylist.then(function(data) {
      playlistUrl = data.external_urls.spotify
      return $.ajax({
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        type: "POST",
        url: "https://api.spotify.com/v1/users/" + userID + "/playlists/" + data.id + "/tracks",
        data: JSON.stringify({
          uris: playlist.tracks.map(function(track){
            return track.uri;
          })
        })
      });
    });
    done.done(function(data){
      window.open(playlistUrl, "_blank");
    });
  });
}

$(document).ready(onDocumentReady);



