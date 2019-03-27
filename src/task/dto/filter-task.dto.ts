import { IsString, IsOptional, IsEnum } from 'class-validator';
import { QueryOrder } from '../../common/enums/query-order.enum';

export class FilterTaskDto {
  @IsString() @IsOptional() readonly userId?: number;
  @IsString() @IsOptional() readonly page?: string;
  @IsString() @IsOptional() readonly count?: string;
  @IsString() @IsOptional() readonly orderBy?: string;
  @IsEnum(QueryOrder) @IsOptional() readonly orderType?: QueryOrder;
}
