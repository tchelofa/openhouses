
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

export async function deletePropertyImage(propertyId: string, imageUrl: string, reply: FastifyReply) {
    try {
        // Exclui o registro da imagem do banco de dados
        await prisma.propertyImgs.deleteMany({
            where: {
                propertyId: propertyId,
                url: imageUrl
            }
        });
    } catch (error) {
        console.error('Error deleting image from database:', error);
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}