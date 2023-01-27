const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 4200;
const bgBrightness = 50;
const dataFile = path.join(__dirname, "data.txt");
//data.txt check
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", (err) => new Exception(err));
}
const tweets = JSON.parse(fs.readFileSync(dataFile));
let lastId = tweets[0]?.id ?? 0;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { tweets });
});

app.post("/tweet", async (req, res) => {
  const tweet = ({ user, content } = req.body);
  if (user && content) {
    tweets.unshift({
      id: ++lastId,
      user,
      content,
      date: new Date().toLocaleString(),
      bg: [
        (Math.random() * bgBrightness).toFixed(2),
        (Math.random() * bgBrightness).toFixed(2),
        (Math.random() * bgBrightness).toFixed(2),
      ],
    });
  }
  res.redirect("/");
  fs.writeFile(dataFile, JSON.stringify(tweets), (err) => {
    if (err) console.error(err);
  });
});

app.get("/tweet", (req, res) => {
  let id = req.query.id;
  let tweet = tweets.find((elem) => elem.id == id);
  res.render("singleTweet", { tweet });
});

app.listen(port, () => console.log(`app started on port ${port}`));
