// import { Request } from 'express';

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default class AccountsSummaryDAO {
    async getTotalAmount(conductor_id: string, date: Date): Promise<{ total_amount: number }> {
        const result = await prisma.receipts.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                conductor_id: conductor_id,
                date: date,
            },
        });
        return { total_amount: result._sum.amount || 0 };
    }

    
    async createSummary(summaryData: {
        transaction_id: string;
        conductor_id: string;
        total_amount: number;
        date: Date;
        time: string;
        description: string;
        transaction_type: string;
        conductor_name: string;
        bus_id: string;
        status: number;
    }): Promise<any> {
        return prisma.accounts_summary.create({
            data: summaryData,
        });
    }


    async getName(conductor_id: string): Promise<{ name: string }> {
        const result = await prisma.conductor_master.findFirst({
            where: {
                cunique_id: conductor_id,
            },
            select: {
                first_name: true,
                middle_name: true,
                last_name: true,
            },
        });

        if (!result) {
            return { name: '' }; 
        }

        const fullName = result.middle_name
            ? `${result.first_name} ${result.middle_name} ${result.last_name}`.trim()
            : `${result.first_name} ${result.last_name}`.trim();

        return { name: fullName };
    }


    async getbus_id(conductor_id: string): Promise<{ bus_id: string }> {
        const result = await prisma.receipts.findFirst({
            where: {
                conductor_id: conductor_id, 
            },
            select: {
                bus_id: true, 
            },
        });

        if (!result || !result.bus_id) {
            return { bus_id: '' }; 
        }

        return { bus_id: result.bus_id };
    }

    async getTotalAmountByConductorId(conductor_id: string, bus_id: string, systemDate: Date): Promise<any> {
    return prisma.receipts.aggregate({
        _sum: {
            amount: true,  
        },
        where: {
            conductor_id: conductor_id,
            bus_id: bus_id,
            date: systemDate, 
        },
    });
}

    // DAO method to get all transactions with status 0 (Not Validated)
    async getTransactionsByStatus(status: number): Promise<any[]> {
        return prisma.accounts_summary.findMany({
            where: {
                status: status,
            },
        });
    }


    // DAO method to get scheduled buses and conductors for a specific date
    async getScheduledBusesAndConductors(date: Date): Promise<any[]> {
        return prisma.scheduler.findMany({
            where: {
                date: date,
            },
            select: {
                conductor_id: true,
                bus_id: true,
                date: true,
            },
        });
    }

    
    async transactions(conductor_id:string): Promise<any[]> {
        return prisma.accounts_summary.findMany({
            where: { conductor_id },
            orderBy: { created_at: 'desc' }
        });
    }

    async updateTransactionStatus(transaction_id: string, status: number): Promise<any> {
        try {
            const updatedTransaction = await prisma.accounts_summary.update({
                where: { transaction_id },
                data: { status }
            });
            return updatedTransaction;
        } catch (error) {
            // Handle or log error as needed
            throw new Error('Failed to update transaction status');
        }
    }
}
