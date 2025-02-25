const fs = require('fs');
const csvParser = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = 'data3.csv'; // Update with the actual path to your CSV file

const safeParseJson = (data) => {
  if (!data || data.trim() === '') return {};
  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Invalid JSON detected, setting value to empty object: ${data}`);
    return {};
  }
};

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
        register_no: row.register_no?.trim() || '',
        vin_no: row.vin_no?.trim() || '',
        pollution_doc: safeParseJson(row.pollution_doc),
        taxCopy_doc: safeParseJson(row.taxCopy_doc),
        registrationCert_doc: safeParseJson(row.registrationCert_doc),
        status: row.status?.trim() || "Not Scheduled",
        created_at: safeParseDate(row.created_at) || new Date(),
        updated_at: null,
      });
    })
    .on('end', async () => {
      try {
        await prisma.bus_master.createMany({
          data: records.map(record => ({
            ...record,
            created_at: record.created_at.toISOString(),
            updated_at:  null,
          })),
          skipDuplicates: true,
        });
        console.log('Bus data uploaded successfully');
      } catch (error) {
        console.error('Error uploading bus data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

uploadCsvData();