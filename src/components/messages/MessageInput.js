import React, { Component } from 'react';

export default class MessageInput extends Component {
  constructor(props){
  	super(props);
  	this.state = {
      message:"",
      isTyping: false
    };
  }

  componentWillUnmount() {
    this.stopCheckTyping()
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.sendMessage()
    this.setState({message:""})
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message)
  }

  sendTyping = () => {
    const { sendTyping } = this.props;
    this.lastUpdateTime = Date.now()
    if(!this.state.isTyping) {
      this.setState({isTyping:true})
      sendTyping(true)
      this.startCheckTyping()
    }
  }

  startCheckTyping = () => {
    this.typeInterval = setInterval(() => {
      if ((Date.now() - this.lastUpdateTime) > 300) {
        this.setState({isTyping:false})
        this.stopCheckTyping()
      }
    }, 300)
  }

  stopCheckTyping = () => {
    if (this.typeInterval) {
      clearInterval(this.typeInterval)
      this.props.sendTyping(false)
    }
  }

  render() {
    const { message } = this.state;
    return (
      <div className="message-input">
        <form
          onSubmit={this.onSubmit}
          className='message-form'
          >
          <input
            type="text"
            id='message'
            ref={'messageinput'}
            className='form-control'
            value={message}
            autoComplete={'off'}
            placeholder='Speak your mind'
            onKeyUp={e => { e.keyCode !== 13 && this.sendTyping() }}
            onChange= { ({target}) => {
              this.setState({message:target.value})
            }}
          />
          <button
            disabled={ message.length < 1}
            type='submit'
            className='send'
            >Send</button>
        </form>
      </div>
    );
  }

}
