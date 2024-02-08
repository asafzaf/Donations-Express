const MongoDB = require("../db/donations.db");
const db = new MongoDB();

module.exports = {
  find() {
    return db.find();
  },

  retrieve(id) {
    return db.findById(id);
  },

  create(data) {
    return db.create(data);
  },

  put(id, data) {
    return this.db.put(id, data);
  },

  delete(id) {
    return this.db.delete(id);
  },
};
