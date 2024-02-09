const EventEmmiter = require("events");
const {
  ServerError,
  NotFoundError,
  BadRequestError,
} = require("../errors/errors");
const donationsRepository = require("../repositories/donations.repository");

module.exports = class donationsController extends EventEmmiter {
  constructor() {
    super();
  }

  getAllDonations = async (req, res) => {
    try {
      const donations = await donationsRepository.find();
      if (!donations || Object.keys(donations).length === 0) {
        throw new NotFoundError("Donations");
      }
      return res.status(200).json({
        message: "Donations retrieved successfully",
        status: "success",
        results: donations.length,
        data: {
          donations,
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  getDonation = async (req, res) => {
    const { id } = req.params;
    try {
      checkId(id);
      const donation = await donationsRepository.retrieve(req.params.id);
      if (!donation || Object.keys(donation).length === 0) {
        throw new NotFoundError(`Donation with id ${id}`);
      }
      return res.status(200).json({
        message: "Donation retrieved successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  createDonation = async (req, res) => {
    try {
      checkDonationsParams(req.body);
      const newDonation = await donationsRepository.create(req.body);
      if (!newDonation) {
        throw new ServerError("post");
      }
      return res.status(201).json({
        message: "Donation created successfully",
        status: "success",
        data: {
          donation: newDonation,
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  putDonation = async (req, res) => {
    try {
      checkDonationsParams(req.body);
      checkId(req.params.id);
      const donation = await donationsRepository.put(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!donation) {
        throw new NotFoundError("Donation");
      }
      return res.status(200).json({
        message: "Donation updated successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        name: error.name,
        message: error.message,
      });
    }
  };

  deleteDonation = async (req, res) => {
    try {
      checkId(req.params.id);
      const donation = await donationsRepository.delete(req.params.id);
      if (!donation) {
        throw new NotFoundError("Donation");
      }
      return res.status(204).json({
        message: "Donation deleted successfully",
        status: "success",
        data: null,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        name: error.name,
        message: error.message,
      });
    }
  };
};

const checkId = (id) => {
  if (
    id === null ||
    id === undefined ||
    id === "" ||
    id === " " ||
    id === 0 ||
    id === "0" ||
    id === ":id"
  ) {
    throw new BadRequestError("id");
  }
};

const checkDonationsParams = (body) => {
  if (body === null || body === undefined || Object.keys(body).length === 0) {
    throw new BadRequestError("params");
  } else if (
    body.name === null ||
    body.name === undefined ||
    body.name === "" ||
    body.name === " "
  ) {
    throw new BadRequestError("name");
  } else if (
    body.email === null ||
    body.email === undefined ||
    body.email === "" ||
    body.email === " "
  ) {
    throw new BadRequestError("email");
  } else if (
    body.amount === null ||
    body.amount === undefined ||
    body.amount === "" ||
    body.amount === " "
  ) {
    throw new BadRequestError("amount");
  } else if (typeof body.amount !== "number") {
    throw new BadRequestError("amount value");
  }
};
