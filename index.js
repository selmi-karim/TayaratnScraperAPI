// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var cors       = require('cors');
var urlParse = require('url');
var request = require("request");
var hibp = require('hibp');
var scrapeIt = require("scrape-it");





// configure body parser
app.use(bodyParser.json());

var port     = process.env.PORT || 5050; // set our port

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/details', cors(), function(request, response) {
     //console.log(response);
      var query = urlParse.parse(request.url, true).query;
      var pathname = urlParse.parse(request.url, true).pathname;
    if(query['q']!=null){
      var url = 'https://www.tayara.tn/fr/'+query['q'];
      details(url,function (res) {
      response.json(res);
        // body...
      });
        
  }else{
    response.json({ status : 'error' });
  }
  //response.send("welcome");

});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/search', cors(), function(request, response) {
     //console.log(response);
      var query = urlParse.parse(request.url, true).query;
      var pathname = urlParse.parse(request.url, true).pathname;
      console.log(query);
    //{ max: '100', min: '10', region: 'kairaoun', product: 'iphone' }
    if(query['max']!=null && query['min']!=null  && query['product']!=null &&
     query['region']!=null && parseInt(query['max'])>=parseInt(query['min'])){
    var url = 'https://www.tayara.tn/fr/'+query['region']+'/toutes_les_categories/%C3%A0_vendre/'+query['product']
    +'?spr='+query['min']+'&mpr='+query['max'];
    url.replace(' ','-');
    //console.log('url: '+url);
      search(url,function (res) {
        response.json(res);
        // body...
      });        
    }else{
    response.json({ status : 'error' });
    }
  //response.send("welcome");
});

function details(url,Callback) {
//Callback interface
scrapeIt(url, {
  
     title: ".clearfix h1"
    
    , time: ".item-info div time"
    , description: ".mdl-grid .body-text"
    , price: ".price span"
    , advertiser: ".name"
    , mobilephone: {
               selector: ".buttons"
             , how: "html"
           }
}, (err, page) => {
    //console.log(err || page);
    result = page;
    result['status']='success';
    result['advertiser'] = result['advertiser'].substring(result['advertiser'].length/2);
    var urlmobile = 'https://www.tayara.tn/phone/'+result['mobilephone'].match(/\d+/)[0]+'?type=text';
    getMobileNumber(urlmobile,function(response){
    result['mobilephone'] = response;
    Callback(result);
    });
    //console.log('mobile: '+result['mobilephone']);

    
});
}

function getMobileNumber(url,Callback){

  request(url,{timeout: 2000}, function(error, response, body) {
        if(error==null){
          var mobile = JSON.parse(body);
          Callback(mobile['phone']);
        }else{ 
          Callback('');
        }
      });
}

function search(url,Callback) {
//Callback interface
scrapeIt(url, {
    // Fetch the articles
    articles: {
        listItem: "article"
      , data: {
 
            // Get the article date and convert it into a Date object
            price: {
                selector: ".item-info-container div span "
            }
       
        ,link :{selector : "a", attr: "href"}
   
 
            // Get the title
          , title: "h2"
 
      , image: {
            selector: " img "
              , attr: "data-blazy"
            }  
        }    
      }
     
 
 
 
   
}, (err, page) => {
    //console.log(err || page);
    result = page;
    result['status']='success';
    Callback(result);
});
}

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
