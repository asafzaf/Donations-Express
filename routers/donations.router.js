const { Router } = require("express");
const donationsController = require("../controllers/donations.controller");
const { ServerError, NotFoundError, BadRequestError } = require("../errors/errors");
const donationsRouter = new Router();

const donationsControllerInstance = new donationsController();

donationsRouter
  .get("/records", donationsControllerInstance.getAllDonations)
  .get("/items/:id", donationsControllerInstance.getDonation)
  .post("/items", donationsControllerInstance.createDonation)
  .put("/items/:id", donationsControllerInstance.putDonation)
  .delete("/items/:id", donationsControllerInstance.deleteDonation)
  .all("*", (req, res, next) => {
    const error = new NotFoundError(req.originalUrl);
    next(error);
  });

  donationsRouter.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.name = err.name || "error";
  
    res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
    });
  });

module.exports = { donationsRouter };
