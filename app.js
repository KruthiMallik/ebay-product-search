const express = require('express')
//const api_helper = require('./API_helper')
const app = express()
const port = process.env.PORT ||8081;
var http=require('http');
var url= require('url');
var https= require('https');
var request = require('request');


app.get('/getProducts', function (req, res)
{
  var params = url.parse(req.url, true).query;
  console.log(params);
  var urls = url.parse(req.url, true);
  var text = urls.search;
  var texts =text.slice(1);
  console.log(texts);
  res.setHeader("Content-Type","text/plain");
  res.setHeader("Access-Control-Allow-Origin","*");
  var url_text='http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=KruthiMa-products-PRD-655b67044-47aae31b&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&'+texts;
  console.log(url_text);
  url_text+='&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
  http.get(url_text, function(res2){
    var body = '';

    res2.on('data', function(data1){
        body += data1;
    });

    res2.on('end', function(){
        var Response = JSON.parse(body);
        console.log("Got a response: ", Response);
        return res.send(Response);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});


});

app.get('/getitems', function (req, res)
{
  //var url_text = url.parse(req.url, true).query;
  var params = url.parse(req.url, true).query;
  console.log(params);
  var urls = url.parse(req.url, true);
  var text = urls.search;
  var texts =text.slice(1);
  console.log(texts);
  res.setHeader("Content-Type","text/plain");
  res.setHeader("Access-Control-Allow-Origin","*");
  var url_text = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KruthiMa-products-PRD-655b67044-47aae31b&siteid=0&version=967&'+texts+'&IncludeSelector=Description,Details,ItemSpecifics';
  console.log(url_text);
  http.get(url_text, function(res2){
    var body = '';

    res2.on('data', function(data1){
        body += data1;
    });

    res2.on('end', function(){
        var Response = JSON.parse(body);
        console.log("Got a response: ", Response);
        return res.send(body);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

});
// 008448930082886718236:bjhd1_eg4ya
//https://www.googleapis.com/customsearch/v1?q=Apple&cx=008448930082886718236:bjhd1_eg4ya&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyDFWOrt9LLUtdacv388sXrRqLekx1aY6uE
//app.get('/photos')
app.get('/photos', function (req, res)
{
  var params = url.parse(req.url, true).query;
  console.log(params);
  var urls = url.parse(req.url, true);
  var text = urls.search;
  var texts =text.slice(1);
  console.log(texts);
  res.setHeader("Content-Type","text/plain");
  res.setHeader("Access-Control-Allow-Origin","*");
  var url_text = 'https://www.googleapis.com/customsearch/v1?'+texts+'&cx=008448930082886718236:bjhd1_eg4ya&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyDFWOrt9LLUtdacv388sXrRqLekx1aY6uE'
  console.log(url_text);
  https.get(url_text, function(res2){
    var body = '';

    res2.on('data', function(data1){
        body += data1;
    });

    res2.on('end', function(){
        var Response = JSON.parse(body);
        console.log("Got a response: ", Response);
        return res.send(body);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

});

app.get('/getsimilar', function (req, res)
{
  var params = url.parse(req.url, true).query;
  console.log(params);
  var urls = url.parse(req.url, true);
  var text = urls.search;
  var texts =text.slice(1);
  console.log(texts);
  res.setHeader("Content-Type","text/plain");
  res.setHeader("Access-Control-Allow-Origin","*");
  var url_text = 'http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=KruthiMa-products-PRD-655b67044-47aae31b&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&'+texts+"&maxResults=20";
  console.log(url_text);
  http.get(url_text, function(res2){
    var body = '';

    res2.on('data', function(data1){
        body += data1;
    });

    res2.on('end', function(){
        var Response = JSON.parse(body);
        console.log("Got a response: ", Response);
        return res.send(body);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

});

//http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=900&username=kruthima&country=US&maxRows=5
app.get('/auto', function (req, res)
{
  var params = url.parse(req.url, true).query;
  console.log(params);
  var urls = url.parse(req.url, true);
  var text = urls.search;
  var texts =text.slice(1);
  console.log(texts);
  res.setHeader("Content-Type","text/plain");
  res.setHeader("Access-Control-Allow-Origin","*");
  var url_text = 'http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith='+texts+'&username=kruthima&country=US&maxRows=5';
  console.log(url_text);
  http.get(url_text, function(res2){
    var body = '';

    res2.on('data', function(data1){
        body += data1;
    });

    res2.on('end', function(){
        var Response = JSON.parse(body);
        console.log("Got a response: ", Response);
        return res.send(body);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

});

app.listen(port, () => console.log(`App listening on port ${port}!`))
