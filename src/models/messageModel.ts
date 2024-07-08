import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prismaConfig';

export class MessageService {

  async getAllConversations(userPublicId: string) {
    const conversations = await prisma.message.groupBy({
      by: ['userFromId', 'userToId'],
      _max: { createdAt: true },
      where: {
        OR: [
          { userFromId: userPublicId },
          { userToId: userPublicId }
        ]
      },
      orderBy: { _max: { createdAt: 'desc' } },
    });

    const formattedConversations = await Promise.all(conversations.map(async (conversation) => {
      const userFrom = await prisma.user.findUnique({ where: { publicId: conversation.userFromId } });
      const userTo = await prisma.user.findUnique({ where: { publicId: conversation.userToId } });

      return {
        id: conversation.userFromId === userPublicId ? conversation.userToId : conversation.userFromId,
        name: userFrom?.name || userTo?.name || '',
        lastMessage: conversation._max.createdAt,
      };
    }));

    return formattedConversations;
  }

  async getMessagesByConversationId(publicId: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { userFromId: publicId },
          { userToId: publicId }
        ]
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markMessagesAsRead(userPublicId: string, conversationPublicId: string) {
    await prisma.message.updateMany({
      where: { userFromId: conversationPublicId, userToId: userPublicId, status: 'SENT' },
      data: { status: 'READ' },
    });
  }

  async sendMessage(userFromPublicId: string, userToPublicId: string, message: string) {
    return prisma.message.create({
      data: {
        userFromId: userFromPublicId,
        userToId: userToPublicId,
        message,
        status: 'SENT',
      },
    });
  }
}
