const fs = require('fs');
const csvParser = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = 'data.csv'; // Update with the actual path to your CSV file

const uploadCsvData = async () => {
  const records = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      records.push({
        conductor_id: row.conductor_id,
        bus_id: row.bus_id,
        date: new Date(row.date),
        from_time: parseInt(row.from_time, 10),
        to_time: parseInt(row.to_time, 10),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      });
    })
    .on('end', async () => {
      try {
        await prisma.scheduler.createMany({
          data: records,
          skipDuplicates: true, // Prevent duplicate errors
        });
        console.log('Data uploaded successfully');
      } catch (error) {
        console.error('Error uploading data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

uploadCsvData();
