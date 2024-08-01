import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as util from 'util';
import { pipeline } from 'stream';
import path from 'path';
import { deletePropertyImage, uploadPropertyImages } from '../models/uploadModel';

const pump = util.promisify(pipeline);
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 Megabytes in bytes

export async function UploadController(app: FastifyInstance) {
    const uploadFolder = "/properties"; // Define the upload folder path

    // Check if the upload directory exists and create it if it doesn't
    try {
        fs.mkdirSync(path.join(__dirname, `../uploads/${uploadFolder}`), { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }

    app.post('/multiplefiles/:propertyId', async (request: FastifyRequest, reply: FastifyReply) => {
        const { propertyId } = request.params as { propertyId: string };

        try {
            const parts = request.parts();

            for await (const part of parts) {
                if (part.type === 'file') {
                    const data = part.file;
                    const sanitizedFilename = path.parse(part.filename).base.replace(/[^a-zA-Z0-9_\.]/g, '_');
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const uniqueFilename = `${uniqueSuffix}-${sanitizedFilename}`;

                    let uploadedBytes = 0;
                    data.on('data', (chunk: Buffer) => {
                        uploadedBytes += chunk.length;
                    });

                    if (uploadedBytes > MAX_FILE_SIZE) {
                        console.error(`File: ${uniqueFilename} exceeds maximum size (3MB)`);
                        reply.code(413).send({
                            statusCode: 413,
                            error: 'Payload Too Large',
                            message: `File: ${uniqueFilename} exceeds maximum size (3MB). Please upload files under 3MB.`,
                        });
                        continue;
                    }

                    const filePath = path.join(__dirname, `../uploads/${uploadFolder}`, uniqueFilename);
                    await pump(data, fs.createWriteStream(filePath));
                    const saveImage = await uploadPropertyImages(propertyId, uniqueFilename, reply);
                }
            }

            reply.code(200).send({
                statusCode: 200,
                message: 'Files uploaded successfully.',
            });
        } catch (error) {
            console.error('Error during file upload:', error);
            reply.code(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'An error occurred during file upload.',
            });
        }
    });

    app.delete('/delete/:propertyId', async (request: FastifyRequest, reply: FastifyReply) => {
        const { propertyId } = request.params as { propertyId: string };
        const { image } = request.body as { image: string };

        try {
            const filePath = path.join(__dirname, `../uploads/${uploadFolder}`, path.basename(image));

            // Verifique se o arquivo existe antes de tentar deletá-lo
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, async (err) => {
                    if (err) {
                        console.error('Error deleting file from server:', err);
                        return reply.code(500).send({
                            statusCode: 500,
                            error: 'Internal Server Error',
                            message: 'An error occurred while deleting the file from the server.',
                        });
                    }

                    // Remove o registro da imagem do banco de dados
                    await deletePropertyImage(propertyId, image, reply);

                    reply.code(200).send({
                        statusCode: 200,
                        message: 'Image deleted successfully.',
                    });
                });
            } else {
                // Se o arquivo não existir, apenas remova o registro do banco de dados
                await deletePropertyImage(propertyId, image, reply);

                reply.code(200).send({
                    statusCode: 200,
                    message: 'Image record deleted successfully, but file was not found on server.',
                });
            }
        } catch (error) {
            console.error('Error during image deletion:', error);
            reply.code(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'An error occurred during image deletion.',
            });
        }
    });
}
