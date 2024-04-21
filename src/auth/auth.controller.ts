import {
  Get,
  Req,
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRegisterDto, AuthLoginDto, AuthPatchDto } from "./dto";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @Post("logout")
  logout() {
    return this.authService.logout();
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch() // Use 'me' to indicate updating the current user
  async update(@Req() req: Request, @Body() dto: AuthPatchDto) {
    const userId = (req.user as { id: number }).id;
    return this.authService.update(dto, userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getMe(@Req() req: Request) {
    return req.user;
  }
}
