import React from 'react'
import { Badge, Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 20,
    flexGrow: 1,
    alignItems: 'center'
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2
  },
  previewText: {
    fontSize: 12,
    letterSpacing: -0.17,
    color: ({ unreadCount }) => unreadCount > 0 ? 'black' : '#9CADC8',
    fontWeight: ({ unreadCount }) => unreadCount > 0 ? 'bold' : 'normal'
  },
  badgeMarginRight: {
    marginRight: theme.spacing(4)
  }
}))

const ChatContent = (props) => {
  const { conversation } = props
  const { latestMessageText, otherUser, unreadCount } = conversation
  const classes = useStyles({ unreadCount })

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>{otherUser.username}</Typography>
        <Typography className={classes.previewText}>{latestMessageText}</Typography>
      </Box>
      <Badge className={classes.badgeMarginRight} badgeContent={unreadCount} color='primary'></Badge>
    </Box>
  )
}

export default ChatContent
