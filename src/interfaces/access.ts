import { any } from "joi";
import { Optional } from "sequelize";
import { isFloat32Array } from "util/types";

export interface AccessAttributes {
  id: number;
  user_id: number;
  /**Admin */
  regions: string;
  scheduling: string;
  history: string;
  accounts: string;
  role: string;
  provider: string;
  request_data: string;
  vendorship: string;
  profession: string;
  email_logs: string;
  halo_administrators: string;
  halo_users: string;
  cancelled_history: string;
  provider_location: string;
  halo_employee: string;
  halo_work_place: string;
  patient_records: string;
  blocked_history: string;
  sms_logs: string;

  /**Physician */
  my_schedule: string;

  /**Common Admin and Physician */
  dashboard: string;
  my_profile: string;
  send_order: string;
  chat: string;
  invoicing: string;

  createdAt: Date;
  updatedAt: Date;
}
export interface AccessCreationAttributes
  extends Optional<
    AccessAttributes,
    | "id"
    | "regions"
    | "scheduling"
    | "history"
    | "accounts"
    | "role"
    | "provider"
    | "request_data"
    | "vendorship"
    | "profession"
    | "email_logs"
    | "halo_administrators"
    | "halo_users"
    | "cancelled_history"
    | "provider_location"
    | "halo_employee"
    | "halo_work_place"
    | "patient_records"
    | "blocked_history"
    | "sms_logs"
    | "my_schedule"
    | "dashboard"
    | "my_profile"
    | "send_order"
    | "chat"
    | "invoicing"
    | "createdAt"
    | "updatedAt"
  > {}
