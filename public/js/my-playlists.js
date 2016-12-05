
function myPlaylists() {
	var newPlaylist = getUrlParameter("new-playlist");
	if (newPlaylist == "true") {
		console.log('hello nick');
		$("#create-playlist-modal").modal();
	}
};

$(document).ready(myPlaylists);
