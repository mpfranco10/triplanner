const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = mongoUrl;
const reader = require("../db/readJSON");

const dbName = 'tripsDB';

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
    const collection = db.collection('trips');
    collection.find({}).toArray(function (err, docs) {
        console.log(docs);
        assert.equal(err, null);
        callback(docs);
    });
}

const findDocumentsById = function (db, callback, id) { //Esto para hacer GET individual
    const collection = db.collection('trips');
    collection.find({"id": id}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findSelectedTrip = function (db, callback) { 
    const collection = db.collection('trips');
    console.log(collection);
    collection.find({isSelected: true}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const insertDocuments = (db, callback, trip) => {
    const collection = db.collection('trips');
    collection.insertMany([trip], function (err, result) {
        console.log("Inserting document!")
        callback(result);
    });
}

const updateDocument = function(db, callback, id, trip) {
    // Get the documents collection
    const collection = db.collection('trips');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ id : id }
      , { $set: trip }, function(err, result) {
      assert.equal(err, null);
      console.log("Updated the document");
      callback(result.result);
    });  
}

const removeDocument = function(db, callback, id) {
    // Get the documents collection
    const collection = db.collection('trips');
    // Delete document where a is 3
    collection.deleteOne({ "id" : id }, function(err, result) {
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
  exports.findSelectedTrip = findSelectedTrip;