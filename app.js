const express = require("express");
const process = require("process");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const hostname = "127.0.0.1";

// express middleware
// modified incoming request body to api

app.use(express.json());

//read file from json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "sucess",
    data: tours,
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }
  res.status(200).json({
    status: "sucess",
    data: tour,
  });
});

app.post("/api/v1/tours", (req, res) => {
  // generate id for new data
  const newId = tours[tours.length - 1].id + 1;

  const newData = Object.assign({ id: newId }, req.body);

  tours.push(newData);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      });
    }
  );
});

app.patch("/api/v1/tours/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (!tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }
  tours[tourIndex] = { ...tours[tourIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        message: `tour with id ${id} edited`,
        data: {
          tour: tours[tourIndex],
        },
      });
    }
  );
});

app.delete("/api/v1/tours/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (!tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }

  tours.splice(tourIndex, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(404).json({
        status: "Not found",
        message: `tour with id ${id} edited`,
        data: null,
      });
    }
  );
});

app.listen(PORT, hostname, () => {
  console.info(`Server listening at http://${hostname}:${PORT}`);
});
