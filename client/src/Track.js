import React, { Component } from 'react';
import axios from 'axios';
import trackimg from './track_placeholder.png'
class Track extends Component {
    state = {
        isPlaying: false,
        trackName: 'Track name',
        trackAuthor: 'Track author',
        trackAlbum : 'Track album'
    };
    startPlayingMusic(){
        axios.get('/music').then( res =>
        
            {
                console.log(res);
                if (res.status !== 200) {
                    throw Error(res.message) ;
                }
                
             }
        );
    
    }
    render(){
        return(
            <div className='trackContainer'>  
           <p className='trackName'>{this.state.trackName}</p>
           <p className='trackAuthor'>{this.state.trackAuthor}</p>
           <p className='trackAlbum'>{this.state.trackAlbum}</p>
           <img className='trackImg' src= {trackimg} alt='track placeholder'></img>
           <p><audio >   Your browser does not support the audio element.</audio></p>
           <p><button className='playButton'>Play</button></p>
          </div>
        );

    }
}
export default Track;
