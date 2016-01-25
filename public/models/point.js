/**
 * Created by Kody on 1/19/2016.
 */
var mongoose = require('mongoose');

var pointSchema = new mongoose.Schema({
    lat: {type: Number, required: true},
    lng: {type: Number, required: true}
});

var Point = mongoose.model('Point', pointSchema);

module.exports = Point;