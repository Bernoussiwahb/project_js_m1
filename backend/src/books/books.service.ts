import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { Author } from '../authors/authors.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectRepository(Author) private readonly authorsRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.booksRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id }, relations: ['author'] });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    let author = await this.authorsRepository.findOne({ where: { name: createBookDto.authorName } });

    if (!author) {
      author = this.authorsRepository.create({ name: createBookDto.authorName });
      await this.authorsRepository.save(author);
    }

    const book = this.booksRepository.create({ ...createBookDto, author });
    return await this.booksRepository.save(book);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id); // Ensure the book exists

    if (updateBookDto.authorName) {
      let author = await this.authorsRepository.findOne({ where: { name: updateBookDto.authorName } });

      if (!author) {
        author = this.authorsRepository.create({ name: updateBookDto.authorName });
        await this.authorsRepository.save(author);
      }

      book.author = author;
    }

    Object.assign(book, updateBookDto);
    return await this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.delete(id);
  }
}
