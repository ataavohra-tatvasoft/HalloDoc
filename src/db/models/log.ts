import { Table, Column, DataType, Model } from 'sequelize-typescript'
import { LogsAttributes, LogsCreationAttributes } from '../../interfaces'

@Table({ timestamps: true, tableName: 'logs' })
export class Logs extends Model<LogsAttributes, LogsCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  log_id: number

  @Column({
    type: DataType.ENUM('SMS', 'Email'),
    allowNull: false
  })
  type_of_log: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  recipient: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  action: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  role_name: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  email: string

  @Column({
    type: DataType.BIGINT,
    allowNull: true
  })
  mobile_no: bigint

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  sent: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  sent_tries: number

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  confirmation_no: string
}
