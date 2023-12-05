
import React, { Component } from 'react';
import axios from 'axios';

  
class Dashboard extends Component {

    state = {
        result: []
    }
// TODO DS : query all songs for admin  to pick , playlist logic and creating
    componentDidMount(){
        axios.get('/getallsongs').then( async res => {
            console.log(res.data.result);
                this.setState({result: [res.data.result]});
            }
        );
    }
    render(){
        return(
            <div>
            {this.state.result.map((item) => {
                console.log("ajtem" +item?.songName)
               return <Item item={item}></Item>
            })}
          </div>
        );

    }
}
const Item =  ({ item }) => {
    return (
      <div>
        <h1>{item?.songName}</h1>
        <p>{item?.songAuthor}</p>

        
      </div>
    );
  };
export default Dashboard;
