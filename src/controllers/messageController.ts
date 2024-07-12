import { FastifyReply, FastifyRequest } from "fastify";
import { sendMessage, listMyConversations, listMyMessagesWith, messageRead} from "../models/messageModel";

export async function SendMessage(request: FastifyRequest, reply: FastifyReply){
  return await sendMessage(request, reply)
}
export async function ListMyConversations(request: FastifyRequest, reply: FastifyReply){
  return await listMyConversations(request, reply)
}
export async function ListMyMessagesWith(request: FastifyRequest, reply: FastifyReply){
  return await listMyMessagesWith(request, reply)
}
export async function MessageRead(request: FastifyRequest, reply: FastifyReply){
  return await messageRead(request, reply)
}