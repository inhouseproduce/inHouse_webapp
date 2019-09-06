// this defines the mongoDB schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Sites = new Schema({
  sites_name: {
    type: String,
    unique: true
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

let Stacks = new Schema({
  stack_createdat: {
    type: Date
  },
  stack_name: { type: String },
  stack_sitesystemid: {
    type: String
  }
});

let Sitesystems_timer = new Schema({
  start_time: { type: String },
  duration: { type: Number },
  status: { type: String },
  characteristic: { type: String }
});

let Sitesystems = new Schema({
  sitesystem_siteid: { type: Schema.Types.String, ref: "Sites.sites_name" },
  sitesystem_createdat: {
    type: Date
  },
  sitesystem_updatedat: {
    type: Date
  },
  sitesystem_ph: {
    type: String
  },
  sitesystem_name: { type: String },
  sitesystem_hardwareid: { type: String, unique: true },
  sitesystem_ec: { type: String },
  sitesystem_temp: { type: String },
  sitesystem_humidity: { type: String },
  sitesystem_dissolved_oxygen: { type: String },
  sitesystem_co2: { type: String },
  sitesystem_timers: { type: [Sitesystems_timer] }
});

let Modules = new Schema({
  module_cropname: {
    type: String
  },
  module_imageurl: {
    type: String
  },
  module_cameranum: {
    type: String
  },
  module_updatedat: {
    type: Date
  },
  module_createdat: {
    type: Date
  },
  module_stackid: { type: String },
  module_name: { type: String }
});

module.exports = {
  Sites: mongoose.model("Sites", Sites),
  Sitesystems: mongoose.model("Sitesystem", Sitesystems),
  Stacks: mongoose.model("Stacks", Stacks),
  Modules: mongoose.model("Modules", Modules)
};
