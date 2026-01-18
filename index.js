const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }))
const mongoose = require("mongoose");
const session = require("express-session");
const routers = require("./routes");

app.set("view engine", "ejs");
app.use("/public", express.static("public"));

// Use Session
app.use(session({
	secret: "secretKey",
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 3600000},
}));

// Connect to MongoDB
mongoose.connect("mongodb+srv://kenken7272721_db_user:xOXlOihPU1n8TSlq@cluster0.plqxgaq.mongodb.net/blogUserDatabase?appName=Cluster0")
	.then(() => {
		console.log("Success: Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Failure: Unconnected to MongoDB");
	})

app.use(routers);

// Page not found
app.use((req, res) => {
	res.status(404).render("error", {message: "ページが存在しません"});
});

// Connect to port
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Listening on localhost port 3000");
});
