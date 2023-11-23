require("dotenv").config();
const express = require('express'); //Line 1 
const bodyParser = require('body-parser');
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// This displays message that the server running and listening to specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  // run().catch(console.dir);      
}); //Line 6

async function run() {
  // try {
  //   // Connect the client to the server	(optional starting in v4.7)
  //   await client.connect();
  //   // Send a ping to confirm a successful connection
  //   await client.db("songs").command({ ping: 1 });
  //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
  // } finally {
  //   // Ensures that the client will close when you finish/error
  //   // await client.close();
  // }
}

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'Internet Radio Salamon' }); //Line 10
}); //Line 11
app.get('/data', (req, res) => { //Line 9
  res.send({ title: 'Internet Radio Salamon', desc: 'Internetowe radio Dawida Salamona ' })
}); //Line 11)


app.get('/music', (req, res) => { //Line 9

}); //Line 11)

app.post('/addsong', jsonParser, (req, res) => {
  console.log(req.body);
  songName = req.body.songName;
  songAuthor = req.body.songAuthor;
  songAlbum = req.body.songAlbum;
  songAuthor = req.body.songAuthor;
  
  // try {
  //   // Connect the client to the server	(optional starting in v4.7)
  //   await client.connect();
  //   // Send a ping to confirm a successful connection
  //   await client.db("songs").command({ ping: 1 });
  //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
  // } finally {
  //   // Ensures that the client will close when you finish/error
  //   // await client.close();
  // }

})

app.post('/login', jsonParser, (req, res) => { //Line 9

  console.log(req.body);
  login = req.body.login;
  password = req.body.password;

  if (login == 'dsalamon' && password == '123') {
    res.send({ userName: 'DSalamon', isLogged: true });
  }
  else {
    res.send({ userName: 'DSalamon', isLogged: false });
  }

}); //Line 11)
