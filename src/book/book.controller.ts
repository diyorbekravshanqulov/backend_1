import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @Inject('BOOK_SERVICE') private readonly cleintService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    this.cleintService.emit('book_created', book);
    return book;
  }

  @Get()
  async findAll() {
    this.cleintService.emit('hello', 'Hello from another server!');
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    await this.bookService.update(+id, updateBookDto);
    const book = await this.bookService.findOne(+id);
    this.cleintService.emit('book_updated', book);
    return book;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bookService.remove(+id);
    this.cleintService.emit('book_deleted', +id);
    return {
      message: 'successfully removed',
    };
  }
}
