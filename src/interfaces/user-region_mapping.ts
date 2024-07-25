import { Optional } from 'sequelize'
export interface UserRegionMappingAttributes {
  id: number
  user_id: number
  region_id: number
  createdAt: Date
  updatedAt: Date
}
export interface UserRegionMappingCreationAttributes
  extends Optional<
    UserRegionMappingAttributes,
    'id' | 'user_id' | 'region_id' | 'createdAt' | 'updatedAt'
  > {}
