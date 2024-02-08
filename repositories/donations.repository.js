const MongoDB = require("../db/donations.db");

class DonationsRepository {
  constructor() {
    this.db = new MongoDB();
    this.db.connectDB();
  }

  find() {
    return this.db.find();
  }

  retrieve(id) {
    return this.db.findById(id);
  }

  create(data) {
    return this.db.create(data);
  }

  put(id, data) {
    return this.db.put(id, data);
  }

  delete(id) {
    return this.db.delete(id);
  }
}

module.exports = DonationsRepository;
