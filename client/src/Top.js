import React, { Component } from 'react';
import axios from 'axios';

class Top extends Component {

    state = {
        isLogged: false,
        userName: null
    }
    loginUser(params) {
    axios.post('/login', params).then( res =>
        
        {console.log(res);this.setState({isLogged:res.data.isLogged, userName:res.data.userName}) }
    );


  }

    render(){
        return(
            <div>
            {this.state.isLogged && <p>Zalogowany jako: {this.state.userName}</p>}
            {!this.state.isLogged && <div><p>Niezalogowany</p> <button onClick={()=>this.loginUser({login:'dsalamon', password:'123'})}> login</button>  </div>}
          </div>
        );

    }
}

export default Top;
