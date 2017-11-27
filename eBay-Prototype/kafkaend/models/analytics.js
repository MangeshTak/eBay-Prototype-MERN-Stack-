var mongoose = require("mongoose");

var analyticsSchema = new mongoose.Schema({
  results: {}
});

module.exports = mongoose.model('analytics', analyticsSchema);
