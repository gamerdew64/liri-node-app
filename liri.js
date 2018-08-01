// the ./ tells JS to look in the current folder for the file.
var keys = require('./keys.js');

// fs is a core Node package for reading and writing files
var fs = require("fs");

// console.log(keys);
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var spotify = new Spotify(keys.spotify);

var getMyTweets = function() {

  // var client = new Twitter(keys.twitter);
  var client = new Twitter(keys.twitterKeys);

  // var params = {screen_name: 'nodejs'};
  var params = {screen_name: 'devUserAPI'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for(var i=0; i<tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log(' ');
        console.log(tweets[i].text);
      }
    }
  });
};

var getArtistNames = function(artist) {
  return artist.name;
};

var getMeSpotify = function(songName) {
  spotify.search({ type: 'track', query: songName }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      // console.log(data);
      // console.log(data.tracks.items[0]);
      var songs = data.tracks.items;
      for(var i=0; i<songs.length; i++){
        console.log(i+1);
        console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
        console.log('song name: ' + songs[i].name);
        console.log('preview song: ' + songs[i].preview_url);
        console.log('album ' + songs[i].album.name);
        console.log('\n##################################################\n');
      }
  });
};

var getMeMovie = function(movieName){
  request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&apikey=trilogy', function (error, response, body) {
    // Print the error if one occurred
    console.log('error:', error);
    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body); // Print the HTML for the above URL.
    var jsonData = JSON.parse(body);
    console.log("#######################################\n" + 'Title: ' + jsonData.Title);
    console.log('Year: ' + jsonData.Year);
    console.log('Rated: ' + jsonData.Rated);
    console.log('IMDB Rating: ' + jsonData.imdbRating);
    console.log('Country: ' + jsonData.Country);
    console.log('Language: ' + jsonData.Language);
    console.log('Plot: ' + jsonData.Plot);
    console.log('Actors: ' + jsonData.Actors);
    console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
    console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL + "\n#######################################");
  });
};

var doWhatItSays = function(){
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;
    // console.log(data);
    var dataArr = data.split(',');
    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1){
      pick(dataArr[0]);
    }
  });
};

var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets' :
      getMyTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
    console.log('LIRI does not understand...');
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
