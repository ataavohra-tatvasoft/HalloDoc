import { Optional } from "sequelize";
export interface UserAttributes {
  user_id: number;
  username: string | null;
  email: string;
  password?: string; // Optional
  type_of_user: "admin" | "patient" | "provider";

  // Common fields for all user types
  firstname: string;
  lastname: string;
  mobile_no: string;
  reset_token?: string | null;
  reset_token_expiry?: number | null;
  address_1: string;
  address_2?: string | null;
  city: string;
  state: string;
  country_code?: string | null;
  zip: number;
  role?: string | null;

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

  // Vendors-specific fields
  profession?: string | null;
  // business_contact?: number | null;
  fax_number?: number | null;

  //Common attributes between Patient and Provider (optional)
  street?: string | null;

  //Common attributes between Admin and Provider
  open_requests: number | null;

  // Common attributes between Patient and Provider and Vendor
  // business_name: string | null;
  business_id: number | null;

  //Regions of service
  district_of_columbia: string | null;
  new_york: string | null;
  virginia: string | null;
  maryland: string | null;

  // Additional attributes (optional)
  tax_id?: string | null;
  // business_website?: string | null;
  profile_picture?: string | null;
  signature_photo: string | null;
  on_call_status?: string | null;
  scheduled_status?: string | null;
  support_message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "user_id"
    | "username"
    | "password"
    | "country_code"
    | "reset_token_expiry"
    | "reset_token"
    | "address_2"
    | "zip"
    | "role"
    | "billing_mobile_no"
    | "status"
    | "dob"
    | "medical_licence"
    | "NPI_no"
    | "alternative_mobile_no"
    | "stop_notification_status"
    | "synchronization_email"
    | "admin_notes"
    | "profession"
    | "fax_number"
    | "street"
    | "open_requests"
    | "business_id"
    | "tax_id"
    | "profile_picture"
    | "signature_photo"
    | "on_call_status"
    | "scheduled_status"
    | "support_message"
    | "createdAt"
    | "updatedAt"
  > {}
