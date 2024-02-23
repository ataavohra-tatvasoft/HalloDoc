"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchemaSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = __importDefault(require("../public/statusCodes"));
// import countryStateCity, { State } from "country-state-city";
const adminSchemaSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { Email, Confirm_Email, Password, Confirm_Password, Status, Role, FirstName, LastName, MobileNumber, Zip, Billing_MobileNumber, Address_1, Address_2, City, State, Country_Code, }, } = req;
    //
    // function validateCityState(
    //   city: string,
    //   state: string,
    //   countryCode: string
    // ): boolean {
    //   const states: any = countryStateCity.getStatesOfCountry(countryCode);
    //   const stateExists: boolean = states.some(
    //     (currentState: any) => currentState.name === state
    //   );
    //   const cityExists: boolean = countryStateCity
    //     .getCitiesOfState(countryCode, state)
    //     .some((currentCity: any) => currentCity.name === city);
    //   return stateExists && cityExists;
    // }
    const adminSchema = joi_1.default.object({
        Email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com"] },
        }),
        Confirm_Email: joi_1.default.ref("Email"),
        Password: joi_1.default.string().alphanum().min(5).required(),
        Confirm_Password: joi_1.default.ref("Password"),
        Status: joi_1.default.string().valid("Active", "In-Active"),
        Role: joi_1.default.string().valid("Admin"),
        FirstName: joi_1.default.string().max(8).min(3),
        LastName: joi_1.default.string().max(8).min(3),
        MobileNumber: joi_1.default.string()
            .pattern(/^\d{10}$/)
            .required(),
        Zip: joi_1.default.string()
            .pattern(/^\d{6}$/)
            .required(),
        Billing_MobileNumber: joi_1.default.string()
            .pattern(/^\d{10}$/)
            .required(),
        Address_1: joi_1.default.string().max(15).min(10),
        Address_2: joi_1.default.string().max(15).min(10),
        City: joi_1.default.string().valid("Ahmedabad", "Amreli district", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Dahod", "The Dangs", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Kheda", "Mehsana", "Narmada", "Navsari", "Patan", "Panchmahal", "Porbandar", "Rajkot", "Sabarkantha", "Surendranagar", "Surat", "Vyara", "Vadodara", "Valsad"),
        State: joi_1.default.string().valid("Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"),
        Country_Code: joi_1.default.string().pattern(/^[a-zA-Z]{2}$/).required(),
    });
    try {
        yield adminSchema.validateAsync({
            Email: Email,
            Confirm_Email: Confirm_Email,
            Password: Password,
            Confirm_Password: Confirm_Password,
            Status: Status,
            Role: Role,
            FirstName: FirstName,
            LastName: LastName,
            MobileNumber: MobileNumber,
            Zip: Zip,
            Billing_MobileNumber: Billing_MobileNumber,
            Address_1: Address_1,
            Address_2: Address_2,
            City: City,
            State: State,
            Country_Code: Country_Code,
        }, { abortEarly: false, presence: "required" });
        next();
    }
    catch (error) {
        // throw new Error(error.details.map((detail) => detail.message).join(", "));
        // console.log(error.details.map((detail) => detail.message).join(", "));
        // console.log(error.message);
        return res.status(500).json({
            status: false,
            errormessage: error.message,
            message: statusCodes_1.default[500],
        });
    }
});
exports.adminSchemaSignUp = adminSchemaSignUp;
