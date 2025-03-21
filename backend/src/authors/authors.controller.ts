import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from './authors.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Post()
  create(@Body() author: Partial<Author>): Promise<Author> {
    return this.authorsService.create(author);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() author: Partial<Author>): Promise<Author> {
    return this.authorsService.update(id, author);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.authorsService.delete(id);
  }
}
