import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorsService } from "./authors.service";
import { AuthorsController } from "./authors.controller";
import { Author } from "./authors.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [TypeOrmModule], // ✅ Export TypeOrmModule to allow other modules to use AuthorRepository
})
export class AuthorsModule {}
