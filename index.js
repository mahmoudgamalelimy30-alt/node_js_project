import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Article from "./models/Articles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
mongoose
  .connect(
    "mongodb+srv://mahmoudgamal27:Hamza%40012@myfirstnodejscluster.fcot3rm.mongodb.net/?appName=myFirstNodeJScluster"
  )
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((error) => {
    console.log("Error with connecting wuth the DB", error);
  });

app.use(express.json());

const port = 3000;

app.get("/numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  // res.send(numbers);
  // res.sendFile(path.join(__dirname, "views", "numbers.html"));
  res.render("numbers.ejs", { name: "Mahmoud", numbers: numbers });
});

// path parameters
app.get("/findSummation/:number1/:number2", (req, res) => {
  console.log(req.params);

  const num1 = req.params.number1;
  const num2 = req.params.number2;

  res.send(`summation ${+num1 + +num2}`);
});

// body parameters & Query params
app.get("/sayHello", (req, res) => {
  // res.send(`Hello ${req.body.name} , your age is ${req.query.age}`);
  res.json({
    name: req.body.name,
    age: req.query.age,
    language: "Arabic",
  });
});

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.get("/hi", (req, res) => {
  res.send("hi");
});
app.get("/thanks", (req, res) => {
  res.send("thank you");
});
app.put("/test", (req, res) => {
  res.send("Hello World");
});

app.post("/addComment", (req, res) => {
  res.send("post request on add comment");
});

app.delete("/deleteTest", (req, res) => {
  res.send("delete request");
});

// ========== ARTICLES ENDPOINTS =============
app.post("/articles", async (req, res) => {
  const newArticle = new Article();

  const artTitle = req.body.articleTitle;
  const artBody = req.body.articleBody;

  newArticle.title = artTitle;
  newArticle.body = artBody;
  newArticle.numberOfLikes = 100;

  await newArticle.save();

  res.json(newArticle);
});

app.get("/articles", async (req, res) => {
  const articles = await Article.find();
  console.log("the articles are " + articles);
  res.json(articles);
});

app.get("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;
  try {
    const article = await Article.findById(id);
    res.json(article);
  } catch (error) {
    console.log("error while reading article of id ", id);
    return res.send(error);
  }
});

app.delete("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;
  try {
    const article = await Article.findByIdAndDelete(id);
    res.json(article);
  } catch (error) {
    console.log("error while deleting article of id ", id);
    return res.json(error);
  }
});

app.get("/showArticles", async (req, res) => {
  const articles = await Article.find();
  res.render("allArticles.ejs", { allArticles: articles });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
