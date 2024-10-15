export type AccountsType = {
    transaction_id: string;
    conductor_id: string;
    total_amount: number;
    date: Date; // This remains as a Date type
    time: string;
    description: string;
    transaction_type: string;
    conductor_name: string;
    bus_id: string;
    status: number; // Update to number
    };
