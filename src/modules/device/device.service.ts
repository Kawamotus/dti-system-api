import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/interfaces/user';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Device not found');
  }

  throwForbiddenException() {
    throw new ForbiddenException('access denied');
  }

  async create(createDeviceDto: CreateDeviceDto, user: IUser) {
    try {
      if (user.user.type !== 'dti') {
        this.throwForbiddenException();
      }

      const newDevice = {
        name: createDeviceDto.name,
        patrimony: createDeviceDto.patrimony,
        location: createDeviceDto.location,
        serial_number: createDeviceDto.serial_number,
        status: createDeviceDto?.status,
      };

      const createdDevice = await this.deviceRepository.create(newDevice);
      return await this.deviceRepository.save(createdDevice);
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException(error.detail);
      }
      console.log(error);
      if (error.status === 403) {
        this.throwForbiddenException();
      }
      throw new InternalServerErrorException('internal server error');
    }
  }

  async findAll(paginationDTO?: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;

    const devicesResult = await this.deviceRepository.find({
      take: limit,
      skip: offset,
      order: { name: 'asc' },
    });

    return devicesResult;
  }

  async findOne(id: number) {
    const device = await this.deviceRepository.findOne({ where: { id } });

    if (device) return device;

    this.throwNotFoundError();
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto, user: IUser) {
    try {
      if (user.user.type !== 'dti') {
        this.throwForbiddenException();
      }

      const device = await this.findOne(id);

      device.location = updateDeviceDto.location ?? device.location;
      device.name = updateDeviceDto.name ?? device.location;
      device.patrimony = updateDeviceDto.patrimony ?? device.patrimony;
      device.serial_number =
        updateDeviceDto.serial_number ?? device.serial_number;
      device.status = updateDeviceDto.status ?? device.status;

      await this.deviceRepository.save(device);

      return device;
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException(error.detail);
      }
      console.log(error);
      if (error.status === 403) {
        this.throwForbiddenException();
      }
      throw new InternalServerErrorException('internal server error');
    }
  }

  async remove(id: number, user: IUser) {
    if (user.user.type !== 'dti') {
      this.throwForbiddenException();
    }

    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) return this.throwNotFoundError();

    return await this.deviceRepository.remove(device);
  }
}
