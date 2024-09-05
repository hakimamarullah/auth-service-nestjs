import { PathSimpleResponse } from './pathSimple.response';
import { ApiProperty } from '@nestjs/swagger';

export class RoleSimpleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ isArray: true, type: PathSimpleResponse })
  pathsAllowed: PathSimpleResponse[];

  static build(role: any) {
    const dto = new RoleSimpleResponse();
    dto.id = role?.id;
    dto.name = role?.name;
    dto.description = role?.description;
    dto.pathsAllowed = role?.PathAllowed?.map((pathAllowed: any) =>
      PathSimpleResponse.build(pathAllowed),
    );
    return dto;
  }
}
