require('dotenv').config()
const express = require('express') //Line 1
const bodyParser = require('body-parser')
const Throttle = require('throttle')
const app = express() //Line 2
const port = process.env.PORT || 5000 //Line 3
const streamo = require('stream')

app.use(express.static('public'))
const fetchfile = require('./fetchFile')
var jsonParser = bodyParser.json()
app.use(jsonParser)
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(urlencodedParser)
const { MongoClient, ObjectId } = require('mongodb')

const client = new MongoClient(process.env.MONGODB_URI)

var sinks = new Map() // list of currently listening users
// var sinks = [];
var songIdQueue = []
var songsQueue = []
var coverQueue = []
var isPlaying = false

var currentSongId
var currentSongName
var currentSongData
var currentAlbum
var currentAuthor
var currentAlbumCover

// This displays message that the server running and listening to specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

/*
  Socket logic
*/
const { Server } = require('socket.io')
const WebSocket = require('ws')
const server = require('http').createServer(app)
const io = new Server({
  cors: {
    origin: 'http://localhost:3000'
  }
})
// const wss = new WebSocket.Server ({server: server});
const broadcastAudio = audioChunk => {
  audioStream.write(audioChunk)
  io.emit('audio-stream', audioChunk)
}
var clients = []
// io.on('connection', socket => {
//   console.log('new conn', socket.id)
//   clients.push(socket)
//   socket.on('startStream', async () => {
//     bitRate = 320 * 1024
//     const throttle = new Throttle(bitRate, 320 * 1024)

//     currentSongId = songIdQueue.pop()
//     console.log('Fetching songs')
//     songData = await fetchSongData(currentSongId)
//     try {
//       currentSongData = await fetchfile.getFileFromS3(
//         process.env.AWS_SONG_BUCKET,
//         songData.songKey
//       )
//       currentAlbumCover = await fetchfile.getFileFromS3(
//         process.env.AWS_COVER_BUCKET,
//         songData.songAlbumCover.replace(
//           'https://radiosalamonalbumcovers.s3.eu-north-1.amazonaws.com/',
//           ''
//         )
//       )
//       currentSongName = songData.songName
//       currentAuthor = songData.songAuthor
//       currentAlbum = songData.songAlbumName
//       isPlaying = true
//       console.log(
//         'song name after load in func ',
//         currentSongName,
//         ' songAuthor',
//         currentAuthor,
//         ' song album cover data',
//         currentAlbumCover
//       )
//     } catch (err) {
//       console.log('error2'.err.message)
//     }
//     var strim = new streamo.Readable.from(currentSongData.Body)
//     strim.pipe(throttle)
//     io.emit('bufferHeader', )
//     throttle.on('data', chunk => {
//       // console.log(chunk)
//       // sendToEveryone(chunk)
  
//         for (const client of clients) {
//           // console.log("emit");
//           io.emit('streamData', chunk)
//         }
//     })
//     throttle.on('error', e => console.log(e))
//     throttle.on('end', () => {
//       isPlaying = false
//       console.log('end of song')
//       stream()
//     })
//   })
// })

app.get('/', function (req, res) {
  res.send('ok')
})

io.listen(4000)

// io.on('streamSong')

async function run () {
  var data
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect()
    console.log('connected')
    const db = client.db('music')
    const songs = db.collection('songs')
    const query = {}
    const options = {
      sort: { songAuthor: 1 },
      projection: {
        _id: 0,
        songName: 1,
        songAuthor: 1,
        songAlbumName: 1,
        songAlbumCover: 0,
        songData: 0
      }
    }
    console.log('sending querry')
    // data = await songs.find(query).toArray();
    data = await songs.find().toArray(function (err, docs) {
      if (err) {
        return res.send('error', err)
      }
      client.close()
      console.log(docs)
      return data
    })
  } finally {
    // Ensures that the client will close when you finish/error

    return data
  }
}

async function fetchSongData (songId) {
  var data
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect()
    console.log('connected')
    const db = client.db('music')
    const songs = db.collection('songs')

    const id = new ObjectId(songId)

    const query = { _id: id }

    data = await songs.findOne(query)
    if (data) {
      console.log('data fetched!')
    } else {
      console.log('data not found DATA ', data)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    client.close()
    return data
  }
}

async function loadData () {
  try {
    if (songIdQueue.length > 0) {
      currentSongId = songIdQueue.pop()
      console.log('Fetching songs')
      songData = await fetchSongData(currentSongId)
      try {
        // fetching song
        console.log('Fetching song data')

        currentSongData = await fetchfile.getFileFromS3(
          process.env.AWS_SONG_BUCKET,
          songData.songKey
        )
        currentAlbumCover = await fetchfile.getFileFromS3(
          process.env.AWS_COVER_BUCKET,
          songData.songAlbumCover.replace(
            'https://radiosalamonalbumcovers.s3.eu-north-1.amazonaws.com/',
            ''
          )
        )
        currentSongName = songData.songName
        currentAuthor = songData.songAuthor
        currentAlbum = songData.songAlbumName
        console.log(
          'song name after load in func ',
          currentSongName,
          ' songAuthor',
          currentAuthor,
          ' song album cover data',
          currentAlbumCover
        )
      } catch (err) {
        console.log('error2'.err.message)
      }
    } else {
      console.log(
        'Current size of queue ',
        currentSongId.length,
        ' Please add songs to queue '
      )
      isPlaying = false
      return { error: 'empty queue' }
    }
  } catch (error) {
    return console.error()
  }
}

async function stream () {
  console.log('QUEUE ', songIdQueue, 'length ', songIdQueue.length)
  console.log('is playing ?', isPlaying)
  if (isPlaying == true) {
    console.log('Audio is playing!')
    // playAudio();
    data_res = {
      songName: currentSongName,
      songAuthor: currentAuthor,
      songAlbumCover: currentAlbumCover.Body,
      songAlbum: currentAlbum
    }
  } else {
    try {
      if (songIdQueue.length > 0) {
        currentSongId = songIdQueue.pop()
        console.log('Fetching songs')
        songData = await fetchSongData(currentSongId)
        try {
          currentSongData = await fetchfile.getFileFromS3(
            process.env.AWS_SONG_BUCKET,
            songData.songKey
          )
          currentAlbumCover = await fetchfile.getFileFromS3(
            process.env.AWS_COVER_BUCKET,
            songData.songAlbumCover.replace(
              'https://radiosalamonalbumcovers.s3.eu-north-1.amazonaws.com/',
              ''
            )
          )
          currentSongName = songData.songName
          currentAuthor = songData.songAuthor
          currentAlbum = songData.songAlbumName
          isPlaying = true
          playAudio()
          // console.log("song name after load in func ", currentSongName, " songAuthor", currentAuthor, " song album cover data", currentAlbumCover);
        } catch (err) {
          console.log('error2'.err.message)
        }
      } else {
        console.log(
          'Current size of queue ',
          currentSongId.length,
          ' Please add songs to queue '
        )
        isPlaying = false
        return { error: 'empty queue' }
      }
    } catch (error) {
      return console.error()
    }
    // console.log("song name after load ", currentSongName, " songAuthor", currentAuthor, " song album cover data", currentAlbumCover);
    data_res = {
      songName: currentSongName,
      songAuthor: currentAuthor,
      songAlbum: currentAlbum
    }
  }
  console.log('Current number of sinks ', sinks.size)
  return data_res
}

const playAudio = async () => {
  bitRate = 320 * 1024
  const throttle = new Throttle(bitRate, 320 * 1024)

  // var strim  = currentSongData.Body.createReadStream();
  // var strim = Fs.createReadStream(currentSongData)
  var strim = new streamo.Readable.from(currentSongData.Body)
  strim.pipe(throttle)
  throttle.on('data', chunk => {
    // console.log(chunk)
    sendToEveryone(chunk)
  })
  throttle.on('error', e => console.log(e))
  throttle.on('end', () => {
    isPlaying = false
    console.log('end of song')
    stream()
  })
}

app.post('/add_song_to_queue', function (req, res) {
  // TODO DS: maybe set max length of queue
  songIdQueue.push(req.body[0])
  songsQueue.push(req.body[1])
  coverQueue.push(req.body[2])
  console.log('QUEUE AFTER ADD', songIdQueue)
  res.sendStatus(200)
})

/*

  Stream logic

*/

app.get('/stream', async (req, res) => {
  const data = await stream().catch(console.dir)
  console.log('RES data: ', data)
  res.send({ result: data })
})

const sendToEveryone = chunk => {
  for (const [, sink] of sinks) {
    sink.write(chunk)
  }
}

const CreateStream = () => {
  const id = Math.random().toString(36).slice(2)
  const stream = new streamo.PassThrough()
  // sinks.push(stream);
  sinks.set(id, stream)
  console.log('CREATE STREAM SIZE AFTER :', sinks.size)
  return { id, stream }
}

app.get('/audioStream', (req, res) => {
  console.log('Creating SINK! ')
  const { id, stream } = CreateStream() // We create a new stream for each new client
  console.log('CREATE STREAM SIZE PIPE :', sinks.size)
  // res.setHeader("Content-Type", "audio/mp3")
  stream.pipe(res).type('audio/mpeg')
  res.on('error', e => {
    console.log('Errpr', e)
  })
  res.on('close', () => {
    console.log('SINK delete', id)
    sinks.delete(id)
  })
})

/*

  Addtional endpoints 

*/
app.get('/image', async (req, res) => {
  // console.log("IMAGE DATA: ", currentAlbumCover)
  res.writeHead(200, { 'Content-Type': 'image/jpeg' })
  res.write(currentAlbumCover.Body, 'binary')
  res.end(null, 'binary')
  res.send()
})

app.get('/express_backend', (req, res) => {
  res.send({ express: 'Internet Radio Salamon' })
})

app.get('/data', (req, res) => {
  //Line 9
  res.send({
    title: 'Internet Radio Salamon',
    desc: 'Internetowe radio Dawida Salamona '
  })
}) //Line 11)

app.get('/getallsongs', async (req, res) => {
  //Line 9
  const data = await run().catch(console.dir)
  // console.log("res data" + data)
  res.send({ result: data })
}) //Line 11)

app.post('/login', jsonParser, (req, res) => {
  //Line 9

  console.log(req.body)

  login = req.body.userName
  password = req.body.password

  console.log(login + ' ' + password)
  if (login == 'dsalamon' && password == '123') {
    console.log('Logged!')
    res.send({ userName: 'DSalamon', isLogged: true })
  } else {
    console.log('Not logged!')
    res.send({ userName: 'DSalamon', isLogged: false })
  }
}) //Line 11)
