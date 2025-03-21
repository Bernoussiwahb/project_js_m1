import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { Book } from './books/books.entity';  // Import Book
import { Author } from './authors/authors.entity';  // Import Author

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Book, Author],  // Ensure Book is here!
      synchronize: true,  // Ensure database syncs with changes
    }),
    TypeOrmModule.forFeature([Book, Author]),  // Ensure Book is registered
    BooksModule,
    AuthorsModule,
  ],
})
export class AppModule {}
