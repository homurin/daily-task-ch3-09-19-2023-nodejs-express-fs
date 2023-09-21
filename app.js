const process = require("process");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;
const hostname = "127.0.0.1";

// express middleware
// modified incoming request body to api
app.use(express.json());

// third party middleware
app.use(morgan("dev"));

// Our own middleware / local module
app.use((req, res, next) => {
  console.log("Hello FSW-2 Di middlware kita sendiri ");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// middleware authorization

// app.use((req, res, next) => {
//   if (req.body.role !== "admin")
//     res.status(401).json({ message: "You cant access" });
//   next();
// });

//read file from json tours

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    requestTime: req.requestTime,
    data: tours,
  });
};

const getTourById = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const editTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (!tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  };
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
};

const removeTour = (req, res) => {
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
};

//
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "sucess",
    requestTime: req.requestTime,
    data: users,
  });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((el) => el.id === id);
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }
  res.status(200).json({
    status: "sucess",
    data: user,
  });
};

const createUser = (req, res) => {
  // generate id for new data
  const newId = users[tours.length - 1].id + 1;

  const newData = Object.assign({ id: newId }, req.body);

  users.push(newData);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          users: newData,
        },
      });
    }
  );
};

const editUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = tours.findIndex((el) => el.id === id);

  if (!userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  };
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        message: `tour with id ${id} edited`,
        data: {
          user: users[userIndex],
        },
      });
    }
  );
};

const removeUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((el) => el.id === id);

  if (!userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with id ${id} not found`,
    });
  }

  users.splice(tourIndex, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(users),
    (err) => {
      res.status(404).json({
        status: "Not found",
        message: `tour with id ${id} edited`,
        data: null,
      });
    }
  );
};

// Routing

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", editTour);
// app.delete("/api/v1/tours/:id", removeTour);

const tourRoutes = express.Router();
const userRoutes = express.Router();
//routes toures

tourRoutes.route("/").get(getAllTours).post(createTour);
tourRoutes.route("/:id").get(getTourById).patch(editTour).delete(removeTour);

// routes users

userRoutes.route("/").get(getAllUsers).post(createUser);
userRoutes.route("/:id").get(getUserById).patch(editUser).delete(removeUser);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);

app.listen(PORT, hostname, () => {
  console.info(`Server listening at http://${hostname}:${PORT}`);
});
