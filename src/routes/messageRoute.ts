import { FastifyInstance } from "fastify";
import { MessageController } from "../controllers/messageController";

const messageController = new MessageController();

export default async function messageRoutes(app: FastifyInstance) {
    app.get('/conversations', messageController.getAllConversations.bind(messageController));
    app.get('/conversations/:publicId/messages', messageController.getMessagesByConversationId.bind(messageController));
    app.patch('/conversations/:publicId/read', messageController.markMessagesAsRead.bind(messageController));
    app.post('/conversations/send', messageController.sendMessage.bind(messageController));
}
