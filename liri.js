require('dotenv').config();
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);
const errorMessage = 'No data found.';


// The search results can erroneously be an empty array or a string depending on the search
const badSearch = (results) => {
  if (results == false || typeof results === 'string') {
    return true;
  }
};

// Search Bands in Town Artist Events API for an artist and display certain event information
const commConcert = (searchInput) => {
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
};

// Search Spotify API for a song and display certain information
const commSpotify = (searchInput) => {
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
          let songPreview = searchData[i].preview_url;
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
};

// Search OMDB API for a movie and display certain information
const commMovie = (searchInput) => {
  if (searchInput === '') {
    // Defaults to "Mr. Nobody" if no movie is provided
    searchInput = 'Mr. Nobody';
  }
  axios.get('http://www.omdbapi.com/?t=' + searchInput + '&y=&plot=full&tomatoes=true&apikey=trilogy')
      .then((response) => {
        // Received response from query
        const searchData = response.data;
        if (searchData.Response === 'False') {
          console.log(errorMessage);
          return;
        }
        console.log('Title: ' + searchData.Title);
        console.log('Year: ' + searchData.Year);
        console.log('IMDB rating: ' + searchData.imdbRating);
        let movieRottenTomRating = 'unavailable';
        if (searchData.Ratings.length > 1) {
          movieRottenTomRating = searchData.Ratings[1].Value;
        }
        console.log('Rotten Tomatoes rating: ' + movieRottenTomRating);
        console.log('Country: ' + searchData.Country);
        console.log('Language: ' + searchData.Language);
        console.log('Plot: ' + searchData.Plot);
        console.log('Actors: ' + searchData.Actors);
      })
      .catch((err) => {
        console.log(errorMessage);
        return;
      });
};

// Call one of LIRI's commands using the text inside of random.txt
const commDoIt = () => {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(errorMessage);
      return;
    }
    const searchData = data.split(',');
    if (searchData[0] !== 'do-what-it-says') {
      // Avoiding an infinite loop
      if (searchData.length === 2) {
        // There must be exactly two arguments
        executeCommand(searchData[0], searchData[1]);
      } else {
        console.log('Invalid data in text file.');
      }
    } else {
      console.log('Invalid data in text file.');
    }
  });
};

// Determine which command is executed
const executeCommand = (commandName, commandArg) => {
  switch (commandName) {
    case 'concert-this':
      commConcert(commandArg);
      break;
    case 'spotify-this-song':
      commSpotify(commandArg);
      break;
    case 'movie-this':
      commMovie(commandArg);
      break;
    case 'do-what-it-says':
      commDoIt();
      break;
    default:
      console.log('Invalid command.');
  }
};


// MAIN PROCESS
executeCommand(process.argv[2], process.argv.slice(3).join(' '));
