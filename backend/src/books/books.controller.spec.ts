import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all books', async () => {
    const books = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(books);

    expect(await controller.findAll()).toEqual(books);
  });

  it('should return a single book', async () => {
    const book = { id: 1, title: 'Book 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(book);

    expect(await controller.findOne('1')).toEqual(book);
  });

  it('should create a book', async () => {
    const createBookDto: CreateBookDto = { title: 'New Book', publishedYear: 2020, price: 29.99, authorName: 'Test' };
    const createdBook = { id: 1, ...createBookDto };

    jest.spyOn(service, 'create').mockResolvedValue(createdBook);

    expect(await controller.create(createBookDto)).toEqual(createdBook);
  });

  it('should delete a book', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue();

    await expect(controller.remove('1')).resolves.toBeUndefined();
  });
});
