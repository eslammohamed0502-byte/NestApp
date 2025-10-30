import { Body, Controller, Get, HttpCode, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  getHello(@Req() req:Request,@Res() res:Response): any {
    return this.appService.getHello(req,res);
  }
}
