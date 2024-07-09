import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

import prisma from "../lib/prismaConfig";

type AccountType = 'TENANT' | 'OWNER' | 'ADMIN' | 'ADVISOR'; // Adicione todos os tipos possíveis aqui
interface JwtPayload {
    id: string;
}

export async function checkPermissions(userId: string, url: string): Promise<boolean> {
    if (userId) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    publicId: userId
                }
            });

            const typeUser = user?.accountType as AccountType;

            // Defina as permissões de acordo com o tipo de usuário e a URL solicitada
            const permissions: Record<AccountType, string[]> = {
                TENANT: ['/tenant-specific-url1', '/tenant-specific-url2'],
                OWNER: ['/owner-specific-url1', '/owner-specific-url2'],
                ADMIN: ['/admin-specific-url1', '/admin-specific-url2'],
                ADVISOR: ['/advisor-specific-url1', '/advisor-specific-url2']
            };

            if (typeUser && permissions[typeUser]) {
                return permissions[typeUser].includes(url);
            }

            return false;
        } catch (error) {
            console.error("Error checking permissions:", error);
            return false;
        }
    } else {
        return false;
    }
}



export async function authMiddleware(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return reply.status(401).send({ error: 'Token not provided' });
        }

        const decoded = await req.jwtVerify<JwtPayload>(); // Aqui, usamos a função genérica com a interface JwtPayload
        const userId = decoded.id;

        if (!await checkPermissions(userId, req.url)) {
            return reply.status(403).send({ error: 'Access denied' });
        }

        req.user = decoded;
        done();
    } catch (error) {
        return reply.status(401).send({ error: 'Invalid token' });
    }
}