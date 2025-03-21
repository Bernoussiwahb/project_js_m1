import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Author } from '../authors/authors.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: Repository<Book>;
  let authorsRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    authorsRepository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Test Book',
      publishedYear: 2020,
      price: 19.99,
      authorName: 'Test Author',
    };

    const author = { id: 1, name: 'Test Author' } as Author;
    const newBook = { id: 1, ...createBookDto, author } as Book;

    jest.spyOn(authorsRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(authorsRepository, 'create').mockReturnValue(author);
    jest.spyOn(authorsRepository, 'save').mockResolvedValue(author);
    jest.spyOn(booksRepository, 'create').mockReturnValue(newBook);
    jest.spyOn(booksRepository, 'save').mockResolvedValue(newBook);

    const result = await service.create(createBookDto);
    expect(result).toEqual(newBook);
  });

  it('should throw NotFoundException when updating non-existing book', async () => {
    const updateBookDto: UpdateBookDto = { title: 'Updated Title' };

    jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

    await expect(service.update(99, updateBookDto)).rejects.toThrow(NotFoundException);
  });

  it('should delete a book', async () => {
    jest.spyOn(booksRepository, 'findOne').mockResolvedValue({ id: 1 } as Book);
    jest.spyOn(booksRepository, 'delete').mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException when deleting a non-existing book', async () => {
    jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
