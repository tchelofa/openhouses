import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../lib/prismaConfig";
import { sendSuccess, sendError } from '../utils/response';
import { MessageSchema } from "../lib/ZodSchemas";

export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
	const { userFromId, userToId, message } = request.body as { userFromId: string, userToId: string, message: string };

	try {
		// Check if userFromId and userToId exist
		const userFrom = await prisma.user.findUnique({ where: { publicId: userFromId } });

		const userTo = await prisma.user.findUnique({ where: { publicId: userToId } });

		if (!userTo) {
			return sendError(reply, 400, 'User To ID do not exist');
		}
		if (!userFrom) {
			return sendError(reply, 400, 'User From ID do not exist');
		}


		// Create the message
		const sendMessage = await prisma.message.create({
			data: {
				userFromId,
				userToId,
				message,
				status: "SENT",
			}
		});

		sendSuccess(reply, 'Message sent successfully', sendMessage);

	} catch (error) {
		sendError(reply, 500, 'Internal server error', error);
	}
}


export async function listMyConversations(request: FastifyRequest, reply: FastifyReply) {
	const { publicId } = request.params as { publicId: string };

	try {
		// Obtenha todas as mensagens onde o publicId está envolvido
		const myConversations = await prisma.message.findMany({
			where: {
				OR: [
					{ userFromId: publicId },
					{ userToId: publicId }
				]
			},
			select: {
				userFromId: true,
				userToId: true,
			}
		});

		// Crie um conjunto de IDs únicos dos usuários
		const userIds = new Set<string>();
		myConversations.forEach(message => {
			if (message.userFromId !== publicId) userIds.add(message.userFromId);
			if (message.userToId !== publicId) userIds.add(message.userToId);
		});

		// Converta o conjunto para um array
		const uniqueUserIds = Array.from(userIds);

		// Busque os detalhes dos usuários no banco de dados
		const users = await prisma.user.findMany({
			where: {
				publicId: { in: uniqueUserIds }
			},
			select: {
				publicId: true,
				name: true
			}
		});

		// Retorne a lista de usuários
		sendSuccess(reply, 'Users retrieved successfully', users);
	} catch (error) {
		sendError(reply, 500, 'Internal server error', error);
	}
}

export async function listMyMessagesWith(request: FastifyRequest, reply: FastifyReply) {
	const { myId, contactId } = request.params as { myId: string, contactId: string };
	try {
		// Obtenha todas as mensagens onde ambos os IDs estão envolvidos
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						AND: [
							{ userFromId: myId },
							{ userToId: contactId }
						]
					},
					{
						AND: [
							{ userFromId: contactId },
							{ userToId: myId }
						]
					}
				]
			},
			include: {
				userFrom: {
					select: {
						publicId: true,
						name: true
					}
				},
				userTo: {
					select: {
						publicId: true,
						name: true
					}
				}
			}
		});

		// Retorne as mensagens com os dados dos usuários
		sendSuccess(reply, 'Messages retrieved successfully', messages);
	} catch (error) {
		sendError(reply, 500, 'Internal server error', error);
	}
}

export async function messageRead(request: FastifyRequest, reply: FastifyReply){
	const { publicId } = request.params as { publicId: string };
	try {
		const mark = await prisma.message.update({
			where:{
				publicId
			},
			data:{
				status:"READ"
			}
		})
		sendSuccess(reply, 'Message sent successfully', sendMessage);
	} catch (error) {
		sendError(reply, 500, 'Internal server error', error);
	}
}