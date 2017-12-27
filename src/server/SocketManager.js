const io = require('./index').io

const { VERIFY_USER, USER_CONNECTED,
  USER_DISCONNECTED, LOGOUT,
  MESSAGE_RECEIVED, MESSAGE_SENT,
  TYPING, COMMUNITY_CHAT, PRIVATE_MESSAGE } = require('../Const');

const { createUser, createMessage, createChat } = require('../Factories');

let communityChat = createChat({ isCommunity: true})

let connectedUsers = { }

module.exports = socket => {

  console.log(`Socket ID is ${socket.id}`);

  let sendMessageToChatFromUser;

  let sendTypingFromUser;

  socket.on(VERIFY_USER, (nickname, cb) => {
    if(isUser(connectedUsers, nickname)) {
      cb({ isUser:true, user:null })
    } else {
      cb({ isUser:false, user:createUser({name:nickname, socketId:socket.id}) })
    }
  })

  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name)
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)
  })

  socket.on('disconnect', () => {
    if ('user' in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name)

      io.emit(USER_DISCONNECTED, connectedUsers)
    }
  })

  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)

    io.emit(USER_DISCONNECTED, connectedUsers)
  })

  socket.on(COMMUNITY_CHAT, (cb) => {
    cb(communityChat)
  })

  socket.on(MESSAGE_SENT, ({chatId, message}) => {
    sendMessageToChatFromUser(chatId, message)
  })

  socket.on(TYPING, ({chatId, isTyping}) => {
    sendTypingFromUser(chatId, isTyping)
  })

  socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat}) => {
    if(receiver in connectedUsers){
      const receiverSocket = connectedUsers[receiver].socketId
      if(activeChat === null || activeChat.id === communityChat.id ) {
        const newChat = createChat( {name:`${receiver} & ${sender}`, users:[receiver, sender] })

        socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat)
        socket.emit(PRIVATE_MESSAGE, newChat)
      } else {
        socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat)
      }
    }
  })

}

addUser = (userList, user) => {
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

removeUser = (userList, username) => {
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

isUser = (userList, username) => {
  return username in userList
}

sendMessageToChat = sender => {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
  }
}

sendTypingToChat = user => {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping})
  }
}
