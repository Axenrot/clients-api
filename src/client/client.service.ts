import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(dto: ClientDto, userId: number) {
    try {
      const client = await this.prisma?.client.create({
        data: {
          email: dto.email,
          title: dto.title,
          country: dto.country,
          address: dto.address,
          name: dto.name,
          userId,
        },
        select: {
          id: true,
          title: true,
          country: true,
          address: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return client;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ForbiddenException("Client already exists");
      } else {
        throw new ForbiddenException("Something went wrong, please try again");
      }
    }
  }

  async update(dto: ClientDto, clientId: number, userId: number) {
    try {
      const client = await this.prisma?.client.update({
        where: {
          id: clientId, // Specify the client to update using its ID
        },
        data: {
          email: dto.email,
          title: dto.title,
          country: dto.country,
          address: dto.address,
          name: dto.name,
          userId,
        },
        select: {
          id: true,
          title: true,
          country: true,
          address: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return client;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ForbiddenException("Client already exists");
      } else {
        throw new ForbiddenException("Something went wrong, please try again");
      }
    }
  }

  async delete(clientId: number, userId: number) {
    try {
      const deletedClient = await this.prisma.client.delete({
        where: {
          id: clientId,
          userId, // Ensure the client belongs to the user
        },
      });

      if (!deletedClient) {
        throw new NotFoundException(
          "Client not found or you are not authorized to delete it.",
        );
      }

      return { message: "Client deleted successfully" };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ForbiddenException("Client already exists");
      } else {
        throw new ForbiddenException("Something went wrong, please try again");
      }
    }
  }

  async list(userId: number, offset: number, limit: number) {
    try {
      const clients = await this.prisma?.client.findMany({
        where: {
          userId: userId,
        },
        skip: offset, // Skip the specified number of results
        take: limit, // Limit the number of results
      });

      return clients;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException("Something went wrong, please try again");
      }
    }
  }
}
