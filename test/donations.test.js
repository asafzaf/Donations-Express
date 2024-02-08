require("dotenv").config();
const request = require("supertest");
const { server, app } = require("../app/app");

const donationsRepository = require("../repositories/donations.repository");
const { BadRequestError } = require("../errors/errors");

jest.mock("../repositories/donations.repository");
afterAll(() => {
  server.close();
});

describe("GET /api/donations/records", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all donations", async () => {
    const mockDonations = {
      message: "Donations retrieved successfully",
      status: "success",
      results: 2,
      data: {
        donations: [
          {
            _id: "65b7fe322378c84fb803d307",
            amount: 100,
            name: "John Doe",
            email: "aaaa@aaaa.com",
            date: "2021-04-01T00:00:00.000Z",
            __v: 0,
          },
          {
            _id: "65b7fe322378c84fb803d407",
            amount: 200,
            name: "Jane Doe",
            email: "bbbb@bbbb.com",
            date: "2021-04-01T00:00:00.000Z",
            __v: 0,
          },
        ],
      },
    };

    const mockItems = [
      {
        _id: "65b7fe322378c84fb803d307",
        amount: 100,
        name: "John Doe",
        email: "aaaa@aaaa.com",
        date: "2021-04-01T00:00:00.000Z",
        __v: 0,
      },
      {
        _id: "65b7fe322378c84fb803d407",
        amount: 200,
        name: "Jane Doe",
        email: "bbbb@bbbb.com",
        date: "2021-04-01T00:00:00.000Z",
        __v: 0,
      },
    ];
    // }
    donationsRepository.find.mockResolvedValue(mockItems);

    const res = await request(app).get("/api/donations/records");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDonations);
  });

  it("should return not found error", async () => {
    const mockItems = [];

    const mockResponse = {
      name: "NotFoundError",
      message: "Donations not found.",
    };

    donationsRepository.find.mockResolvedValue(mockItems);

    const res = await request(app).get("/api/donations/records");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  });
});

describe("GET /api/donations/records/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return specific donation", async () => {
    const mockItem = {
      _id: "65b7fe322378c84fb803d307",
      amount: 100,
      name: "John Doe",
      email: "aaaa@aaaa.com",
      date: "2021-04-01T00:00:00.000Z",
      __v: 0,
    };

    const mockResponse = {
      message: "Donation retrieved successfully",
        status: "success",
        data: {
          donation: mockItem,
        },
    }

    donationsRepository.retrieve.mockResolvedValue(mockItem);
    const res = await request(app).get("/api/donations/items/65b7fe322378c84fb803d307");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return item not found error", async () => {
    const id = '65b7fe322378c84fb803d305';

    const mockResponse = {
      name: "NotFoundError",
      message: `Donation with id ${id} not found.`
    }

    donationsRepository.retrieve.mockResolvedValue([]);
    const res = await request(app).get(`/api/donations/items/${id}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  }); 
});

describe("POST /api/donations/items", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new donation", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe",
      email: "johnDoe@do.com"
    };

    const mockResponse = {
      message: "Donation created successfully",
      status: "success",
      data: {
        donation: mockItem,
      },
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockResponse);

  });

  it("should return bad request error - email not provided", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe"
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid email."
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return bad request error - name not provided", async () => {
    const mockItem = {
      amount: 222,
      email: "JohnDoe@do.com"
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid name."
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return bad request error - amount not provided", async () => {
    const mockItem = {
      name: "John Doe",
      email: "JohnDoe@do.com"
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid amount."
    };


    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return ServerError", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe",
      email: "JohnDo@do.com" 
    };

    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't post donations."
    };

    donationsRepository.create.mockResolvedValue(null);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(mockResponse);
  });

});

describe("PUT /api/donations/items/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a donation", async () => {
    const mockItem = {
      _id: "65b7fe322378c84fb803d307",
      amount: 222,
      name: "John Doe",
      email: "johnDoe@do.com"
    };

    const newMockItem = {
      amount: 333,
      name: "Jane Doa",
      email: "janeDoa@da.com"
    };

    const mockResponse = {
      message: "Donation updated successfully",
      status: "success",
      data: {
        donation: newMockItem,
      },
    };

    donationsRepository.put.mockResolvedValue(newMockItem);
    const res = await request(app).put("/api/donations/items/65b7fe322378c84fb803d307").send(newMockItem);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockResponse);
  });

  // it("should return bad request error - name not provided", async () => {
  //   const mockItem = {
  //     _id: "65b7fe322378c84fb803d307",
  //     amount: 222,
  //     name: "John Doe",
  //     email: "johnDoe@do.com"
  //   };

  //   const newMockItem = {
  //     amount: 333,
  //     email: "jajaDa@da.com"
  //   };

  //   const mockResponse = {
  //     name: "BadRequestError",
  //     message: "Please provide a valid name."
  //   };

  //   donationsRepository.put.mockResolvedValue(newMockItem);
  //   const res = await request(app).put("/api/donations/items/65b7fe322378c84fb803d307").send(newMockItem);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toEqual(mockResponse);
  // });

  // it("should return bad request error - email not provided", async () => {
  //   const mockItem = {
  //     _id: "65b7fe322378c84fb803d307",
  //     amount: 222,
  //     name: "John Doe",
  //     email: "johnDoe@do.com"
  //   };
    
  //   const newMockItem = {
  //     amount: 333,
  //     name: "Jane Doa"
  //   };

  //   const mockResponse = {
  //     name: "BadRequestError",
  //     message: "Please provide a valid email."
  //   };

  //   donationsRepository.put.mockResolvedValue(newMockItem);
  //   const res = await request(app).put("/api/donations/items/65b7fe322378c84fb803d307").send(newMockItem);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toEqual(mockResponse);

  // });

  // it("should return bad request error - amount not provided", async () => {
  //   const mockItem = {
  //     _id: "65b7fe322378c84fb803d307",
  //     amount: 222,
  //     name: "John Doe",
  //     email: "johnDoe@do.com"
  //   };

  //   const newMockItem = {
  //     name: "Jane Doa",
  //     email: "jajaDa@da.com"
  //   };
    
  //   const mockResponse = {
  //     name: "BadRequestError",
  //     message: "Please provide a valid amount."
  //   };

  //   donationsRepository.put.mockResolvedValue(newMockItem);
  //   const res = await request(app).put("/api/donations/items/65b7fe322378c84fb803d307").send(newMockItem);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toEqual(mockResponse);
  // });

  // it("should return not found error", async () => {
  //   const mockItem = {
  //     _id: "65b7fe322378c84fb803d307",
  //     amount: 222,
  //     name: "John Doe",
  //     email: "johnDoe@do.com"
  //   };

  //   const newMockItem = {
  //     amount: 333,
  //     name: "Jane Doa",
  //     email: "jajaDa@do.com"
  //   };

  //   const mockResponse = {
  //     name: "NotFoundError",
  //     message: `Donation with id ${mockItem._id} not found.`
  //   };

  //   donationsRepository.put.mockResolvedValue([]);
  //   const res = await request(app).put(`/api/donations/items/${mockItem._id}`).send(newMockItem);
  //   expect(res.statusCode).toEqual(404);
  //   expect(res.body).toEqual(mockResponse);
  // });
});
