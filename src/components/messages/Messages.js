import React, { Component } from 'react';

export default class Messages extends Component {

  componentDidMount() {
    this.scrollDown()
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown()
  }

  scrollDown = () => {
    const { container } = this.refs
    container.scrollTop = container.scrollHeight
  }

  render() {
    const { messages, user, typingUsers } = this.props;
    return (
      <div
        ref="container"
        className="thread-container">
        <div className="thread">
          {
            messages.map(msg => {
              return (
                <div
                  key={msg.id}
                  className={`message-container ${msg.sender === user.name && 'right'}`}>
                  <div className="time">{msg.time}</div>
                  <div className="data">
                    <div className="message">{msg.message}</div>
                    <div className="name">{msg.sender}</div>
                  </div>
                </div>
              )
            })
          }
          {
            typingUsers.map(name => {
              return (
                <div key={name} className="typing-user">
                  {`${name} is typing ...`}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }

}
