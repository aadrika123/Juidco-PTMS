import type { AccountsType } from "../../../../util/types/accountant/accountant.type";
import * as Yup from "yup";

// Updated AccountValidatorData to return all the required fields of AccountsType
export const AccountValidatorData = (accounts: AccountsType): AccountsType => {
    return {
        transaction_id: accounts.transaction_id,
        conductor_id: accounts.conductor_id,
        total_amount: accounts.total_amount,
        // Convert string date to Date object if needed
        date: typeof accounts.date === 'string' ? new Date(accounts.date) : accounts.date,
        time: accounts.time,
        description: accounts.description,
        transaction_type: accounts.transaction_type,
        conductor_name: accounts.conductor_name,
        bus_id: accounts.bus_id,
        status: accounts.status,
    };
};

// Updated Yup validation schema for all fields in AccountsType
export const AccountValidatorDataSchema = Yup.object({
    transaction_id: Yup.string().required("Transaction ID is required"),
    conductor_id: Yup.string().required("Conductor ID is required"),
    total_amount: Yup.number().required("Total amount is required").min(0, "Total amount must be non-negative"),
    date: Yup.date().required(),
    time: Yup.string().required("Time is required"),
    description: Yup.string().required("Description is required"),
    transaction_type: Yup.string().required("Transaction type is required"),
    conductor_name: Yup.string().required("Conductor name is required"),
    bus_id: Yup.string().required("Bus ID is required"),
    status: Yup.string().required("Status is required"),
});
