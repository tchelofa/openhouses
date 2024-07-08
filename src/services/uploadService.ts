// uploadService.ts

import { FastifyRequest, FastifyReply } from "fastify";
import fastifyMulter from "fastify-multer";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuração do multer
const upload = fastifyMulter();

export async function uploadPropertyImages(propertyId: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        // Middleware do multer para processar os uploads
        upload.array('images')(request.raw, reply.raw, async (err: any) => {
            if (err) {
                console.error('Error uploading images:', err);
                return reply.status(500).send({
                    status: 'error',
                    message: 'Failed to upload images',
                    error: err.message,
                });
            }

            const uploadedFiles = request.files as fastifyMulter.File[];
            const uploadedImageUrls: string[] = [];

            // Processar cada imagem enviada
            for (const file of uploadedFiles) {
                const fileName = `${propertyId}-${file.originalname}`; // Nome do arquivo no servidor
                const filePath = `${file.destination}/${fileName}`; // Caminho completo onde será salvo

                // Salvar o arquivo em algum local do servidor
                // Exemplo: move o arquivo para o destino definitivo
                // fs.renameSync(file.path, filePath);

                const imageUrl = `http://localhost:3000/uploads/${fileName}`; // URL do arquivo
                uploadedImageUrls.push(imageUrl);
            }

            // Salvar as URLs das imagens no banco de dados usando Prisma
            const createdImages = await prisma.propertyImgs.createMany({
                data: uploadedImageUrls.map(url => ({ url, propertyId })),
            });

            return reply.send({
                status: 'success',
                message: 'Images uploaded successfully',
                uploadedImageUrls: createdImages.map(img => img.url),
            });
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        return reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
