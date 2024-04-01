import { Optional } from "sequelize";
export interface UserAttributes {
  user_id: number;
  username: string | null;
  email: string | null;
  password?: string | null; // Optional
  type_of_user:string;

  // Common fields for all user types
  firstname: string | null;
  lastname: string | null;
  mobile_no: string | null;
  reset_token?: string | null;
  reset_token_expiry?: number | null;
  address_1: string | null;
  address_2?: string | null;
  city: string | null;
  state: string | null;
  country_code?: string | null;
  zip: number | null;
  role_id?: number | null;

  // Admin-specific fields (optional)
  billing_mobile_no?: number | null;
  status?: string | null;

  // Patient-specific fields (optional)
  dob?: Date | null;

  // Provider-specific fields (optional)
  medical_licence?: string | null;
  NPI_no?: number | null;
  alternative_mobile_no?: string | null;
  stop_notification_status?: string | null;
  synchronization_email: string | null;
  admin_notes: string | null;

  //Common attributes between Patient and Provider (optional)
  street?: string | null;

  //Common attributes between Admin and Provider
  open_requests: number | null;

  // Common attributes between Patient and Provider
  business_name: string | null;

  // Additional attributes (optional)
  tax_id?: string | null;
  business_website?: string | null;
  profile_picture?: string | null;
  signature_photo: string | null;
  on_call_status?: string | null;
  support_message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "user_id"
    | "username"
    | "email"
    | "password"
    | "country_code"
    | "firstname"
    | "lastname"
    | "mobile_no"
    | "reset_token"
    | "reset_token_expiry"
    | "address_1"
    | "address_2"
    | "city"
    | "state"
    | "country_code"
    | "zip"
    | "role_id"
    | "billing_mobile_no"
    | "status"
    | "dob"
    | "medical_licence"
    | "NPI_no"
    | "alternative_mobile_no"
    | "stop_notification_status"
    | "synchronization_email"
    | "admin_notes"
    | "street"
    | "open_requests"
    | "business_name"
    | "tax_id"
    | "business_website"
    | "profile_picture"
    | "signature_photo"
    | "on_call_status"
    | "support_message"
    | "createdAt"
    | "updatedAt"
  > {}
