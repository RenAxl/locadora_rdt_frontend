import { RoleDetailsDTO } from '../dtos/role-details-dto';
import { RoleInsertDTO } from '../dtos/role-insert-dto';
import { RoleDTO } from '../dtos/role.dto';
import { RolePermissionsUpdateDTO } from '../dtos/role-permissions-update-dto';
import { Role } from '../models/Role';
import { PermissionMapper } from '../../permissions/mapper/permission.mapper';

export class RoleMapper {
  static toModel(dto: RoleDTO): Role {
    return new Role({
      id: dto.id,

      authority: dto.authority || '',

      permissionsCount: dto.permissionsCount || 0,

      permissions: PermissionMapper.toModelList(dto.permissions || []),
    });
  }

  static toDetailsModel(dto: RoleDetailsDTO): Role {
    return new Role({
      id: dto.id,

      authority: dto.authority || '',

      permissionsCount: dto.permissionsCount || 0,

      permissions: PermissionMapper.toModelList(dto.permissions || []),

      createdAt: dto.createdAt,

      updatedAt: dto.updatedAt,

      createdBy: dto.createdBy,

      updatedBy: dto.updatedBy,
    });
  }

  static toInsertDTO(role: Role): RoleInsertDTO {
    return new RoleInsertDTO({
      authority: role.authority,
    });
  }

  static toPermissionsUpdateDTO(
    permissionIds: number[],
  ): RolePermissionsUpdateDTO {
    return new RolePermissionsUpdateDTO({
      permissionIds: permissionIds,
    });
  }
}
