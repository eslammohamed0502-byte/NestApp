import { Injectable, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';


@Injectable()
export class AppService {
  getHello(@Req() req:Request,@Res() res:Response): any {
    return res.status(201).json({message:"Welcome to Our API"})
  }
  
}
