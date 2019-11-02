// Imports
require('dotenv').config();
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs.realpath');

const spotify = new Spotify(keys.spotify);


// Switch statement determines which command is executed
switch (process.argv[2]) {
  /**
   * 'concert-this':
   * Search Bands in Town Artist Events API for an artist and display certain information
   */
  case 'concert-this':
    artistInput = process.argv.slice(3).join(' ');
    axios.get('https://rest.bandsintown.com/artists/' + artistInput + '/events?app_id=codingbootcamp')
        .then((response) => {
          // Received response from query
          const searchData = response.data;
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
          // No data found or other error occurred
          console.log('No data found.');
          return;
        });
    break;

  /**
   * 'spotify-this-song':
   * Search Spotify API for a song and display certain information
   */
  case 'spotify-this-song':
    songInput = process.argv.slice(3).join(' ');
    if (songInput === '') {
      // Defaults to "The Sign" by Ace of Base if no song is provided
      songInput = 'The Sign';
    }
    spotify.search({type: 'track', query: songInput})
        .then((response) => {
          // Received response from query
          const searchData = response.tracks.items;
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
          console.log(err);
          // No data found or other error occurred
          console.log('No data found.');
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
