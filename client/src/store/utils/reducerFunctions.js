export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text
    }
    return [newConvo, ...state]
  }

  return state.map((convo) => {
    if (convo.id !== message.conversationId) return convo
    convo.messages.push(message)
    convo.latestMessageText = message.text
    return { ...convo }
  })
}

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id !== id) return convo
    convo.otherUser.online = true
    return { ...convo }
  })
}

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id !== id) return convo
    convo.otherUser.online = false
    return { ...convo }
  })
}

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {}

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true
  })

  const newState = [...state]
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] }
      newState.push(fakeConvo)
    }
  })

  return newState
}

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id !== recipientId) return convo
    convo.id = message.conversationId
    convo.messages.push(message)
    convo.latestMessageText = message.text
    return { ...convo }
  })
}
