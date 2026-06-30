import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['../.env.local', '../.env', '.env', '.env.local']
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    AdminModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
