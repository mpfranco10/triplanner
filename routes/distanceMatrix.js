var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const Mongolib = require("../db/MongolibDistances");

const GOOGLE_API_KEY = "AIzaSyDSymRKtpFQbaTLW8RovSLfZpjaD0WQow4";

/* GET distance matrix*/
router.get('/', function (req, res, next) {
  var origins = req.query.origins; //should be lat,lng
  var destinations = req.query.destinations; //shoud lbe lat,lng|lat,lng....
  var mode = req.query.mode; //mode ok

  var destArray = destinations.split('|');

  Mongolib.getDatabase(db => {
    Mongolib.findDocumentsById(db, docs => {
      if (docs.length > 0) { //we have destinations for this origin
        var results = new Array(destArray.length);
        var newDests = [];
        var newIndex = [];

        for (let i = 0; i < destArray.length; i++) { //search for each destination
          var dest = destArray[i];
          var foundIndex = docs.findIndex(x => x.dest === dest && x.mode === mode);
          if (foundIndex != -1) { //found something
            results[i] = docs[foundIndex];
            console.log("found " + i + " loc " + dest);
          } else { //have to look for it
            newDests.push(dest);
            newIndex.push(i);
            console.log("have to look " + i + " loc " + dest);
          }

        }

        if (newDests.length > 0) { //we have to complete the list
          var newDestString = newDests.join('|');

          const params = {
            origins: origins,
            destinations: newDestString,
            key: GOOGLE_API_KEY,
            language: "es",
            mode: mode,
          };

          console.log(params);

          axios.get('https://maps.googleapis.com/maps/api/distancematrix/json',
            { params },
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            }).then(resp => {
              var resultsResp = resp.data.rows[0].elements; //array of results
              var destDoc = [];
              for (let i = 0; i < resultsResp.length; i++) {
                var result = resultsResp[i];
                var dest = newDests[i];
                var indexToInsert = newIndex[i];
                var document = {
                  origin: origins,
                  dest: dest,
                  mode: mode,
                  result: result,
                };
                destDoc.push(document);
                results[indexToInsert] = document;
              }
              Mongolib.getDatabase(db => {
                Mongolib.insertDocuments(db, data => {
                  res.send(results);
                }, destDoc)
              });
            });

        } else { //already have everything
          res.send(results);
        }
      } else { //we have nothing
        const params = {
          origins: origins,
          destinations: destinations,
          key: GOOGLE_API_KEY,
          language: "es",
          mode: mode,
        };

        //console.log(params);

        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json',
          { params },
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }).then(resp => {
            var results = resp.data.rows[0].elements; //array of results
            var destDoc = [];
            for (let i = 0; i < results.length; i++) {
              var result = results[i];
              var dest = destArray[i];
              var document = {
                origin: origins,
                dest: dest,
                mode: mode,
                result: result,
              };
              destDoc.push(document);
            }
            Mongolib.getDatabase(db => {
              Mongolib.insertDocuments(db, data => {
                res.send(destDoc);
              }, destDoc)
            });
          });
      }
    }, origins)
  })

});



module.exports = router;
