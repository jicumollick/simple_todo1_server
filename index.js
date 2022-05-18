const { MongoClient, ServerApiVersion } = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
const express = require("express");
var cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ppoqi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const todoCollection = client.db("ToDo").collection("tasks");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // delete a task from database

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(filter);
      res.send(result);
    });

    // adding a task in database

    app.post("/task", async (req, res) => {
      const data = req.body;
      console.log("From Post Api", data);
      const result = await todoCollection.insertOne(data);
      res.send(result);
    });

    // get all tasks from database

    app.get("/tasks", async (req, res) => {
      const q = {};
      // console.log(q);

      const cursor = todoCollection.find(q);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    console.log("database connected");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
