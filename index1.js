import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "mo55407499",
  port: 5432,
});

db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



let items = [];

app.get("/", async (req, res) => {
  await db.query("SELECT * FROM items",(err,res)=>{
    if(err){
      console.log("error excuting the query ",err.stack)
    }
    else{
      items = res.rows;
      console.log(items);
    }
  })
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",[item])
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
