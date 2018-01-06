import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from "../Const";
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';

const socketUrl = 'http://localhost:5000';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: null
    }
  }

  componentDidMount() {
    this.initSocket()
  }

  initSocket = () => {
    const socket = io.connect(socketUrl)
    socket.on('connect', () => {
      console.log('Connected')
    })
    this.setState({socket});
  }

  setUser = user => {
    const { socket } = this.state
    socket.emit(USER_CONNECTED, user);
    this.setState({user})
  }

  logout = () => {
    const { socket } = this.state
    socket.emit(LOGOUT);
    this.setState({user:null})
  }

  render() {
    const { socket, user } = this.state;
    return (
      <Fragment>
        {
          !user ?
          <LoginForm
            socket={socket}
            setUser={this.setUser}
            />
          :
          <ChatContainer
            socket={socket}
            user={user}
            logout={this.logout}
            />
        }
      </Fragment>
    );
  }

}

export default Home;
