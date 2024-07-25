import { Table, Column, DataType, Model, BelongsTo } from 'sequelize-typescript'
import { NotesAttributes, NotesCreationAttributes } from '../../interfaces'
import { RequestModel } from './request'

@Table({ timestamps: true, tableName: 'notes' })
export class Notes extends Model<NotesAttributes, NotesCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  request_id: number

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  note_id: number

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  physician_name: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  reason: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  description: string

  @Column({
    type: DataType.ENUM(
      'transfer_notes',
      'admin_notes',
      'physician_notes',
      'patient_notes',
      'admin_cancellation_notes',
      'physician_cancellation_notes',
      'patient_cancellation_notes'
    ),
    allowNull: false
  })
  type_of_note: string

  @BelongsTo(() => RequestModel, {
    foreignKey: 'request_id',
    targetKey: 'request_id'
  })
  Request: RequestModel
}
