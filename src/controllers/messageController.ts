import { FastifyReply, FastifyRequest } from 'fastify';
import { MessageService } from '../models/messageModel';

const messageService = new MessageService();

export class MessageController {

  async getAllConversations(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = (request.user as { publicId: string }).publicId;
    try {
      const conversations = await messageService.getAllConversations(userPublicId);
      reply.send(conversations);
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({ message: 'Internal server error', error: error.message });
      }
    }
  }

  async getMessagesByConversationId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const messages = await messageService.getMessagesByConversationId(id);
      reply.send(messages);
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({ message: 'Internal server error', error: error.message });
      }
    }
  }

  async markMessagesAsRead(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const userPublicId = (request.user as { publicId: string }).publicId;
    try {
      await messageService.markMessagesAsRead(userPublicId, id);
      reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({ message: 'Internal server error', error: error.message });
      }
    }
  }

  async sendMessage(request: FastifyRequest<{ Body: { userToId: string; userFromPublicId: string; message: string } }>, reply: FastifyReply) {
    const { userToId, userFromPublicId, message } = request.body;

    try {
      const sentMessage = await messageService.sendMessage(userFromPublicId, userToId, message);
      reply.send(sentMessage);
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({ message: 'Internal server error', error: error.message });
      }
    }
  }
}
