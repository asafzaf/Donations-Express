const mongoose = require("mongoose");
const EventEmmiter = require("events");
const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

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
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
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
    return this.Model.findByIdAndUpdate( id , data, {new: true});
  }
  delete(id) {
    return this.Model.findByIdAndDelete(id);
  }
};
