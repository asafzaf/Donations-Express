const { Donation } = require("../models/donations.model");
// const { donationsRepository } = require("../repositories/donations.repository");

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
      res.status(400).json({
        message: "Error retrieving donations",
        status: "failed",
        error: error.message,
      });
    }
  },

  getDonation: async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      res.status(200).json({
        message: "Donation retrieved successfully",
        status: "success",
        data: {
          donation,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Error retrieving donation",
        status: "failed",
        error: error.message,
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
      res.status(400).json({
        message: "Error creating donation",
        status: "failed",
        error: error.message,
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
      res.status(400).json({
        message: "Error updating donation",
        status: "failed",
        error: error.message,
      });
    }
  },

  deleteDonation: async (req, res) => {
    try {
      const donation = await Donation.findByIdAndDelete(req.params.id);
      res.status(204).json({
        message: "Donation deleted successfully",
        status: "success",
        data: null,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error deleting donation",
        status: "failed",
        error: error.message,
      });
    }
  },
};
