// the ./ tells JS to look in the current folder for the file.
var keys = require('./keys.js');
// fs is a core Node package for reading and writing files
var fs = require("fs");

// The following console.log was added to verify that the keys are showing in the console, and are being properly pulled
// console.log(keys);

// When Node invokes that require() function Node goes through the following sequence of steps:
  // Resolving: To find the absolute path of the file.
  // Loading: To determine the type of the file content.
  // Wrapping: To give the file its private scope. This is what makes both the require and module objects local to every file we require.
  // Evaluating: This is what the VM eventually does with the loaded code.
  // Caching: So that when we require this file again, we don’t go over all the steps another time.
// The following three lines are three new variables that are assigned to their own require functions.
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
// At the moment, it would probably be more efficient to place this line inside the spotify function (like I did with the twitter one), but I decided to place it in the global scope for now in case I would like to pull from this same var in later version, making the process easier.
// Loading the spotify keys from the keys file
var spotify = new Spotify(keys.spotify);
// This is the function that takes the tweets and dumps them to the console
var pullTweets = function() {
  // Creating a new variable that stores the keys from the keys file so that the tweets can get pulled
  var twitterUser = new Twitter(keys.twitter);
  // Assigning our twitter screen name/username to a new varible called "twitterHandle"
  var twitterHandle = {screen_name: 'devUserAPI'};
  // Loading the data from the server using the .get() request
  twitterUser.get('statuses/user_timeline', twitterHandle, function(error, tweets, response) {
    // If there are no errors, do the following:
    if (!error) {

      // The following console log line is for testing whether or not tweets show in the console.
      // console.log(tweets);

      // setting i to 0 and going through the length of the array, incrementing i each time
      for(var i=0; i<tweets.length; i++) {
        // Logging the twitter creation timestamp to the console
        console.log(tweets[i].created_at);
        // Adding a break between each tweet section (tweet and timecode)
        console.log(' ');
        // Logging the text of the tweet to the console
        console.log(tweets[i].text);
      } // Closing the for loop
    } // Closing the if statement
  }); // Closing the .get() method
}; // Closing the pullTweets function

// Creating a fuction and assigning it to the new pullArtist variable
var pullArtist = function(artist) {
  // returning the name of the artist
  return artist.name;
};
// This is the function that takes the song name (from user) and dumps the matching results to the console
var pullSpotify = function(songName) {
  // Searching to find the song name or "track"
  spotify.search({ type: 'track', query: songName }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }

      // Following two lines were for testing output
      // console.log(data);
      // console.log(data.tracks.items[0]);

      // Creating a new variable that that contains the data.tracks.items information
      var songs = data.tracks.items;
      // setting i to 0 and going through the length of the array, incrementing i each time
      for(var i=0; i<songs.length; i++){
        // This console log adjusts the numbering in the output. Instead of counting 0 to 19, it counts 1 to 20
        console.log(i+1);
        // This line involves me using a method that we have not yet discussed.
        // The map() method creates a new array with the results of calling a provided function on every element in the calling array.
        // Logging the name of the artist
        console.log('artist(s): ' + songs[i].artists.map(pullArtist));
        // Logging the song name
        console.log('song name: ' + songs[i].name);
        // Logging the preview of the song
        console.log('preview song: ' + songs[i].preview_url);
        // Logging the name of the album
        console.log('album ' + songs[i].album.name);
        // Adding text to help divide the responses
        console.log('\n##################################################\n');
      } // Closing the for loop
  }); // Closing spotify.search()
}; // Closing the pullSpotify function

var pullMovie = function(movieName){
  request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&apikey=trilogy', function (error, response, body) {
    // Print the error if one occurred
    console.log('error:', error);
    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body); // Print the HTML for the above URL.
    var jsonData = JSON.parse(body);

    // Including to test what all is included in the body of the OMBI API
    // console.log("#######################################\n" + "#######################################\n" + "#######################################\n" + body + "#######################################\n" + "#######################################\n" + "#######################################\n");

    // Logging the name of the movie to the console
    console.log("#######################################\n" + 'Title: ' + jsonData.Title);
    // Logging the year the movie was released to the console
    console.log('Year: ' + jsonData.Year);
    // Logging the rating (MPAA) of the movie to the console
    console.log('Rated: ' + jsonData.Rated);
    // Logging the runtime of the movie to the console
    console.log('Runtime: ' + jsonData.Runtime);
    // Logging the IMDB rating of the movie to the console
    console.log('IMDB Rating: ' + jsonData.imdbRating);
    // Logging the number of rating votes of the movie from IMDB to the console
    console.log('IMDB Rating Vote Number: ' + jsonData.imdbVotes);
    // Logging the country where the movie was released to the console
    console.log('Country: ' + jsonData.Country);
    // Logging the language of the movie to the console
    console.log('Language: ' + jsonData.Language);
    // Logging the plot of the movie to the console
    console.log('Plot: ' + jsonData.Plot);
    // Logging the actors of the movie to the console
    console.log('Actors: ' + jsonData.Actors);
    // Logging the metacritic score of the movie to the console
    console.log('Metacritic Score: ' + jsonData.Metascore + "\n#######################################");
    // The following two lines were originally supposed to be the Rotten tomatoes rating and URL, but they don't show up in the object, so I instead used the metacritic score and website above
    // console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
    // console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL + "\n#######################################");
  });
};

var runRandom = function(){
  // Read the random text file
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;
    // The next line is done for testing purposes
    // console.log(data);
    var randomTxtArray = data.split(',');
    if (randomTxtArray.length == 2) {
      userChoice(randomTxtArray[0], randomTxtArray[1]);
    } else if (randomTxtArray.length == 1){
      userChoice(randomTxtArray[0]);
    } // Closing else if
  }); // Closing fs.readFile()
}; // Closing runRandom function

// This is a function that uses a switch-case statement instead of an if else statement to more efficiently direct which function runs (based off the text that the user inputs)
var userChoice = function(caseData, functionData) {
  switch(caseData) {
    // If this case is met, call the twitter function
    case 'my-tweets' :
      pullTweets();
      break;
    // If this case is met, call the spotify function
    case 'spotify-this-song':
      pullSpotify(functionData);
      break;
    // If this case is met, call the movie function
    case 'movie-this':
      pullMovie(functionData);
      break;
    // If this case is met, call the random text function
    case 'do-what-it-says':
      runRandom();
      break;
    default:
    console.log('LIRI does not understand...');
  }
};

// Creating a runThis function that takes in two arguments which, when called will be the two user inputs after typing node liri.js in the console
var runThis = function(argOne, argTwo) {
  userChoice(argOne, argTwo);
};

// Calling the runThis function, and passing in the two user inputs (process.argv for indexes 2 and 3) into argOne and argTwo
runThis(process.argv[2], process.argv[3]);
