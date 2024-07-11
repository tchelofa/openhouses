// utils/response.ts
import { FastifyReply } from 'fastify';

export function sendSuccess(reply: FastifyReply, message: string, data?: any) {
    reply.status(200).send({
        status: 'success',
        message,
        data,
    });
}

export function sendError(reply: FastifyReply, statusCode: number, message: string, error?: any) {
    reply.status(statusCode).send({
        status: 'error',
        message,
        error: error ? error.message : undefined,
    });
}