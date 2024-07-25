import { Optional } from 'sequelize'
export interface RegionAttributes {
  region_id: number
  region_name: string
  createdAt: Date
  updatedAt: Date
}
export interface RegionCreationAttributes
  extends Optional<RegionAttributes, 'createdAt' | 'updatedAt'> {}
