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
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

var Buffer = require('buffer/').Buffer

var songIdQueue = []
var songsQueue = [];
var coverQueue = [];
var isPlaying = false;

var currentSongId;
var currentSongName;
var currentSongData;
var currentAlbum;
var currentAuthor;
var currentAlbumCover;


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
    const query = {}
    const options = {
      sort: { "songAuthor": 1 },
      projection: { _id: 0, songName: 1, songAuthor: 1, songAlbumName: 1, songAlbumCover: 0, songData: 0 }
    }
    console.log("sending querry");
    // data = await songs.find(query).toArray();
    data = await songs.find().toArray(function (err, docs) {
      if (err) {
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

async function fetchSongData(songId) {
  var data
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    console.log("connected");
    const db = client.db("music");
    const songs = db.collection("songs");

    const id = new ObjectId(songId);

    const query = { _id: id }
    // const options = {
    //   sort: { "_id": 1 },
    //   projection: { _id: 0, songName: 1, songAuthor: 1, songAlbumName: 1, songAlbumCover: 0, songData: 0 }
    // }
    // console.log("sending querry");
    data = await songs.findOne(query);
    if (data) {
      console.log("data fetched!")
    } else {
      console.log("data not found DATA ", data)
    }

  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
    return data;
  }
}


async function stream() {
  console.log("QUEUE ", songIdQueue, "length ", songIdQueue.length)
  if (isPlaying == true) {

  } else {
    try {
      if (songIdQueue.length > 0) {
        currentSongId = songIdQueue.pop();
        console.log("Fetching songs")
        songData = await fetchSongData(currentSongId);
        try {
          // fetching song
          console.log("Fetching song data");

          currentSongData = await fetchfile.getFileFromS3(process.env.AWS_SONG_BUCKET, songData.songKey);
          currentAlbumCover = await fetchfile.getFileFromS3(process.env.AWS_COVER_BUCKET, songData.songAlbumCover
            .replace("https://radiosalamonalbumcovers.s3.eu-north-1.amazonaws.com/", ''));
          currentSongName = songData.songName;
          currentAuthor = songData.songAuthor;
          currentAlbum = songData.songAlbumName;

        } catch (err) {
          console.log("error2".err.message);
        }

      } else {
        console.log("Current size of queue ", currentSongId.length, " Please add songs to queue ")
        return { error: "empty queue" };
      }
    } catch (error) {
      return console.error();
    }
    console.log("song name ", currentSongName, " songAuthor", currentAuthor, " song album cover data", currentAlbumCover);
    data_res = { songName: currentSongName, songAuthor: currentAuthor, songAlbumCover: currentAlbumCover.Body, songAlbum: currentAlbum };
  }
  return data_res;
}

app.post('/add_song_to_queue', function (req, res) {
  // TODO DS: maybe set max length of queue
  songIdQueue.push(req.body[0])
  songsQueue.push(req.body[1]);
  coverQueue.push(req.body[2]);
  console.log("QUEUE AFTER ADD", songIdQueue)
  res.sendStatus(200);
})

app.get('/stream', async (req, res) => {
  const data = await stream().catch(console.dir);
  console.log("RES data: ", data);
  res.send({ result: data });
  // res.send({ express: 'Internet Radio Salamon' }); 
});

app.get('/image', async (req, res) => {
  console.log("IMAGE DATA: ", currentAlbumCover)
  res.writeHead(200, {'Content-Type': 'image/jpeg'});
  res.write(currentAlbumCover.Body, 'binary');
  res.end(null, 'binary');
  res.send();
});

app.get('/bucket_test', function (req, res) {
  try {
    fetchfile.getFileFromS3(process.env.AWS_SONG_BUCKET, "01. STARGAZING.mp3").then(data => {
      console.log("output ", data);
      res.send("S3 succ");
    }).catch((err) => {
      console.log("error1".err);
      res.send(err.message)
    });
  } catch (err) {
    console.log("error2".err.message);
    res.send(err.message);
  }
})


app.get('/express_backend', (req, res) => {
  res.send({ express: 'Internet Radio Salamon' });
});


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
