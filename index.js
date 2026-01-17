const { name } = require("ejs");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }))
const mongoose = require("mongoose");
const session = require("express-session");

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
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


// Define Schema and Model
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
	title: String,
	summary: String,
	image: String,
	textBody: String,
});

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

const BlogModel = mongoose.model("Blog", BlogSchema);
const UserModel = mongoose.model("User", UserSchema);

// Blog functions
// Create blog post
app.get("/blog/create", (req, res) => {
	if (req.session.userId) {
		res.render("blogCreate")
	} else {
		res.redirect("/user/login");
	}
});

app.post("/blog/create", (req, res) => {
	BlogModel.create(req.body)
	.then(() => {
		res.redirect("/");
	})
	.catch((error) => {
		res.render("error", {message: "/blog/create のエラー"});
	})
});

// Read all blog posts
app.get("/", async(req, res) => {
	const allBlogs = await BlogModel.find();
	res.render("index", {
		allBlogs: allBlogs,
		session: req.session.userId
	});
});

// Read a single blog post
app.get("/blog/:id", async(req, res) => {
	// console.log(req.params.id);
	const singleBlog = await BlogModel.findById(req.params.id);
	res.render("blogRead", {
		singleBlog: singleBlog,
		session: req.session.userId
	});
});

// Update blog post
app.get("/blog/update/:id", async(req, res) => {
	const singleBlog = await BlogModel.findById(req.params.id);
	res.render("blogUpdate", {singleBlog});
});

app.post("/blog/update/:id", (req, res) => {
	BlogModel.updateOne({_id: req.params.id}, req.body)
		.then(() => {
			res.redirect("/");
		})
		.catch((error) => {
			res.render("error", {message: "/blog/update のエラー"});
		})
});

// Delete blog post
app.get("/blog/delete/:id", async(req, res) => {
	const singleBlog = await BlogModel.findById(req.params.id);
	res.render("blogDelete", {singleBlog});
});

app.post("/blog/delete/:id", (req, res) => {
	BlogModel.deleteOne({_id: req.params.id})
		.then(() => {
			res.redirect("/");
		})
		.catch((error) => {
			res.render("error", {message: "/blog/delete のエラー"});
		})
});

// Create user
app.get("/user/create", (req, res) => {
	res.render("userCreate");
});

app.post("/user/create", (req, res) => {
	UserModel.create(req.body)
		.then(() => {
			res.redirect("/user/login");
		})
		.catch((error) => {
			res.render("error", {message: "/user/create のエラー"});
		})
});

// Login
app.get("/user/login", (req, res) => {
	res.render("login");
});

app.post("/user/login", (req, res) => {
	UserModel.findOne({email: req.body.email})
		.then((savedData) => {
			if (savedData) {
				if (req.body.password === savedData.password) {
					req.session.userId = savedData._id.toString();
					res.redirect("/");
				} else {
					res.render("error", {message: "/user/login のエラー: パスワードが間違っています"});
				}
			} else {
				res.render("error", {message: "/user/login のエラー: ユーザーが存在していません"});
			}
		})
		.catch((err) => {
			res.render("error", {message: "/user/login のエラー: エラーが発生しました"});
		})
});

// Connect to port
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Listening on localhost port 3000");
});
