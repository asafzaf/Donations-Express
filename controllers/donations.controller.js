const { Donation } = require("../models/donations.model");
const EventEmmiter = require("events");
const {
  ServerError,
  NotFoundError,
  BadRequestError,
} = require("../errors/errors");
const DonationsRepository = require("../repositories/donations.repository");

const donationsRepository = new DonationsRepository();

module.exports = class donationsController extends EventEmmiter {
  constructor() {
    super();
    this.hello = "hello world";
  }

  getAllDonations = async (req, res) => {
    try {
      const donations = await donationsRepository.find();
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
  };

  getDonation = async (req, res) => {
    try {
      if (
        req.params.id === null ||
        req.params.id === undefined ||
        req.params.id === "" ||
        req.params.id === " "
      ) {
        throw new BadRequestError("id");
      }
      const donation = await donationsRepository.retrieve(req.params.id);
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
      if (error.name === "TypeError") {
        error = new BadRequestError("id");
      } else {
        error = new ServerError("getOne");
      }
      res.status(error.statusCode).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  createDonation = async (req, res) => {
    try {
      const newDonation = await donationsRepository.create(req.body);
      res.status(201).json({
        message: "Donation created successfully",
        status: "success",
        data: {
          donation: newDonation,
        },
      });
    } catch (error) {
      const err = new BadRequestError("params");
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
      });
    }
  };

  putDonation = async (req, res) => {
    try {
      const donation = await donationsRepository.put(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!donation) {
        throw new NotFoundError("Donation");
      }
      res.status(200).json({
        message: "Donation updated successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      if (error.name === "CastError") {
        error = new BadRequestError("id");
      } else {
        error = new ServerError("put");
      }
      res.status(error.statusCode).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  deleteDonation = async (req, res) => {
    try {
      if (
        req.params.id === null ||
        req.params.id === undefined ||
        req.params.id === "" ||
        req.params.id === " "
      ) {

        throw new BadRequestError("id");
      }

      const donation = await donationsRepository.delete(req.params.id);
      if (!donation) {
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
  };
};
