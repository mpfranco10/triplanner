const fs = require('fs');
var path = require('path');


function read(archivo, callback) {
    var sampleTxt = path.join(__dirname, archivo);
    fs.exists(sampleTxt, function (fileok) {
        if (fileok) fs.readFile(sampleTxt, function (error, data) {
            callback(JSON.parse(data));
        });
        else console.log("file not found");
    });
}

exports.read = read;