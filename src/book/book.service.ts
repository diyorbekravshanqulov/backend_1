import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { title, author, price, publiccation_year } = createBookDto;
    return this.bookRepo.save({ title, author, price, publiccation_year });
  }

  async findAll() {
    return this.bookRepo.find();
  }
 
  async findOne(id: number) {
    return this.bookRepo.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return this.bookRepo.update({ id }, updateBookDto);
  }

  async remove(id: number) {
    return this.bookRepo.delete({ id });
  }
}
