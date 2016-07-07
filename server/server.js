var express = require('express');
var app = express();
var apiKeys = require('./apiKeys.js');
var routes = require('./routes');
var Twit = require('twit');
var sampleKeys = require('./sampleKeys.js');
var axios = require('axios');
app.use(express.static('./client'));

var port = process.env.PORT || 3000;


var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY || apiKeys.keys.consumer_key,
  consumer_secret:      process.env.CONSUMER_SECRET || apiKeys.keys.consumer_secret,
  access_token:         process.env.ACCESS_TOKEN || apiKeys.keys.access_token,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET || apiKeys.keys.access_token_secret,
  timeout_ms:           60*1000
})

var googleKey = process.env.GOOGLE_API_KEY || apiKeys.keys.google_api_key;

var googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var urlKey = '&key=';
var searchTweets = 'search/tweets';
var count = 25;
var search, location, lat, long, geocode;

app.get('/results', function (req, res) {
  search = req.headers.keyword;
  location = req.headers.location.split(' ').join('+');
  
  axios.get(googleUrl + location + urlKey + googleKey)
  .then(function(response) {
    lat = response.data.results[0].geometry.location.lat;
    lng = response.data.results[0].geometry.location.lng;
    geocode = lat + ',' + lng + ',5mi';
    
    T.get(searchTweets, {q: search, count: count, geocode: geocode}, function(error, data, response){
    })
    .then(function(data) {
          res.send(data);
    });
  })
});

app.listen(port, function() {
  console.log('Listening on ' + port);
});