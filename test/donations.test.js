const request = require("supertest");
const app = require("../server");
const { Donation } = require("../models/donation.model");

jest.mock("../models/donation.model");

describe("GET /", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all donations", async () => {
    const fakeDonations = [
      {
        _id: "5f4f8c4d7e5a2c3b0c9e0f6f",
        name: "John Doe",
        email: "aaaa@aaaa.com",
      },
      {
        _id: "5f4f8c4d7e5a2c3b0c9e0f70",
        name: "Jane Doe",
        email: "bbbb@bbbb.com",
      },
    ];
  });
});
