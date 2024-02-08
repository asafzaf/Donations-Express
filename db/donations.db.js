const mongoose = require("mongoose");
const EventEmmiter = require("events");
const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_NAME,
  NODE_ENV,
} = require("../constants");
const connectionUrl = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

module.exports = class MongoDB extends EventEmmiter {
  constructor() {
    super();
    this.Model = require("../models/donations.model");
    this.connectDB();
  }
  connectDB() {
    mongoose
      .connect(connectionUrl)
      .then(() => {
        NODE_ENV == "test" ? null : console.log("Connected to MongoDB");
      })
      .catch((error) => {
        NODE_ENV == "test"
          ? null
          : console.error("Error connecting to MongoDB:", error);
      });
  }

  find() {
    return this.Model.find({});
  }

  findById(id) {
    return this.Model.findById(id);
  }

  create(data) {
    const donation = new this.Model(data);
    donation.save();
    return donation;
  }

  put(id, data) {
    return this.Model.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return this.Model.findByIdAndDelete(id);
  }
};
