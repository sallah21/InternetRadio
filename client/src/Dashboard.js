
import React, { Component } from 'react';
import axios from 'axios';

  
class Dashboard extends Component {

    state = {
        result: [],
        isMounted: false
    }
// TODO DS : query all songs for admin  to pick , playlist logic and creating

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
        <p> <a className='songName'>{item?.songName}</a> <a className='songAuthor'>{item?.songAuthor}</a> <button>Add to queue</button></p>
      </div>
    );
  };
export default Dashboard;
