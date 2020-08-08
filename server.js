const express = require("express");
// got vscode on the pi
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const mongo = process.env.MONGODB_URI || "mongodb://mongouser:lakers323@ds147551.mlab.com:47551/heroku_f0h2zbhm";
mongoose.connect(mongo, {
    useNewUrlParser: true,
    useFindAndModify: false,

    useUnifiedTopology: true
});

const Workout = require("./models/workout");
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/exercise", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
app.get("/stats", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));


});

app.post("/api/workouts", ({ body }, res) => {

    Workout.create({ day: new Date() })
        .then((data) => res.json(data))
        .catch(e => console.error(e))
});

app.get("/api/workouts", (req, res) => {
    Workout.find({}, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.json(data);
        }
    });
})

app.get("/api/workouts/range", (req, res) => {
    Workout.find().limit(7)
        .then(workout => res.json(workout))
        .catch(e => console.error(e))
})


app.put("/api/workouts/:id", (req, res) => {



    Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } }, { new: true, runValidators: true })
        // .then(() => res.sendStatus(200))
        .then((data) => res.json(data))

        .catch(e => console.error(e))
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on ${PORT}`);
});