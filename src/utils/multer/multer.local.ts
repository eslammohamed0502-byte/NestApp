import { existsSync, mkdirSync } from "fs";
import { Request } from "express";
import * as multer from "multer";
import { BadRequestException } from "@nestjs/common";

export const MulterLocal = ({
  customPath = "General",
  customValidation = []
}: {
  customPath?: string;
  customValidation?: Array<string>;
}) => {

  const path = `uploads/${customPath}`;
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

  return {
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, path);
      },
      filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),

    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (!customValidation.includes(file.mimetype)) {
        return cb(new BadRequestException("Invalid file type"), false);
      }
      cb(null, true);
    },

    limits: {
      fileSize: 1024 * 1024 * 5 
    }
  };
};
