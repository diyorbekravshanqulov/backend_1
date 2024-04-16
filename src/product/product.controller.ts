import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly cleintService: ClientProxy,
  ) {}

  @Post(':id/like')
  async likeBoss(@Param('id') id: string) {
    let prod = await this.productService.findOne(+id);
    if (!prod) {
      throw new NotFoundException('Not found Product');
    }
    prod.likes += 1;
    await this.productService.update(+id, prod);

    return prod;
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    this.cleintService.emit('product_created', product);
    return product;
  }

  @Get()
  async findAll() {
    this.cleintService.emit('hello', 'Hello from another server!');
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.update(+id, updateProductDto);
    const prod = await this.productService.findOne(+id);
    this.cleintService.emit('product_updated', prod);
    return prod;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(+id);
    this.cleintService.emit('product_deleted', +id);
    return {
      message: 'successfully removed',
    };
  }
}
