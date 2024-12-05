const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // Sport Equipments
        app.post('/addEquips', async (req, res) => {
            const equipmentInfo = req.body
            console.log('hitting Equipment', equipmentInfo)
            const result = await equipCollection.insertOne(equipmentInfo)
            res.send(result)
        })

        // app.get('/allEquipment')



        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    } finally {
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SPORTs SERVER is Running')
})

app.listen(port, () => {
    console.log(`Sports Express Server is running: ${port}`)
})