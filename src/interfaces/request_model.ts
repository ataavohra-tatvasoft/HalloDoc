import { any } from "joi";
import { Optional } from "sequelize";

export interface RequestAttributes {
  request_id?: number;
  confirmation_no: string;
  request_state: string;
  patient_id: number;
  physician_id?: number;
  provider_id?: number;
  requested_by: string;
  requestor_id?: number;
  requested_date: Date;
  notes_symptoms?: string | null;
  date_of_service?: Date;
  block_status: string;
  block_status_reason?: string;
  cancellation_status: string;
  close_case_status: string;
  transfer_request_status?: string;
  agreement_status?: string;
  assign_req_description?: string;
  createdAt?: Date;
  updatedAt: Date;
}
export interface RequestCreationAttributes
  extends Optional<
    RequestAttributes,
    | "request_id"
    | "confirmation_no"
    | "physician_id"
    | "provider_id"
    | "requestor_id"
    | "notes_symptoms"
    | "date_of_service"
    | "block_status"
    | "block_status_reason"
    | "cancellation_status"
    | "close_case_status"
    | "transfer_request_status"
    | "agreement_status"
    | "assign_req_description"
    | "createdAt"
    | "updatedAt"
  > {}
