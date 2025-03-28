import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Role } from 'src/auth/enum/role.enum';
import { products } from './data/products';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedUser();
    await this.seedProducts();
  }

  private async seedUser() {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const user = this.userRepository.create({
        fullName: 'Admin',
        email: 'yousef@popcorn.ai',
        password: 'p0pc0rn-0304',
        role: Role.SUPER_ADMIN,
        isEmailVerified: true,
      });
      await this.userRepository.save(user);
    }
  }

  private async seedProducts() {
    const productCount = await this.productRepository.count();
    if (productCount === 0) {
      const initialProducts = this.productRepository.create(products);
      await this.productRepository.save(initialProducts);
    }
  }
}
