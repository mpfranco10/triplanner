var express = require('express');
var router = express.Router();
const axios = require('axios').default;

const BATTUTA_KEY = "3afed094cf07b9b7aaccd056881e4269";

/* GET users listing. */
router.get('/', function (req, res, next) {
  axios.get('http://battuta.medunes.net/api/country/all/?key=' + BATTUTA_KEY, //proxy uri
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }).then(resp => {
      res.send(resp.data);
    });
});

router.get('/:countryCode/:cityHint', function (req, res, next) {
  axios.get('http://battuta.medunes.net/api/city/' + req.params.countryCode + '/search/?city=' + req.params.cityHint + '&key=' + BATTUTA_KEY, //proxy uri
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }).then(resp => {
      res.send(resp.data);
    });
});


module.exports = router;
