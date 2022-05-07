const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // get inventory items
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = inventoryCollecttion.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories)
        });

        // get one inventory item
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollecttion.findOne(query);
            res.send(inventory);
        })

        // post one inventory item
        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollecttion.insertOne(newInventory);
            res.send(result)
        })

        // delete one inventory
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollecttion.deleteOne(query);
            res.send(result)
        })

        // delivery 
        app.put('/inventory/decrease/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollecttion.updateOne(query, {
                $inc: { quantity: -1 }

            })
            res.send(inventory)
        })

        // restore
        app.put('/inventory/increase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const quantity = parseInt(req.body.quantity);
            const inventory = await inventoryCollecttion.findOne(query);
            const newQuantity = quantity + inventory.quantity;

            const updateQuantity = await inventoryCollecttion.updateOne(query, {
                $set: { quantity: newQuantity }
            })
            res.send(updateQuantity);
        })
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