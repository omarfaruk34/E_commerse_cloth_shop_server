
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const port = 5000 || process.env.PORT;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gk0pov5.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
  try {
    await client.connect();
    const database = client.db("cloothee");
    const productCollection = database.collection("product");
    const womenproductCollection = database.collection("womenproduct");
    const menproductCollection = database.collection("menproduct");
    const blogCollection = database.collection("blog");
    const contactCollection = database.collection("contact");
    const usersCollection = database.collection("users");
    const usersReview = database.collection("users_review");
    const ordersCollection = database.collection("orders");



    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });


    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const found = await usersCollection.findOne(filter);
      if (!found) {
        res.send({ isRegistered: false });
        return;
      }
      if (found?.role === "admin") {
        res.send({ isAdmin: true });
        return;
      }
      const updateRole = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateRole);
      res.send(result);
    });





    app.post('/addProduct', async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });
    app.get('/addProduct', async (req, res) => {
      const result = await productCollection.find({}).toArray();
      res.json(result);
    });
    app.get('/addProduct/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) }
      const products = await productCollection.findOne(query);
      res.send(products);
    });


    app.post('/addwomenProduct', async (req, res) => {
      const result = await womenproductCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });
    app.get('/addwomenProduct', async (req, res) => {
      const result = await womenproductCollection.find({}).toArray();
      res.json(result);
    });
    app.get('/addwomenProduct/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) }
      const womenproduct = await womenproductCollection.findOne(query);
      res.send(womenproduct);
    });


    app.post('/addmenProduct', async (req, res) => {
      const result = await menproductCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });
    app.get('/addmenProduct', async (req, res) => {
      const result = await menproductCollection.find({}).toArray();
      res.json(result);
    });
    app.get('/addmenProduct/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) }
      const menproducts = await menproductCollection.findOne(query);
      res.send(menproducts);
    });




    app.post('/addBlog', async (req, res) => {
      const result = await blogCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });
    app.get('/addBlog', async (req, res) => {
      const result = await blogCollection.find({}).toArray();
      res.json(result);
    });
    app.get('/addBlog/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) }
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });




    app.post('/contact', async (req, res) => {
      const result = await contactCollection.insertOne(req.body);
      res.send(result);
    });
    app.get('/contact', async (req, res) => {
      const result = await contactCollection.find({}).toArray();
      res.send(result)
    });


    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(req.body);
      const result = await usersReview.insertOne(review);
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await usersReview.find({}).toArray();
      res.send(result);
    });
    app.post("/orders", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await ordersCollection
        .find({ email: { $regex: email } })
        .toArray();
      res.send(result);
    });

    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const reqStatus = req.body.status;
      const filter = { _id: ObjectId(id) };
      // const option = { upsert: true }
      const updatedStatus = {
        $set: {
          status: reqStatus,
        },
      };
      const result = await ordersCollection.updateOne(filter, updatedStatus);
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

  }
  finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello omar')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})