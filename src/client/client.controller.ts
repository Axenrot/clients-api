import { Body, Controller, Post } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientDto } from "./dto";

@Controller("client")
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post("create")
  create(@Body() dto: ClientDto) {
    console.log(dto);
    return this.clientService.create(dto);
  }
}
