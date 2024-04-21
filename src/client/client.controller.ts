import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("client")
export class ClientController {
  constructor(private clientService: ClientService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  create(@Body() dto: ClientDto, @Req() req: Request) {
    const userId = (req.user as { id: number }).id;

    return this.clientService.create(dto, userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("update")
  update(@Body() dto: ClientDto, @Req() req: Request) {
    const userId = (req.user as { id: number }).id;

    return this.clientService.update(dto, userId, 3);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("list")
  list(@Req() req: Request) {
    const userId = (req.user as { id: number }).id;
    const offset = parseInt(req.query.offset as string, 10) || 0; // Default to 0
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10
    return this.clientService.list(userId, offset, limit);
  }
}
