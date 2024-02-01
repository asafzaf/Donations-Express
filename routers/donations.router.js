const { Router } = require("express");
const { donationsController } = require("../controllers/donations.controller");
const { ServerError, NotFoundError, BadRequestError } = require("../errors/errors");
const donationsRouter = new Router();


donationsRouter
  .get("/records", donationsController.getAllDonations)
  .get("/items/:id", donationsController.getDonation)
  .post("/items", donationsController.createDonation)
  .put("/items/:id", donationsController.putDonation)
  .delete("/items/:id", donationsController.deleteDonation)
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
