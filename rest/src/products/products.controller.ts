import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/middleware.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { multerConfig } from 'src/config/multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Create a new product with image upload' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      product: {
        value: {
          name: 'Example Product',
          description: 'Product description',
          price: 99.99,
          category: 'Electronics',
          files: 'image file',
          attributes: '{"color": "red", "size": "large"}',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!file) {
      throw new Error('No image was uploaded');
    }

    const imageUrl = `/uploads/${file.filename}`;

    // Parse attributes if they exist
    let parsedAttributes = {};
    if (createProductDto.attributes) {
      try {
        parsedAttributes = JSON.parse(
          createProductDto.attributes as unknown as string,
        );
      } catch (error) {
        throw new Error('Invalid attributes format');
      }
    }

    return await this.productsService.create({
      ...createProductDto,
      attributes: parsedAttributes,
      imageUrl,
    });
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get('search')
  @ApiOperation({ summary: 'Search products by query string' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return matching products' })
  async search(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.productsService.search(query, page, limit);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all products' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.productsService.findAll(page, limit);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Return the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      product: {
        value: {
          name: 'Updated Product',
          price: 149.99,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
