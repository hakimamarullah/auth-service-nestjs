import { ApiProperty } from '@nestjs/swagger';

export class PathSimpleResponse {
  @ApiProperty()
  roleId: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  createBy: string;

  static build(pathAllowed: any) {
    const pathSimpleResponse = new PathSimpleResponse();
    pathSimpleResponse.path = pathAllowed.path;
    pathSimpleResponse.createBy = pathAllowed.createBy;
    return pathSimpleResponse;
  }
}
