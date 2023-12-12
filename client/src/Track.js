import React, { Component } from 'react';
import axios from 'axios';
import trackimg from './track_placeholder.png'

class Track extends Component {
    state = {
        isPlaying: false,
        trackName: 'Track name',
        trackAuthor: 'Track author',
        trackAlbum: 'Track album',
        trackImg: trackimg
    };

    crateImg(data) {

    }
    startPlayingMusic() {
        axios.get('/stream').then(res => {
            console.log(res.data.result);
            var q_result = res.data.result;
            if (res.status !== 200) {
                throw Error(res.message);
            }

            this.setState({ trackName: q_result.songName, trackAuthor: q_result.songAuthor, trackAlbum: q_result.songAlbum,trackImg: '/image'});

        }
        );

    }
    render() {
        return (
            <div className='trackContainer'>
                <p className='trackName'>{this.state.trackName}</p>
                <p className='trackAuthor'>{this.state.trackAuthor}</p>
                <p className='trackAlbum'>{this.state.trackAlbum}</p>
                <img className='trackImg' src={this.state.trackImg} alt="track image"></img>
                <p><audio src='/stream' >   Your browser does not support the audio element.</audio></p>
                <p><button className='playButton' onClick={() => this.startPlayingMusic()}>Play</button></p>
            </div>
        );

    }
}
export default Track;
