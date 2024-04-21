import { ForbiddenException, Injectable } from "@nestjs/common";
import { ClientDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(dto: ClientDto) {
    console.log("create?");
    try {
      console.log("trying to create");
      const client = await this.prisma?.client.create({
        data: {
          email: dto.email,
          title: dto.title,
          country: dto.country,
          address: dto.address,
          name: dto.name,
          userId: 1,
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
      console.log(client);
      return client;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("CLient already exists");
        } else {
          throw new ForbiddenException(
            "Something went wrong, please try again",
          );
        }
      }
    }
  }
}
