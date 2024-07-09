import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs'; // Use fs for synchronous operations
import * as util from 'util';
import { pipeline } from 'stream';
import path from 'path';
import { uploadPropertyImages } from '../models/uploadModel';

const pump = util.promisify(pipeline);
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 Megabytes in bytes

export async function UploadController(app: FastifyInstance) {
    const uploadFolder = "/properties"; // Define the upload folder path

    // Check if the upload directory exists and create it if it doesn't
    try {
        fs.mkdirSync(path.join(__dirname, `../uploads/${uploadFolder}`), { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
        // Handle error appropriately (e.g., stop server or prevent uploads)
    }

    app.post('/multiplefiles/:propertyId', async (request: FastifyRequest, reply: FastifyReply) => {

        const {propertyId} = request.params as { propertyId: string }

        try {
            const parts = request.parts();

            for await (const part of parts) {
                if (part.type === 'file') {
                    const data = part.file;
                    const sanitizedFilename = path.parse(part.filename).base.replace(/[^a-zA-Z0-9_\.]/g, '_'); // Exclude dot from replacement
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const uniqueFilename = `${uniqueSuffix}-${sanitizedFilename}`;

                    let uploadedBytes = 0;
                    data.on('data', (chunk: Buffer) => {
                        uploadedBytes += chunk.length;
                    });

                    if (uploadedBytes > MAX_FILE_SIZE) {
                        console.error(`File: ${uniqueFilename} exceeds maximum size (2MB)`);
                        reply.code(413).send({
                            statusCode: 413,
                            error: 'Payload Too Large',
                            message: `File: ${uniqueFilename} exceeds maximum size (2MB). Please upload files under 2MB.`,
                        });
                        continue; // Skip processing this file and continue to the next one
                    }

                    const filePath = path.join(__dirname, `../uploads/${uploadFolder}`, uniqueFilename);
                    await pump(data, fs.createWriteStream(filePath));
                    const saveImage = await uploadPropertyImages(propertyId, uniqueFilename, reply)
                    console.log(`File uploaded: ${saveImage}`);
                } else {
                    // It's a field
                    console.log(`Field ${part.fieldname}: ${part.value}`);
                }
            }

            reply.code(200).send({
                statusCode: 200,
                message: 'Files uploaded successfully.',
            });
        } catch (error) {
            if (error instanceof Error) { // Use type guard to check for Error type
                console.error('Error message:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    });
}