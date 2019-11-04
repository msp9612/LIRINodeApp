require('dotenv').config();
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs.realpath');

const spotify = new Spotify(keys.spotify);
const errorMessage = 'No data found.';
let searchInput = process.argv.slice(3).join(' ');


// Search results can erroneously be an empty array or a string depending on the search
const badSearch = (results) => {
  if (results == false || typeof results === 'string') {
    return true;
  }
};


// Switch statement determines which command is executed
switch (process.argv[2]) {
  /**
   * 'concert-this':
   * Search Bands in Town Artist Events API for an artist and display certain information
   */
  case 'concert-this':
    axios.get('https://rest.bandsintown.com/artists/' + searchInput + '/events?app_id=codingbootcamp')
        .then((response) => {
          // Received response from query
          const searchData = response.data;
          if (badSearch(searchData)) {
            console.log(errorMessage);
            return;
          }
          console.log('Concert data found:');
          for (let i = 0; i < searchData.length; i++) {
            const concert = searchData[i];
            console.log(
                concert.venue.name + ', ' +
                concert.venue.city + ', ' +
                (concert.venue.region || concert.venue.country || 'no region data found') + ', ' +
                moment(concert.datetime).format('MM/DD/YYYY')
            );
          }
        })
        .catch((err) => {
          console.log(errorMessage);
          return;
        });
    break;

  /**
   * 'spotify-this-song':
   * Search Spotify API for a song and display certain information
   */
  case 'spotify-this-song':
    searchInput = process.argv.slice(3).join(' ');
    if (searchInput === '') {
      // Defaults to "The Sign" by Ace of Base if no song is provided
      searchInput = 'The Sign';
    }
    spotify.search({type: 'track', query: searchInput})
        .then((response) => {
          // Received response from query
          const searchData = response.tracks.items;
          if (badSearch(searchData)) {
            console.log(errorMessage);
            return;
          }
          for (let i = 0; i < searchData.length; i++) {
            let songArtists = '';
            for (let k = 0; k < searchData[i].artists.length; k++) {
              songArtists += searchData[i].artists[k].name + ', ';
            }
            console.log('Artists(s): ' + songArtists.substring(0, songArtists.length - 2));
            console.log('Song name: ' + searchData[i].name);
            songPreview = searchData[i].preview_url;
            if (songPreview === null) {
              songPreview = 'unavailable';
            }
            console.log('Preview: ' + songPreview);
            console.log('Album name: ' + searchData[i].album.name);
            console.log('------------');
          }
        })
        .catch((err) => {
          console.log(errorMessage);
          return;
        });
    break;

  /**
   * 'movie-this':
   * x
   */
  case 'movie-this':

    break;

  /**
   * 'do-what-it-says':
   * x
   */
  case 'do-what-it-says':

    break;

  // Invalid command
  default:
    console.log('Invalid command');
}
