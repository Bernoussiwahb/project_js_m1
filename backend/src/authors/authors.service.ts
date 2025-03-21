import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthorsService {
  remove(arg0: number): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Author[]> {
    return this.authorsRepository.find();
  }



async findOne(id: number): Promise<Author> {
  const author = await this.authorsRepository.findOne({ where: { id } });
  if (!author) {
    throw new NotFoundException(`Author with ID ${id} not found`);
  }
  return author;
}

  

  async create(author: Partial<Author>): Promise<Author> {
    return this.authorsRepository.save(author);
  }

  async update(id: number, author: Partial<Author>): Promise<Author> {
    await this.authorsRepository.update(id, author);
    return this.findOne(id); // This will now throw an error if the author doesn't exist
  }
  

  async delete(id: number): Promise<void> {
    await this.authorsRepository.delete(id);
  }
}
