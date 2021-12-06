var express = require('express');
var router = express.Router();
const Mongolib = require("../db/MongolibPlaces");
const MongolibEvents = require("../db/MongolibEvents");
const MongolibShop = require("../db/MongolibShoppingLists");


// by trip id
router.get('/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;

    Mongolib.getDatabase(db => {
        Mongolib.findDocumentsById(db, places => {
            var numOfPlaces = places.length;
            MongolibEvents.getDatabase(db => {
                MongolibEvents.findDocumentsById(db, events => {
                    var numOfEvents = events.length;
                    MongolibShop.getDatabase(db => {
                        MongolibShop.findDocumentsById(db, lists => {
                            var numOfObjects = lists[0].beforeList.length + lists[0].afterList.length ;
                            var docs = {places: numOfPlaces, events: numOfEvents, objects: numOfObjects};
                            res.send(docs);
                        }, id)
                    })


                }, id)
            })
        }, id)
    })

});


module.exports = router;