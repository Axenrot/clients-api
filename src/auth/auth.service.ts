import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDto, AuthLoginDto, AuthPatchDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthRegisterDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    // save user in db
    try {
      const user = await this.prisma?.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName || null,
          lastName: dto.lastName || null,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          firstName: true,
          lastName: true,
        },
      });
      return user;
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

  async login(dto: AuthLoginDto) {
    // find the user by email
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: dto.email,
        },
      });
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (pwMatches) {
        const token = await this.signToken(user.id, user.email);
        return {
          access_token: token,
          id: user.id,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        };
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
  }

  async logout() {
    // Remove JWT from local storage or cookies
    localStorage.removeItem("access_token");
    // Optionally redirect to login or home page
  }

  async update(dto: AuthPatchDto, userId: number) {
    try {
      const data: any = {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      };

      if (dto.password) {
        const hash = await argon.hash(dto.password);
        data.hash = hash; // Assign the hash to the 'hash' field
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
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

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: "300m",
      secret: process.env.JWT_SECRET,
    });
  }
}
