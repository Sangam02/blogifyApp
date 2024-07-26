require("dotenv").config();

const path = require("path");
const express  = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


/////////// Imports all file and functions///////////

const Blog = require("./models/blog");
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

////////////Connect BD (MongoDB) ///////////////////

// mongoose.connect("mongodb://localhost:27017/blogify")
mongoose
.connect(process.env.MONGO_URL )
.then(() => console.log("Mongodb connected"));

///////////// EJS connection /////////////////

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

//////// Middlewares ////////////////////////////

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")));

////////////// Render Home Page ////////////////

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    return res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send("Internal Server Error");
  }
});

/////////////////////////////////////

app.use("/user", userRoute);
app.use("/blog", blogRoute );

/////////////////// Connect PORT/////////////// 

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));