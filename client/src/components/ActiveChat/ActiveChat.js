import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { Input, Header, Messages } from './index'
import { connect } from 'react-redux'
import { patchReadConversation, fetchConversations  } from '../../store/utils/thunkCreators'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column'
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between'
  }
}))

const ActiveChat = (props) => {
  const classes = useStyles()
  const { user, patchReadConversation, fetchConversations } = props
  const conversation = props.conversation || {}
  const { id, unreadCount } = conversation

  const markReadHandler = () => {
    if (!unreadCount) return
    patchReadConversation(id)
    fetchConversations()
  }

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header username={conversation.otherUser.username} online={conversation.otherUser.online || false} />
          <Box className={classes.chatContainer} onLoad={markReadHandler()}>
            <Messages messages={conversation.messages} otherUser={conversation.otherUser} userId={user.id} lastMessageReadTime={conversation.lastMessageReadTime} />
            <Input otherUser={conversation.otherUser} conversationId={conversation.id} user={user} />
          </Box>
        </>
      )}
    </Box>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find((conversation) => conversation.otherUser.username === state.activeConversation)
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchConversations: () => dispatch(fetchConversations()),
    patchReadConversation: (conversationId) => {
      dispatch(patchReadConversation(conversationId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat)
