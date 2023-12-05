import React, { Component } from 'react';
import axios from 'axios';

class Top extends Component {

    state = {
        isLogged: false,
        userName: null,
        password: null
    }
    loginUser(params) {
        axios.post('/login', params).then( res =>
            {
                
                console.log(params)
                console.log(res);
                // this.setState({isLogged:res.data.isLogged, userName:res.data.userName}) 
                if (res.data.isLogged) {
                    sessionStorage.setItem('userName', res.data.userName);
                    sessionStorage.setItem('isLogged', res.data.isLogged);
                    this.setState({isLogged: res.data.isLogged, userName: res.data.userName});
                    // window.location.href = '/';
                } else {
                    alert("Wrong username or password");
                    this.setState({isLogged: false, userName: null});

                }
            
            }
        );
  }


    render(){
        return(
            <div>
            {sessionStorage.getItem("isLogged") && <p>Zalogowany jako: {sessionStorage.getItem("userName")}</p>}
            
            {!sessionStorage.getItem("isLogged") &&
             <div>
                <p>Niezalogowany</p> 
                <form onSubmit={(e)=> { this.loginUser({userName: this.state.userName, password:this.state.password})}}> 
                    <p><input type='text' placeholder='Username' onChange={ (e) => {  this.setState({userName: e.target.value})}}/></p>
                    <p><input type='password' placeholder='Password' onChange={ (e) => {  this.setState({password: e.target.value})}}/> </p>
                    <p><button type='submit'> Log in !</button></p>
                </form> 
            </div>}
          </div>
        );

    }
}

export default Top;
