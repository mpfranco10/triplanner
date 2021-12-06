var express = require('express');
var router = express.Router();
const Mongolib = require("../db/MongolibShoppingLists");

/* GET home page. */
router.get('/', function (req, res, next) {
    Mongolib.getDatabase(db => {
        Mongolib.findDocuments(db, docs => {
            res.send(docs);
        })
    })
});

router.post('/', function (req, res, next) {
    Mongolib.getDatabase(db => {
        Mongolib.insertDocuments(db, data => {
            res.send(req.body);
        }, req.body)
    });
});

// by trip id
router.get('/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;

    Mongolib.getDatabase(db => {
        Mongolib.findDocumentsById(db, docs => {
            res.send(docs);
        }, id)
    })

});

router.put('/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;


    Mongolib.getDatabase(db => {
        Mongolib.updateDocument(db, docs => {
            res.send(docs);
        }, id, req.body)
    })


});

router.delete('/:id', function (req, res) {

    // Permite obtener el parámetro indicado en el path
    var id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.removeDocument(db, docs => {
            res.send(docs);
        }, id)
    })

});

module.exports = router;