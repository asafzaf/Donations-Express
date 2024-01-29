const { Router } = require("express");
const { donationsController } = require("../controllers/donations.controller");
const donationsRouter = new Router();

donationsRouter
  .get("/records", donationsController.getAllDonations)
  .get("/items/:id", donationsController.getDonation)
  .post("/items", donationsController.createDonation)
  .put("/items/:id", donationsController.putDonation)
  .delete("/items/:id", donationsController.deleteDonation)
  .all("/items", (req, res) => {
    res.status(404).send("Not Found");
  });

module.exports = { donationsRouter };
