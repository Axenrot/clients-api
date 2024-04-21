import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
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
}
