import { Table, Column, DataType, Model } from 'sequelize-typescript'
import { UserRegionMappingAttributes, UserRegionMappingCreationAttributes } from '../../interfaces'
@Table({ timestamps: true, tableName: 'user-region-mapping' })
export class UserRegionMapping extends Model<
  UserRegionMappingAttributes,
  UserRegionMappingCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  })
  id: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  region_id: number
}
