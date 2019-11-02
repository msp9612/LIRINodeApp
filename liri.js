require('dotenv').config();

const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);

switch (process.argv[2]) {
  case 'concert-this':
    const axios = require('axios');
    axios.get('https://rest.bandsintown.com/artists/' +
    process.argv[3] + '/events?app_id=codingbootcamp')// slice
        .then((response) => {
          // console.log('The movie\'s rating is: ' + response.data.imdbRating);
          console.log(response);
        });
    break;

  case 'spotify-this-song':

    break;

  case 'movie-this':

    break;

  case 'do-what-it-says':

    break;

  default:
    console.log('Invalid command');
}
