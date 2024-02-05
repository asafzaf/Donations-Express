const express = require("express");
const logger = require("morgan");
const { donationsRouter } = require("../routers/donations.router");

const { ServerError, NotFoundError, BadRequestError } = require("../errors/errors");

const app = express();
const port = process.env.PORT || 8080;

module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use("/api/donations", donationsRouter);

app.all("*", (req, res, next) => {
  const error = new NotFoundError(req.originalUrl);
  next(error);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.name = err.name || "error";

  res.status(err.statusCode).json({
    name: err.name,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
