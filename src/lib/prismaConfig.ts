
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const prisma = new PrismaClient();

export default prisma;