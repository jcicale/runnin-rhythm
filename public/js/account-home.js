function loadPopularPlaylists() {
  for (var i = 0; i < popularPlaylists.length; i++) {
    addPlaylist(popularPlaylists[i]);
  }

};

$(document).ready(loadPopularPlaylists);






