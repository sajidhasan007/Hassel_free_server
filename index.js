const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();




const app = express();
const port = process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4sj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected successfully');
        const database = client.db("Event_Booking");
        const eventscollection = database.collection("Events");
        const bookingcollection = database.collection("Booking");

        app.get('/events', async (req, res) => {
            const cursor = eventscollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/manageEvent', async (req, res) => {
            const cursor = bookingcollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/event/:id', async (req, res) => {
            const eventid = req.params.id;
            //console.log('get hit by id = ', eventid);
            const cursor = eventscollection.find({ _id: ObjectId(eventid) });
            const result = await cursor.toArray();
            //console.log('the result is = ', result);
            res.send(result);
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            //console.log('post method is hitted', booking);
            const result = await bookingcollection.insertOne(booking);
            console.log(result);
            res.json(result);
        })

        app.post('/addevent', async (req, res) => {
            const newevent = req.body;
            console.log('post method is hitted', newevent);
            const result = await eventscollection.insertOne(newevent);
            //console.log(result);
            res.json(result);
        })

        app.post('/myevents', async (req, res) => {
            const email = req.body;
            console.log('post method is hitted email', email);
            const query = { email: { $in: [email.email] } }
            const result = await bookingcollection.find(query).toArray();
            res.json(result);
        })


        app.delete('/deleteevent/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete is hitted by ', id);
            const query = { _id: ObjectId(id) };
            const result = await bookingcollection.deleteOne(query);
            res.json(result);
        })


        app.put('/manageEvent/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log('updating user', user, ' and id = ', id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: user.status
                },
            };
            const result = await bookingcollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })


        /*   
         app.post('/events', async (req, res) => {
            const service = req.body;
            console.log('server is hitting', service);

            const result = await servicescollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete is hitted by ', id);
            const query = { _id: ObjectId(id) };
            const result = await servicescollection.deleteOne(query);
            res.json(result);
        })

        app.get('/services/:id', async (req, res) => {
            console.log('getting the service');
            const id = req.params.id;
            // console.log('getting the services of ', id);
            const query = { _id: ObjectId(id) };
            const result = await servicescollection.findOne(query);
            console.log(result)
            res.json(result);
        }) */

    } finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('Assignment server is runing');
    res.send('assignment server is hitted');
})

app.listen(port, () => {
    console.log('Assignment server is running port = ', port);
})