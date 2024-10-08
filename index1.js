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
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
  });

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",[item])
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const CurrentId = req.body.updatedItemId;
  const NewTitle = req.body.updatedItemTitle;

  console.log(`the current id ${CurrentId}, the new titel ${NewTitle}`);
  await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",[NewTitle,CurrentId]);
  
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const CurrentId = req.body.deleteItemId;
  
  try{
    await db.query("DELETE FROM items WHERE id = ($1)",[CurrentId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`http://localhost:${3000}/`);
});
