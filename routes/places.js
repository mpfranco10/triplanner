var express = require('express');
var router = express.Router();
const Mongolib = require("../db/MongolibPlaces");

router.post('/', function (req, res, next) {
    Mongolib.getDatabase(db => {
        Mongolib.insertDocuments(db, data => {
            res.send(req.body);
        }, req.body)
    });
});

// Get all places of a trip
router.get('/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;

    Mongolib.getDatabase(db => {
        Mongolib.findDocumentsById(db, docs => {
            res.send(docs);
        }, id)
    })

});

router.put('/:tripId/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;
    var tripId = req.params.tripId;

    if (id == 'colors') {
        Mongolib.getDatabase(db => {
            Mongolib.deleteColors(db, docs => {
                res.send(docs);
            }, tripId)
        })
    } else {
        Mongolib.getDatabase(db => {
            Mongolib.updateDocument(db, docs => {
                res.send(docs);
            }, tripId, id, req.body)
        })
    }

});

router.delete('/:tripId/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;
    var tripId = req.params.tripId;

    Mongolib.getDatabase(db => {
        Mongolib.removeDocument(db, docs => {
            res.send(docs);
        }, tripId, id)
    })

});

module.exports = router;