import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: "createing contact" })
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @ApiOperation({ summary: "Get all contact" })
  @Get()
  findAll() {
    return this.contactService.findAll();
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
