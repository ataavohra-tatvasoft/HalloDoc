import { any } from "joi";
import { Optional } from "sequelize";
import { isFloat32Array } from "util/types";

export interface AccessAttributes {
  access_id: number;
  access_name: string;
  account_type: string;
  // /**Admin */
  // regions: string;
  // scheduling: string;
  // history: string;
  // accounts: string;
  // role: string;
  // provider: string;
  // request_data: string;
  // vendorship: string;
  // profession: string;
  // email_logs: string;
  // halo_administrators: string;
  // halo_users: string;
  // cancelled_history: string;
  // provider_location: string;
  // halo_employee: string;
  // halo_work_place: string;
  // patient_records: string;
  // blocked_history: string;
  // sms_logs: string;

  // /**Physician */
  // my_schedule: string;

  // /**Common Admin and Physician */
  // dashboard: string;
  // my_profile: string;
  // send_order: string;
  // chat: string;
  // invoicing: string;

  createdAt: Date;
  updatedAt: Date;
}
export interface AccessCreationAttributes
  extends Optional<
    AccessAttributes,
    "access_id" | "access_name" | "account_type" | "createdAt" | "updatedAt"
  > {}
