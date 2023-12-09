const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
// amamksladfkjasdl
// middleqwares
// 'https://flowlancher.web.app', 
// 'https://flowlancher.firebaseapp.com', 
// 'http://localhost:5000'
app.use(cors())
app.use(express.json());

// console.log(process.env.DB_PASS)
// console.log(process.env.DB_USER)

// configuaration from mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fn8ke9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    // await client.connect();

    
    
    
    
    // database  and collection name
    const jobCollection = client.db("FlowLancher").collection("jobs");
    const usersCollection = client.db("FlowLancher").collection("user");
    const bidsCollection = client.db("FlowLancher").collection("Bids");
    
    // api for storing bids

    app.post('/bids', async(req, res) => {
      const newBid = req.body; 
      console.log(newBid)
      const result = await bidsCollection.insertOne(newBid)
      res.send(result)
    })

    // getting user specific bid from mongodb

    app.get('/bids', async(req, res) => {
      console.log(req.query)
      let query = {}; 
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await bidsCollection.find(query).toArray(); 
      res.send(result)
    })

    // find all jobs from mongodb
    app.get("/jobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // find a specific job for click on bid now button

    app.get("/jobs", async (req, res) => {
      // console.log(req.query);
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    // post jobs to database
    app.post("/jobs", async (req, res) => {
      const newJobs = req.body;
      // console.log(newJobs);
      const result = await jobCollection.insertOne(newJobs);
      res.send(result);
    });

    // getting some data to show in the my my posted jobs

    app.get("/jobs", async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    });

    // api for deleting an specific job from an specific user

    app.delete("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    // api for get specific job's data to update the data
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    // api for update  a specific job
    app.put("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedJob = req.body;
      const job = {
        $set: {
          title: updatedJob.title,
          description: updatedJob.description,
          maximum: updatedJob.maximum,
          minimum: updatedJob.minimum,
          deadline: updatedJob.deadline,
          select: updatedJob.select
        }
      };
      const result = await jobCollection.updateOne(filter, job, options)
      res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// root
app.get("/", (req, res) => {
  res.send("FlowLancher server is running");
});

app.listen(port, () => {
  console.log(`FlowLancher is running from port: ${port}`);
});
