const fs = require('fs');
const csvParser = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = 'data1.csv';

// Function to format date into ISO 8601 format
const formatDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return new Date().toISOString(); // Default to current timestamp
  }
  return new Date(dateString).toISOString();
};

// Function to safely parse JSON fields
const safeParseJSON = (jsonString) => {
  try {
    if (!jsonString || typeof jsonString !== 'string') return null;
    
    // Handle Buffer data (convert to Base64 string)
    if (jsonString.includes('"type":"Buffer"')) {
      const bufferData = JSON.parse(jsonString);
      if (bufferData.data) {
        return Buffer.from(bufferData.data).toString('base64'); // Convert buffer to Base64
      }
    }

    return JSON.parse(jsonString.replace(/""/g, '"')); // Remove extra quotes
  } catch (error) {
    console.warn(`Invalid JSON: ${jsonString}, setting to null.`);
    return null; // If invalid JSON, return null
  }
};

const uploadCsvData = async () => {
  const records = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      records.push({
        first_name: row.first_name?.trim() || null,
        middle_name: row.middle_name?.trim() || null,
        last_name: row.last_name?.trim() || null,
        age: row.age ? String(row.age.trim(), 10) : null,
        blood_grp: row.blood_grp?.trim() || null,
        mobile_no: row.mobile_no?.trim() || null,
        emergency_mob_no: row.emergency_mob_no?.trim() || null,
        email_id: row.email_id?.trim() || null,
        cunique_id: row.cunique_id?.trim() || null,
        adhar_doc: safeParseJSON(row.adhar_doc), // ✅ Handle Buffer & JSON parsing
        adhar_no: row.adhar_no?.trim() || null,
        fitness_doc: safeParseJSON(row.fitness_doc), // ✅ Handle Buffer & JSON parsing
        created_at: formatDate(row.created_at),
        updated_at: formatDate(row.updated_at),
      });
    })
    .on('end', async () => {
      try {
        // Insert each record individually and ignore duplicate errors
        for (const record of records) {
          try {
            await prisma.conductor_master.create({
              data: record,
            });
          } catch (error) {
            if (error.code === 'P2002') {
              console.warn(`Duplicate entry ignored for adhar_no: ${record.adhar_no}`);
            } else {
              console.error(`Error inserting record:`, error);
            }
          }
        }

        console.log('Conductor data uploaded successfully (including duplicates, skipping existing)');
      } catch (error) {
        console.error('Error uploading conductor data:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
};

uploadCsvData();
