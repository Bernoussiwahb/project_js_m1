import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../authors/authors.entity';

@Entity()  // Make sure @Entity is correctly defined
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publishedYear: number;

  @Column()
  price: number;

  @ManyToOne(() => Author, (author) => author.books, { cascade: true })
  author: Author;
}
