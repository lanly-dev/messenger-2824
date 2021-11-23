const router = require('express').Router()
const { User, Conversation, Message } = require('../../db/models')
const { Op } = require('sequelize')
const onlineUsers = require('../../onlineUsers')

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401)

    const userId = req.user.id
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId
        }
      },
      attributes: ['id'],
      order: [[Message, 'createdAt', 'DESC']],
      include: [
        { model: Message, order: ['createdAt', 'DESC'] },
        {
          model: User,
          as: 'user1',
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false
        },
        {
          model: User,
          as: 'user2',
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false
        }
      ]
    })

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i]
      const convoJSON = convo.toJSON()

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1
        delete convoJSON.user1
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2
        delete convoJSON.user2
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true
      } else {
        convoJSON.otherUser.online = false
      }

      // set latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text

      // set notification count
      convoJSON.unreadCount = 0
      for (let i = 0; i < convoJSON.messages.length; i++) {
        const { isRead, senderId } = convoJSON.messages[i]
        if (senderId === convoJSON.otherUser.id && !isRead) {
          convoJSON.unreadCount++
          continue
        }
        break
      }

      for (let i = 0; i < convoJSON.messages.length; i++) {
        const { createdAt, isRead, senderId } = convoJSON.messages[i]
        if (senderId !== userId) continue
        if (isRead) {
          convoJSON.lastMessageReadTime = createdAt
          break
        }
      }
      // Reverse order
      convoJSON.messages.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)
      conversations[i] = convoJSON
    }

    res.json(conversations)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401)

    const userId = req.user.id
    const { id } = req.params

    const convoFound = await Conversation.findOne({ where: { id } })

    if (!convoFound) return res.sendStatus(404)
    const { user1Id, user2Id } = convoFound
    if (![user1Id, user2Id].includes(userId)) return res.sendStatus(403)

    await Message.update({ isRead: true }, {
      where: {
        conversationId: id,
        senderId: { [Op.not]: userId },
        isRead: false
      }
    })
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})


module.exports = router
