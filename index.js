const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.plbgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollecttion = client.db('carWarehouse').collection('inventory');

        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = inventoryCollecttion.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories)
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Car Warehouse Server')
})

app.listen(port, (req, res) => {
    console.log('Listening to port', port)
})