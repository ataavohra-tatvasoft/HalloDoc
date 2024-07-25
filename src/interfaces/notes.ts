import { Optional } from 'sequelize'
export interface NotesAttributes {
  request_id: number
  note_id: number
  physician_name: string
  reason: string
  description: string
  type_of_note: string
  createdAt: Date
  updatedAt: Date
}
export interface NotesCreationAttributes
  extends Optional<
    NotesAttributes,
    'createdAt' | 'updatedAt' | 'note_id' | 'physician_name' | 'reason'
  > {}
