import { any } from "joi";
import { Optional } from "sequelize";

export interface EncounterFormAttributes {
  form_id: number;
  request_id: number;
  first_name: string;
  last_name: string;
  location: string;
  date_of_birth: Date;
  date_of_service: Date;
  phone_no: bigint;
  email: string;
  history_of_present: string;
  medical_history: string;
  medications: string;
  allergies: string;
  temperature: number;
  heart_rate: number;
  respiratory_rate: number;
  blood_pressure: number;
  o2: number;
  pain: string;
  heent: string;
  cv: string;
  chest: string;
  abd: string;
  extr: string;
  skin: string;
  neuro: string;
  other: string;
  diagnosis: string;
  treatment_plan: string;
  medication_dispensed: string;
  procedures: string;
  follow_up: string;
  is_finalize: string;

  createdAt: Date;
  updatedAt: Date;
}
export interface EncounterFormCreationAttributes
  extends Optional<
    EncounterFormAttributes,
    | "form_id"
    | "request_id"
    | "first_name"
    | "last_name"
    | "location"
    | "date_of_birth"
    | "phone_no"
    | "email"
    | "history_of_present"
    | "medical_history"
    | "medications"
    | "allergies"
    | "temperature"
    | "heart_rate"
    | "respiratory_rate"
    | "blood_pressure"
    | "o2"
    | "pain"
    | "heent"
    | "cv"
    | "chest"
    | "abd"
    | "extr"
    | "skin"
    | "neuro"
    | "other"
    | "diagnosis"
    | "treatment_plan"
    | "medication_dispensed"
    | "procedures"
    | "follow_up"
    | "is_finalize"
    | "createdAt"
    | "updatedAt"
  > {}
