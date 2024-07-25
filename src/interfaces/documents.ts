import { Optional } from 'sequelize'

export interface DocumentsAttributes {
  request_id: number | null
  user_id: number | null
  document_id: number
  uploader: string
  document_name: string | null
  document_path: string
  createdAt: Date
  updatedAt: Date
}
export interface DocumentsCreationAttributes
  extends Optional<
    DocumentsAttributes,
    | 'createdAt'
    | 'updatedAt'
    | 'user_id'
    | 'uploader'
    | 'document_id'
    | 'document_name'
    | 'request_id'
  > {}
