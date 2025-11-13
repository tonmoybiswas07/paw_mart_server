const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mycluster.xjvt9bg.mongodb.net/pawMartDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("pawMartDB");
    const productCollection = db.collection("martProducts");
    const orderCollection = db.collection("order");

    app.post("/martProducts", async (req, res) => {
      try {
        const data = req.body;
        console.log("POST data:", data); // check ownerEmail
        const result = await productCollection.insertOne(data);
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to add product" });
      }
    });

    app.get("/martProducts", async (req, res) => {
      try {
        const email = req.query.ownerEmail;
        const query = email ? { ownerEmail: email } : {};
        const result = await productCollection.find(query).toArray();
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to fetch listings" });
      }
    });

    app.get("/martProducts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await productCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to fetch product" });
      }
    });

    app.delete("/martProducts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await productCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to delete listing" });
      }
    });

    app.put("/martProducts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await productCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to update listing" });
      }
    });

    app.post("/orders", async (req, res) => {
      try {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to place order" });
      }
    });

    app.get("/orders", async (req, res) => {
      try {
        const email = req.query.email;
        const query = email ? { buyerEmail: email } : {};
        const result = await orderCollection.find(query).toArray();
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Failed to load orders" });
      }
    });

    app.get("/products/category/:categoryName", async (req, res) => {
      const categoryName = req.params.categoryName
        .replace(/-/g, " ")
        .toLowerCase();
      const query = {
        category: { $regex: new RegExp("^" + categoryName + "$", "i") },
      };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("Server is running successfully");
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
