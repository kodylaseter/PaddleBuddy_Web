/**
 * Created by Kody on 1/19/2016.
 */
var mongoose = require('mongoose');

var riverSchema = new mongoose.Schema({
    name: {type: Number, required: true}
});

var River = mongoose.model('River', riverSchema);

module.exports = River;