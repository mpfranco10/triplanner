const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = mongoUrl;
const reader = require("./readJSON");
const MongolibTrips = require("../db/MongolibTrips");

const dbName = 'tripsDB';
const collectionName = 'userTrips';

const client = new MongoClient(url, { useUnifiedTopology: true });

/* reader.read("movies.json", data => {
    getDatabase(db => {
        const collection = db.collection('trips');
        collection.insertMany(data); //insertar el json leido
    })
}); */

const getDatabase = (callback) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        callback(db, client);
    });
}

const findDocuments = function (db, callback) { //Esto para hacer GET
    const collection = db.collection(collectionName);
    collection.find({}).toArray(function (err, docs) {
        console.log(docs);
        assert.equal(err, null);
        callback(docs);
    });
}

const findDocumentsById = function (db, callback, id) { //Esto para hacer GET individual
    const collection = db.collection(collectionName);
    try {
        collection.find({ "userId": id }).toArray(function (err, docs) {
            assert.equal(err, null);
            if (docs.length === 0 || docs === undefined) {
                callback(docs);
            }
            var trips = docs[0].trips;
            const collection = db.collection('trips');
            collection.find({id: {$in: trips}}).toArray(function (err, foundTrips) {
                assert.equal(err, null);
                docs[0].trips = foundTrips;
                callback(docs);
            });
        });
    } catch (error) {
        callback([]);
    }
}

const insertDocuments = (db, callback, trip) => {
    const collection = db.collection(collectionName);
    collection.insertOne(trip, function (err, result) {
        console.log("Inserting document!")
        callback(result);
    });
}

const updateDocument = function (db, callback, tripId, event) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Update document where a is 2, set b equal to 1
    console.log(event);
    collection.updateOne({ "userId": tripId }
        , { $set: event }, function (err, result) {
            assert.equal(err, null);
            console.log("Updated the document");
            callback(result.result);
        });
}

const removeDocument = function (db, callback, tripId) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Delete document where a is 3
    collection.deleteOne({ "userId": tripId }, function (err, result) {
        console.log("Removed the document");
        callback(result.result);
    });
}

exports.getDatabase = getDatabase;
exports.findDocuments = findDocuments;
exports.insertDocuments = insertDocuments;
exports.findDocumentsById = findDocumentsById;
exports.updateDocument = updateDocument;
exports.removeDocument = removeDocument;