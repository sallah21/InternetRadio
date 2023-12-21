
import React, { Component } from 'react';
import axios from 'axios';

  function addToQueue(songData, songCover) {
    try {
        axios.post('/add_song_to_queue', [songData,songCover]).then( (res) => {
            console.log("add song to queue :", res)
        });
    } catch (e){
        console.log("post error", e);
    }
}
class Dashboard extends Component {

    state = {
        result: [],
        isMounted: false
    }


    componentDidMount(){
        if(!this.state.isMounted){
            axios.get('/getallsongs').then(  res => {
                console.log("data res",res.data.result);
        
                    this.setState({result: res.data.result});
                    console.log("STATE AFTER SETSTATE",this.state.result)
                    this.setState({isMounted: true});
                }
            );
        }

    }
    render(){
        return(
            <div>
            {this.state.result?.map((item) => {

                console.log("ajtem" +item?.songName)
               return <Item key={item?.songName} item={item}></Item>
               
            })}
          </div>
        );

    }
}
const Item =  ({ item }) => {
    return (
      <div>
        <p> <a className='songName'>{item?.songName}</a> <a className='songAuthor'>{item?.songAuthor}</a> <button onClick={() =>addToQueue(item._id,item.songData, item.songAlbumCover)}>Add to queue</button></p>
      </div>
    );
  };
export default Dashboard;
