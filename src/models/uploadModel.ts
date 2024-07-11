
import { FastifyReply } from 'fastify';
import prisma from '../lib/prismaConfig';

export async function uploadPropertyImages(propertyId: string, filename: string, reply: FastifyReply) {
    const file = "https://server.openhouses.ie/properties/images/" + filename
    try {
        const newImage = await prisma.propertyImgs.create({
            data: {
                propertyId: propertyId,
                url: file,
            },
        });
        return newImage;
    } catch (error) {
        console.error('Error saving image to database:', error);
        reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Failed to save image to database.',
        });
        throw error; // Rethrow the error to be caught in the outer try-catch
    }
}
