/* eslint-disable no-undef */
require("dotenv").config();
const request = require("supertest");
const { server, app } = require("../app/app");
const { ServerError } = require("../errors/errors");

const donationsRepository = require("../repositories/donations.repository");

jest.mock("../repositories/donations.repository");

afterAll(() => {
  server.close();
});

describe("GET /api/donations/records", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return (200) all donations", async () => {
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

    donationsRepository.find.mockResolvedValue(mockItems);

    const res = await request(app).get("/api/donations/records");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDonations);
  });

  it("should return (404) NotFoundError", async () => {
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

  it("should return (500) ServerError", async () => {
    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't getAll donations.",
    };

    donationsRepository.find.mockRejectedValue(new ServerError("getAll"));

    const res = await request(app).get("/api/donations/records");
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(mockResponse);
  });
});

describe("GET /api/donations/records/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return (200) Specific donation", async () => {
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
    };

    donationsRepository.retrieve.mockResolvedValue(mockItem);
    const res = await request(app).get(
      "/api/donations/items/65b7fe322378c84fb803d307"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (404) item NotFoundError", async () => {
    const id = "65b7fe322378c84fb803d305";

    const mockResponse = {
      name: "NotFoundError",
      message: `Donation with id ${id} not found.`,
    };

    donationsRepository.retrieve.mockResolvedValue([]);
    const res = await request(app).get(`/api/donations/items/${id}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError", async () => {
    const id = ":id";

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid id.",
    };

    donationsRepository.retrieve.mockResolvedValue([]);
    const res = await request(app).get(`/api/donations/items/${id}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (500) ServerError", async () => {
    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't get donations.",
    };

    donationsRepository.retrieve.mockRejectedValue(new ServerError("get"));
    const res = await request(app).get(
      "/api/donations/items/65b7fe322378c84fb803d307"
    );
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(mockResponse);
  });
});

describe("POST /api/donations/items", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return (201) Create a new donation", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe",
      email: "johnDoe@do.com",
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

  it("should return (400) BadRequestError - email not provided", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid email.",
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - name not provided", async () => {
    const mockItem = {
      amount: 222,
      email: "JohnDoe@do.com",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid name.",
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - amount not provided", async () => {
    const mockItem = {
      name: "John Doe",
      email: "JohnDoe@do.com",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid amount.",
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - amount is not a number", async () => {
    const mockItem = {
      amount: "222",
      name: "John Doe",
      email: "johnDoe@doa.com"
    }; 

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid amount value.",
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (500) ServerError", async () => {
    const mockItem = {
      amount: 222,
      name: "John Doe",
      email: "JohnDo@do.com",
    };

    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't post donations.",
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

  it("should return (200) update a donation", async () => {
    const newMockItem = {
      amount: 333,
      name: "Jane Doa",
      email: "janeDoa@da.com",
    };

    const mockResponse = {
      message: "Donation updated successfully",
      status: "success",
      data: {
        donation: newMockItem,
      },
    };

    donationsRepository.put.mockResolvedValue(newMockItem);
    const res = await request(app)
      .put("/api/donations/items/65b7fe322378c84fb803d307")
      .send(newMockItem);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (404) item NotFoundError", async () => {
    const mockItem = {
      _id: "65b7fe322378c84fb803d307",
      amount: 222,
      name: "John Doe",
      email: "johnDoe@do.com",
    };

    const newMockItem = {
      amount: 333,
      name: "Jane Doa",
      email: "jajaDa@do.com",
    };

    const mockResponse = {
      name: "NotFoundError",
      message: `Donation not found.`,
    };

    donationsRepository.put.mockResolvedValue(null);
    const res = await request(app)
      .put(`/api/donations/items/${mockItem._id}`)
      .send(newMockItem);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - name not provided", async () => {
    const newMockItem = {
      amount: 333,
      email: "jajaDa@da.com",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid name.",
    };

    donationsRepository.put.mockResolvedValue(newMockItem);
    const res = await request(app)
      .put("/api/donations/items/65b7fe322378c84fb803d307")
      .send(newMockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - email not provided", async () => {
    const newMockItem = {
      amount: 333,
      name: "Jane Doa",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid email.",
    };

    donationsRepository.put.mockResolvedValue(newMockItem);
    const res = await request(app)
      .put("/api/donations/items/65b7fe322378c84fb803d307")
      .send(newMockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - amount not provided", async () => {
    const newMockItem = {
      name: "Jane Doa",
      email: "jajaDa@da.com",
    };

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid amount.",
    };

    donationsRepository.put.mockResolvedValue(newMockItem);
    const res = await request(app)
      .put("/api/donations/items/65b7fe322378c84fb803d307")
      .send(newMockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError - amount is not a number", async () => {
    const mockItem = {
      amount: "222",
      name: "John Doe",
      email: "johnDoe@doa.com"
    }; 

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid amount value.",
    };

    donationsRepository.create.mockResolvedValue(mockItem);
    const res = await request(app).post("/api/donations/items").send(mockItem);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (500) ServerError", async () => {
    const newMockItem = {
      amount: 333,
      name: "Jane Doa",
      email: "fakeMail@mail.com",
    };

    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't put donations.",
    };

    donationsRepository.put.mockRejectedValue(new ServerError("put"));
    const res = await request(app)
      .put("/api/donations/items/65b7fe322378c84fb803d307")
      .send(newMockItem);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(mockResponse);
  });
});

describe("DELETE /api/donations/items/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return (204) Delete a donation", async () => {
    const mockItem = {
      _id: "65b7fe322378c84fb803d307",
      amount: 222,
      name: "John Doe",
      email: "",
    };

    const mockResponse = {};

    donationsRepository.delete.mockResolvedValue([]);
    const res = await request(app).delete(
      `/api/donations/items/${mockItem._id}`
    );
    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (404) NotFoundError", async () => {
    const mockItem = {
      _id: "65b7fe322378c84fb803d307",
      amount: 222,
      name: "John Doe",
      email: "",
    };

    const mockResponse = {
      name: "NotFoundError",
      message: `Donation not found.`,
    };

    donationsRepository.delete.mockResolvedValue(null);
    const res = await request(app).delete(
      `/api/donations/items/${mockItem._id}`
    );
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (400) BadRequestError", async () => {
    id = ":id";

    const mockResponse = {
      name: "BadRequestError",
      message: "please provide a valid id.",
    };

    donationsRepository.delete.mockResolvedValue(null);
    const res = await request(app).delete(`/api/donations/items/${id}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return (500) ServerError", async () => {
    const mockResponse = {
      name: "ServerError",
      message: "Internal Server Error - Couldn't delete donations.",
    };

    donationsRepository.delete.mockRejectedValue(new ServerError("delete"));
    const res = await request(app).delete(
      "/api/donations/items/65b7fe322378c84fb803d307"
    );
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(mockResponse);
  });
});

describe("BROKEN URL Not Found respond", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return (404) NotFoundError", async () => {
    const mockUrl = "/api/donations/ite";

    const mockResponse = {
      name: "NotFoundError",
      message: `${mockUrl} not found.`,
    };

    const res = await request(app).get(`${mockUrl}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(mockResponse);
  });

});