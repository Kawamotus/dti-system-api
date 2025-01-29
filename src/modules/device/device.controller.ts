import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { IUser } from 'src/interfaces/user';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto, @CurrentUser() user: IUser) {
    return this.deviceService.create(createDeviceDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.deviceService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @CurrentUser() user: IUser,
  ) {
    return this.deviceService.update(+id, updateDeviceDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.deviceService.remove(+id, user);
  }
}
