import React, { Component } from 'react'
import axios from 'axios'
import trackimg from './track_placeholder.png'
import { socket } from './socket'

class Track extends Component {
  state = {
    isPlaying: false,
    trackName: 'Track name',
    trackAuthor: 'Track author',
    trackAlbum: 'Track album',
    trackImg: trackimg
  }
  componentDidMount () {
    // socket.connect('startStream')
  }
//   stream (buffer) {
//     // creates a new buffer source and connects it to the Audio context
//     var source = context.createBufferSource()
//     source.buffer = buffer
//     source.connect(context.destination)
//     source.loop = false
//     // sets it and updates the time
//     source.start(time + context.currentTime)
//     time += buffer.duration // time is global variable initially set to zero
//   }
  async startPlayingMusic () {
//     socket.emit('startStream')
//     const audio = new Audio()
//     // audio.play();
//     var first = true;

//     const audioContext = new AudioContext();
//     const source = audioContext.createBufferSource();
    
//     socket.on('streamData', async chunk => {
//       // Convert the chunk data to an audio buffer using `decodeAudioData`
//       const audioBuffer = await audioContext.decodeAudioData(chunk, {
//         callback: function(audioBuffer) {
//           // Update the audio buffer reference
//           audioBuffer = audioBuffer;
    
//           // Check if the buffer size is sufficient for playback
//           checkBufferSize();
//         },
//       });
//       // If it's the first chunk, set the buffer and start playback
//       if (first) {
//         source.buffer = audioBuffer;
//         source.connect(audioContext.destination);
//         source.start(0);
//         first = false;
//       } else {
//         // For subsequent chunks, append them to the existing audio buffer
//         if (source.buffer) {
//           source.buffer.append(audioBuffer);
//         } else {
//           source.buffer = audioBuffer;
//         }
//       }
//     });
// =
    // console.log(chunk)

    // socket.on('streamData', (chunk)=>{
    //     console.log(chunk)
    // })
    if(!this.state.isPlaying) {
        axios.get('/stream').then(res => {
            this.setState({ audioSrc: '/' });
            console.log(res.data.result);
            var q_result = res.data.result;
            if (res.status !== 200) {
                throw Error(res.message);
            }
            this.setState({ trackName: q_result.songName, trackAuthor: q_result.songAuthor, trackAlbum: q_result.songAlbum, trackImg: '/image' });
        }
        );
        const context = new AudioContext();

        const audio = new Audio();
        audio.crossOrigin = 'anonymous'; // Useful to play hosted live stream with CORS enabled
        audio.src= '/audioStream';
        const sourceAudio = context.createMediaElementSource(audio);
        sourceAudio.connect(context.destination);

    
        audio.play()
        this.setState({isPlaying: true});
    }
    else{
        alert("Radio is currently playing")
    }
  }
  stopPlayingMusic () {}

  render () {
    return (
      <div className='trackContainer'>
        <p className='trackName'>{this.state.trackName}</p>
        <p className='trackAuthor'>{this.state.trackAuthor}</p>
        <p className='trackAlbum'>{this.state.trackAlbum}</p>
        <img
          className='trackImg'
          src={this.state.trackImg}
          alt='track image'
        ></img>

        {/* <p><audio className='musicSource' src={this.state.audioSrc} type="audio/mp3" preload='none' controls autoPlay>   Your browser does not support the audio element.</audio></p> */}
        <p>
          <button
            className='playButton'
            onClick={() => this.startPlayingMusic()}
          >
            Play
          </button>
        </p>
        <p>
          <button
            className='playButton'
            onClick={() => this.stopPlayingMusic()}
          >
            Play
          </button>
        </p>
      </div>
    )
  }
}
export default Track
