import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory() {
    return this.inventoryService.getAllInventory();
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BARTENDER')
  @Put(':drinkName')
  async toggleStock(@Param('drinkName') drinkName: string, @Body() body: { inStock: boolean }) {
    return this.inventoryService.toggleStock(drinkName, body.inStock);
  }
}
