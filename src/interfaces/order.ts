import { Optional } from 'sequelize'
export interface OrderAttributes {
  order_id: number
  request_id: number
  business_id: number
  request_state: string
  order_details: string
  number_of_refill: number
  createdAt: Date
  updatedAt: Date
}
export interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'createdAt' | 'updatedAt' | 'order_id'> {}
