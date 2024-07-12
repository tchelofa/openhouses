import { FastifyInstance } from "fastify";
import { ListMyConversations, SendMessage,ListMyMessagesWith, MessageRead } from "../controllers/messageController";

export default async function messageRoute(app: FastifyInstance){
  app.post('/send', SendMessage)
  app.get('/myConversations/:publicId', ListMyConversations)
  app.get('/myMessagesWith/:myId/:contactId', ListMyMessagesWith)
  app.patch('/messageRead/:publicId', MessageRead)
}