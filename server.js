require("dotenv").config();
const express = require('express'); //Line 1 
const bodyParser = require('body-parser');
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3

const fetchfile = require('./fetchFile');
var jsonParser = bodyParser.json();
app.use(jsonParser);



var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(urlencodedParser);

const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

// This displays message that the server running and listening to specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  // run().catch(console.dir);      
}); //Line 6

async function run() {
  var data
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    console.log("connected");
    const db = client.db("music")
    const songs = db.collection("songs")
    const query = { }
    const options = {
      sort: { "songAuthor": 1 },
      projection: { _id: 0, songName: 1, songAuthor: 1, songAlbumName: 1, songAlbumCover: 0, songData: 0 }
    }
    console.log("sending querry");
    // data = await songs.find(query).toArray();
    data = await songs.find().toArray(function (err, docs) {
      if(err){
        return res.send('error', err);
      }
      client.close();
      console.log(docs)
      return data;
    });

  } finally {
    // Ensures that the client will close when you finish/error
    
    return data;
  }
}

app.get('/bucket_test', function (req, res) {
    try{
      fetchfile.getFileFromS3().then(data => {
        console.log("output ", data);
        res.send("S3 succ");
      }).catch( (err) => {
        console.log("error1". err);
        res.send(err.message)
      });
    } catch (err){
      console.log("error2". err.message);
      res.send(err.message);
    }
})
// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'Internet Radio Salamon' }); //Line 10
}); //Line 11

app.get('/data', (req, res) => { //Line 9
  res.send({ title: 'Internet Radio Salamon', desc: 'Internetowe radio Dawida Salamona ' })
}); //Line 11)


app.get('/getallsongs', async (req, res) => { //Line 9
  const data = await run().catch(console.dir)
  // console.log("res data" + data)
  res.send({ result: data });
}); //Line 11)

app.post('/addsong', jsonParser, (req, res) => {
  console.log(req.body);
  songName = req.body.songName;
  songAuthor = req.body.songAuthor;
  songAlbum = req.body.songAlbum;
  songAuthor = req.body.songAuthor;
})

app.post('/login', jsonParser, (req, res) => { //Line 9

  console.log(req.body);

  login = req.body.userName;
  password = req.body.password;

  console.log(login + " " + password);
  if (login == 'dsalamon' && password == '123') {
    console.log("Logged!");
    res.send({ userName: 'DSalamon', isLogged: true });
  }
  else {
    console.log("Not logged!");
    res.send({ userName: 'DSalamon', isLogged: false });
  }


}); //Line 11)
