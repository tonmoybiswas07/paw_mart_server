const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://pawMartDB:SvCcMjBipBW60fKl@mycluster.xjvt9bg.mongodb.net/?appName=myCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("pawMartDB");
    const productCollection = db.collection("martProducts");

    app.get("/martProducts", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get("/martProducts/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await productCollection.findOne({ _id: objectId });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running succesfully");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
