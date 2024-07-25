import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  BelongsToMany,
  BelongsTo
} from 'sequelize-typescript'
import { UserAttributes, UserCreationAttributes } from '../../interfaces'
import { Shifts } from './shifts'
import { UserRegionMapping } from './user-region_mapping'
import { Region } from './region'
import { Role } from './role'

@Table({
  timestamps: true,
  tableName: 'user'
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  user_id: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  username: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  email: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  password: string

  @Column({
    type: DataType.ENUM('admin', 'patient', 'physician'),
    allowNull: false
  })
  type_of_user: string

  // Common fields
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  firstname: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  lastname: string

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    unique: true
  })
  mobile_no: bigint

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  reset_token: string

  @Column({
    type: DataType.BIGINT,
    allowNull: true
  })
  reset_token_expiry: bigint

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address_1: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address_2: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  city: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  state: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  country_code: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  zip: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null
  })
  role_id: number

  @Column({
    type: DataType.ENUM('active', 'pending', 'in-active'),
    allowNull: true,
    defaultValue: 'pending'
  })
  status: string

  // Admin-specific fields
  @Column({
    type: DataType.BIGINT,
    allowNull: true
  })
  billing_mobile_no: bigint

  // Patient-specific fields
  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  dob: Date

  // Provider-specific fields
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  medical_licence: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  NPI_no: number

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    unique: true
  })
  alternative_mobile_no: bigint

  @Column({
    type: DataType.ENUM('yes', 'no'),
    allowNull: true,
    defaultValue: 'no'
  })
  stop_notification_status: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  synchronization_email: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  admin_notes: string

  // Common attributes between Patient and Provider (optional)
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  street: string

  //Common attributes between Admin and Provider
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    defaultValue: 0
  })
  open_requests: number

  // Common attributes between Patient and Provider
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  business_name: string

  // Additional attributes
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  tax_id: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  business_website: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  profile_picture: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  signature_photo: string

  @Column({
    type: DataType.ENUM('scheduled', 'un-scheduled', 'busy'),
    allowNull: true,
    defaultValue: null
  })
  on_call_status: string

  @HasMany(() => Shifts, { foreignKey: 'user_id' })
  Shifts: Shifts[]

  @BelongsTo(() => Role, {
    foreignKey: 'role_id',
    targetKey: 'role_id'
  })
  Role: Role

  @BelongsToMany(() => Region, {
    through: () => UserRegionMapping,
    foreignKey: 'user_id',
    otherKey: 'region_id'
  })
  Regions: Region[]
}
