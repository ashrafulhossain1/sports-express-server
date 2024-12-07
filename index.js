const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jkfsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const userCollection = client.db("sportsEquipDB").collection('users')
        const equipCollection = client.db("sportsEquipDB").collection("equipments")


        // USERS-DB
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query);
            if (user) {
                res.json(user);
            } else {
                res.json(null);
            }
        });

        app.post('/users', async (req, res) => {
            const userInfo = req.body
            console.log("hitting from clint", userInfo)

            const result = await userCollection.insertOne(userInfo);
            res.send(result);
        })

        // EQUIPMENT-DB

        // all equipCollection
        app.get('/allEquipments', async (req, res) => {
            const cursor = equipCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // sort by-- all equipCollection

        app.get('/sortBy', async (req, res) => {
            const cursor = equipCollection.find().sort({ price: 1 })
            const result = await cursor.toArray()
            res.send(result)
        })





        app.get('/homeEquip', async (req, res) => {
            const cursor = equipCollection.find().limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/myEquip', async (req, res) => {
            const { email } = req.query;
            const query = { userEmail: email, }

            const cursor = equipCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/allEquipments/:id', async (req, res) => {
            const id = req.params.id
            console.log("hitting from single details", id)
            const query = { _id: new ObjectId(id) }
            const result = await equipCollection.findOne(query)
            res.send(result)
        })

        app.get('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            console.log('UPDATE PAGE,', id)
            const query = { _id: new ObjectId(id) }
            const result = await equipCollection.findOne(query)
            res.send(result)
        })

        app.post('/addEquips', async (req, res) => {
            const equipmentInfo = req.body
            console.log('hitting Equipment', equipmentInfo)
            const result = await equipCollection.insertOne(equipmentInfo)
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedEquip = {
                $set: req.body
            }
            const result = await equipCollection.updateOne(query, updatedEquip, options);
            res.send(result)
        })

        app.delete('/myEquip/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await equipCollection.deleteOne(query);
            res.send(result)
        })









    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SPORTs SERVER is Running')
})

app.listen(port, () => {
    console.log(`Sports Express Server is running: ${port}`)
})