import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  authorName: string; // ✅ Accept author name instead of authorId

  @IsNotEmpty()
  publishedYear: number;

  @IsNotEmpty()
  price: number;
}
