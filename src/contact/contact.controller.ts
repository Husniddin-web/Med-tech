import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: "createing contact" })
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all contacts" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.contactService.findAll(
      page && limit ? { page: +page, limit: +limit } : undefined
    );
  }

  @ApiOperation({ summary: "Get  contact by id" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contactService.findOne(+id);
  }

  @ApiOperation({ summary: "Update contact" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @ApiOperation({ summary: "Delete contact" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contactService.remove(+id);
  }
}
