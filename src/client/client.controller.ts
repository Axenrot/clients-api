import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientDto, ClientPatchDto } from "./dto";
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
  @Patch("update/:clientId")
  update(
    @Body() dto: ClientPatchDto,
    @Req() req: Request,
    @Param("clientId") clientId: string,
  ) {
    const userId = (req.user as { id: number }).id;
    const clientIdNumber = parseInt(clientId, 10); // Convert to number

    return this.clientService.update(dto, userId, clientIdNumber);
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
