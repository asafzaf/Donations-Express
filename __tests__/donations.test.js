const app = require("../index");
const request = require("supertest");
// const DonationsRepository = require("../repositories/donations.repository");
const DonationsController = require("../controllers/donations.controller");

// const donationsRepository = new DonationsRepository();
const donationsController = new DonationsController();

jest.mock("../repositories/donations.repository"); 

describe("GET /api/donations/records", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all donations", async () => {
    const mockDonations = [
      {
        _id: "65b7fe322378c84fb803d307",
        amount: 100,
        name: "John Doe",
        email: "aaaa@aaaa.com",
        date : "2021-04-01T00:00:00.000Z",
        __v: 0,
      },
      {
        _id: "65b7fe322378c84fb803d407",
        amount: 200,
        name: "Jane Doe",
        email: "bbbb@bbbb.com",
        date : "2021-04-01T00:00:00.000Z",
        __v: 0,
      },
    ];
    donationsController.getAllDonations.mockResolvedValue(mockDonations); // Replace 'donationsController.getAllDonations' with 'getAllDonations'

    const res = await request(app).get("/api/donations/records");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDonations);
  });
});
