import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../models/userModel';
import { z, ZodIssue } from 'zod';
import { UserSchema } from '../lib/ZodSchemas';
import { Prisma } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const users = await userService.getAllUsers(query);
    reply.send(users);
  }

  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const user = await userService.getUserById(id);
    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const result = UserSchema.safeParse(request.body);

    if (!result.success) {
      const errors = result.error.errors.map((err: ZodIssue) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      reply.status(400).send({
        status: 'error',
        message: 'Validation failed',
        errors: errors,
      });
      return;
    }

    try {
      const newUserResponse = await userService.createUser(result.data);

      if (newUserResponse !== true) {
        reply.status(400).send({
          status: 'error',
          message: newUserResponse.message,
          errors: [], // Adicione uma propriedade de erros vazia
        });
        return;
      }

      reply.status(201).send({
        status: 'success',
        message: 'User created successfully',
      });
      
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({
          status: 'error',
          message: 'Internal server error',
          error: error.message,
          errors: [], // Adicione uma propriedade de erros vazia
        });
      }
    }
  }

  async updateUser(request: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) {
    const { id } = request.params;

    const result = UserSchema.safeParse(request.body);
    if (!result.success) {
      const errors = result.error.errors.map((err: ZodIssue) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      reply.status(400).send({
        status: 'error',
        message: 'Validation failed',
        errors: errors,
      });
      return;
    }

    try {
      const newUser = await userService.updateUser(String(id), result.data);
      reply.status(201).send({
        status: 'success',
        message: 'User updated successfully',
        data: newUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({
          status: 'error',
          message: 'Internal server error',
          error: error.message,
          errors: [], // Adicione uma propriedade de erros vazia
        });
      }
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await userService.deleteUser(String(id));
    reply.status(204).send();
  }
  
  async activateAccount(request: FastifyRequest<{ Params: { userId: string, token:string } }>, reply: FastifyReply){
    const { userId, token } = request.params;
    const activate = await userService.activateAccount(userId, token, request, reply)
    reply.status(activate?.code || 500).send(activate?.message)
  }
}
