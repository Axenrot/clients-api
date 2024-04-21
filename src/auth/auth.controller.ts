import { Get, Req, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRegisterDto, AuthLoginDto } from "./dto";
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
  @Get()
  getMe(@Req() req: Request) {
    return req.user;
  }
}
