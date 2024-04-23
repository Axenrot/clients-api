import {
  Body,
  Controller,
  Delete,
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

    return this.clientService.update(dto, clientIdNumber, userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  deleteClient(@Param("id") clientId: string, @Req() req: Request) {
    const userId = (req.user as { id: number }).id;
    const clientIdNumber = parseInt(clientId, 10);

    return this.clientService.delete(clientIdNumber, userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("list")
  list(@Req() req: Request) {
    const userId = (req.user as { id: number }).id;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;
    const searchQuery = req.query.search as string | undefined; // Retrieve search query

    return this.clientService.list(userId, offset, limit, searchQuery);
  }
}
