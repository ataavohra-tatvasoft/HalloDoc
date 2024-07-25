import { Optional } from 'sequelize'
export interface RoleAccessMappingAttributes {
  id: number
  role_id: number
  access_id: number
  createdAt: Date
  updatedAt: Date
}
export interface RoleAccessMappingCreationAttributes
  extends Optional<
    RoleAccessMappingAttributes,
    'id' | 'role_id' | 'access_id' | 'createdAt' | 'updatedAt'
  > {}
