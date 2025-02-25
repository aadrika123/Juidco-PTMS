const fs = require('fs');
const csvParser = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = 'data4.csv'; // Update with the actual path to your CSV file

const safeParseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') return null; // Default to null
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const uploadCsvData = async () => {
  const records = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      records.push({
        conductor_id: row.conductor_id?.trim() || '',
        bus_id: row.bus_id?.trim() || '',
        receipt_no: row.receipt_no?.trim() || '',
        amount: parseInt(row.amount, 10) || 0,
        date: safeParseDate(row.date) || new Date(),
        time: row.time?.trim() || '',
        created_at: safeParseDate(row.created_at) || new Date(),
        updated_at: safeParseDate(row.updated_at),
      });
    })
    .on('end', async () => {
      try {
        await prisma.receipts.createMany({
          data: records.map(record => ({
            ...record,
            created_at: record.created_at.toISOString(),
            updated_at: record.updated_at ? record.updated_at.toISOString() : null,
          })),
          skipDuplicates: true,
        });
        console.log('Receipts data uploaded successfully');
      } catch (error) {
        console.error('Error uploading receipts data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

uploadCsvData();
