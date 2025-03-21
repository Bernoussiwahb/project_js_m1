import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './authors.entity';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorsRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorsRepository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all authors', async () => {
    const authors = [{ id: 1, name: 'Author A' }, { id: 2, name: 'Author B' }] as Author[];

    jest.spyOn(authorsRepository, 'find').mockResolvedValue(authors);

    const result = await service.findAll();
    expect(result).toEqual(authors);
  });

  it('should find an author by ID', async () => {
    const author = { id: 1, name: 'Author A' } as Author;

    jest.spyOn(authorsRepository, 'findOne').mockResolvedValue(author);

    const result = await service.findOne(1);
    expect(result).toEqual(author);
  });

  it('should throw NotFoundException when author is not found', async () => {
    jest.spyOn(authorsRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should create an author', async () => {
    const authorData = { name: 'New Author' };
    const newAuthor = { id: 1, ...authorData } as Author;

    jest.spyOn(authorsRepository, 'create').mockReturnValue(newAuthor);
    jest.spyOn(authorsRepository, 'save').mockResolvedValue(newAuthor);

    const result = await service.create(authorData);
    expect(result).toEqual(newAuthor);
  });

  it('should delete an author', async () => {
    jest.spyOn(authorsRepository, 'findOne').mockResolvedValue({ id: 1 } as Author);
    jest.spyOn(authorsRepository, 'delete').mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException when deleting a non-existing author', async () => {
    jest.spyOn(authorsRepository, 'findOne').mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
