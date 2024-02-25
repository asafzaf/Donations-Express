const express = require("express");
const logger = require("morgan");
const { NODE_ENV } = require("../constants");
const { donationsRouter } = require("../routers/donations.router");

const { NotFoundError } = require("../errors/errors");

const app = express();
const cors = require('cors');

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === "development") {
  const fs = require('fs');
  const path = require('path');
  // eslint-disable-next-line no-undef
  const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/logs.txt'), { flags: 'a' });
  app.use(logger('combined', { stream: accessLogStream }));
  app.use(logger("dev"));
}

app.use("/api/donations", donationsRouter);

app.all("*", (req, res) => {
  const error = new NotFoundError(req.originalUrl);
  res.status(error.statusCode).json({
    name: error.name,
    message: error.message,
  });
});

app.use((err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.name = err.name || "error";

  res.status(err.statusCode).json({
    name: err.name,
    message: err.message,
  });
});

const server = app.listen(port, () => {
  NODE_ENV == "test" ? null : console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };
