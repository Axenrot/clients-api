import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    // save user in db
    try {
      const user = await this.prisma?.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("User already exists");
        } else {
          throw new ForbiddenException(
            "Something went wrong, please try again",
          );
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: dto.email,
        },
      });
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (pwMatches) {
        delete user.hash;
        return user;
      } else {
        throw new ForbiddenException("Password doesn't match");
      }
    } catch (error) {
      // if does not exist, throw an error
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException("User not found");
      } else {
        throw new ForbiddenException("Something went wrong, please try again");
      }
    }

    // compare password

    // if incorrect, throw exception

    // send back or send in the user
  }
}
