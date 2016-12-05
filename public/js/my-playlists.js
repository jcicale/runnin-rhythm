
function myPlaylists() {
	var newPlaylist = getUrlParameter("new-playlist");
	if (newPlaylist == "true") {
		$("#create-playlist-modal").modal();
	}
	$("#new-playlist").attr("href", "#");
	$("#new-playlist").on("click", function(){
		$("#create-playlist-modal").modal();
	})
};

$(document).ready(myPlaylists);
