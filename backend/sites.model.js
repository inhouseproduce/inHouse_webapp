const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Sites = new Schema({
  sites_name: {
    type: String
  },
  sites_location: {
    type: String
  },
  sites_createdat: {
    type: Date
  },
  sites_updatedat: {
    type: Date
  }
});

module.exports = mongoose.model("Sites", Sites);
