import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as fs from "fs/promises"; // Asynchronous FS
import * as path from "path";
import * as uuid from "uuid";
import { Express } from "express";

@Injectable()
export class FileUploadService {
  private readonly uploadPath = path.resolve(__dirname, "..", "..", "upload");
  private readonly maxFileSize = 5 * 1024 * 1024;
  private readonly allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg",
    "application/pdf",
  ];

  constructor() {
    fs.mkdir(this.uploadPath, { recursive: true }).catch(console.error);
  }

  async saveFile(file: any): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    this.validateFile(file);

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuid.v4()}${fileExtension}`;

    try {
      await fs.writeFile(path.join(this.uploadPath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      console.error("File upload error:", error);
      throw new InternalServerErrorException("Failed to save file");
    }
  }

  async saveFiles(files: any[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files provided");
    }

    try {
      const fileNames = await Promise.all(
        files.map(async (file) => this.saveFile(file))
      );
      return fileNames;
    } catch (error) {
      throw new InternalServerErrorException("Failed to save files");
    }
  }

  private validateFile(file: any) {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max size: ${this.maxFileSize / (1024 * 1024)}MB`
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Allowed: JPG, PNG, PDF SVG"
      );
    }
  }
}
