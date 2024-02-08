const { Router } = require("express");
const donationsController = require("../controllers/donations.controller");
const { NotFoundError } = require("../errors/errors");
const donationsRouter = new Router();

const donationsControllerInstance = new donationsController();

donationsRouter
  .get("/records", donationsControllerInstance.getAllDonations)
  .get("/items/:id", donationsControllerInstance.getDonation)
  .post("/items", donationsControllerInstance.createDonation)
  .put("/items/:id", donationsControllerInstance.putDonation)
  .delete("/items/:id", donationsControllerInstance.deleteDonation)
  .all("*", (req, res) => {
    const error = new NotFoundError(req.originalUrl);
    res.status(error.statusCode).json({
      name: error.name,
      message: error.message,
    });
  });

module.exports = { donationsRouter };
