require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const postRouers = require("./routes/posts");
const cors = require('cors');
const axios = require('axios');


//express app
const app = express();

app.use(cors());

//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
//routes
app.get("/", (req, res) => {
  res.json({ msg: "welcome !!!" });
});
app.use("/api/users", userRoutes);
app.use("/api/posts", postRouers);

//connect to mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });


//to keep server awake on render
app.get('/keep-alive', (req, res) => {
  res.send('Server is awake!');
});


setInterval(() => {
  axios.get(`https://ism-gram.onrender.com/keep-alive`)
    .then(response => console.log(response.data))
    .catch(error => console.error('Error pinging keep-alive:', error));
}, 60000); // 1 minutes in milliseconds
