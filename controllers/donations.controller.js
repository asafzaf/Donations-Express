const { Donation } = require("../models/donations.model");
const EventEmmiter = require("events");
const { ServerError, NotFoundError, BadRequestError } = require("../errors/errors");


exports.donationsController = {
  getAllDonations: async (req, res) => {
    try {
      const donations = await Donation.find();
      res.status(200).json({
        message: "Donations retrieved successfully",
        status: "success",
        results: donations.length,
        data: {
          donations,
        },
      });
    } catch (error) {
      const err = new ServerError("getAll");
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  getDonation: async (req, res) => {
    try {
      if (req.params.id === null || req.params.id === undefined || req.params.id === "" || req.params.id === " "){
        console.log("id is null");
        throw new BadRequestError("id");
      }
      console.log("id is not null");
      const donation = await Donation.findById(req.params.id);
      if (!donation) {
        throw new NotFoundError("Donation");
      }
      res.status(200).json({
        message: "Donation retrieved successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      const err = new BadRequestError("id");
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  createDonation: (req, res) => {
    try {
      const newDonation = new Donation(req.body);
      newDonation.save().then(() => {
        res.status(201).json({
          message: "Donation created successfully",
          status: "success",
          data: {
            donation: newDonation,
          },
        });
      });
    } catch (error) {
      const err = new BadRequestError("params");
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  putDonation: async (req, res) => {
    try {
      const donation = await Donation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(200).json({
        message: "Donation updated successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      const err = new BadRequestError("params");
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  deleteDonation: async (req, res) => {
    try {
      if (req.params.id === null || req.params.id === undefined || req.params.id === "" || req.params.id === " "){
        console.log("id is null");
        throw new BadRequestError("id");
      }
      console.log("donation 1");
      const donation = await Donation.findByIdAndDelete(req.params.id);
      console.log("donation 2");
      if (!donation) {
        console.log("donation is null");
        throw new NotFoundError("Donation");
      }
      res.status(204).json({
        message: "Donation deleted successfully",
        status: "success",
        data: null,
      });
    } catch (error) {
      if (error.name === "CastError") {
        error = new BadRequestError("id");
      }
      res.status(error.statusCode).json({
        name: error.name,
        message: error.message,
      });
    }
  },
};
