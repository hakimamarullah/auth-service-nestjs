export class UserDto {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  phone: string;
  password: string;
  roles: string[];

  static build(user: any, omitPass?: boolean) {
    const dto = new UserDto();
    dto.id = user?.id;
    dto.username = user?.username;
    dto.email = user?.email;
    dto.enabled = user?.enabled;
    dto.phone = user?.phone;
    dto.password = omitPass ? undefined : user?.password;
    dto.roles = user?.UserRoles?.map((userRole: any) => userRole.role?.name);
    return dto;
  }
}
