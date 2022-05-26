const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4y4wz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('package').collection('data');
        const placeOrderCollection = client.db('package').collection('placeOrder');

        // get all parts
        app.get('/part', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts)
        });

        // get one inventory item
        app.get('/part/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const part = await partsCollection.findOne(query);
            res.send(part);
        })

        app.post("/placeorder", async (req, res) => {
            const placeOrder = req.body;
            const result = await placeOrderCollection.insertOne(placeOrder);
            res.send(result);
        });
        app.get('/placeorder', async (req, res) => {
            const customerEmail = req.query.email;
            console.log(customerEmail);
            const query = { customerEmail: customerEmail };
            const orders = await placeOrderCollection.find(query).toArray();
            res.send(orders);
        })
    }

    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello auto Motors Manufacturer parts')
})

app.listen(port, () => {
    console.log('The motorcycles parts app listening on', port)
})