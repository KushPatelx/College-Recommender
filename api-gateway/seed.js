const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// MongoDB connect kar rahe hain
mongoose.connect('mongodb+srv://abhay_panchal:1234@cluster0.ois4m98.mongodb.net/collegeDB')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ Connection Error:', err));

// Schema (strict: false rakha hai taaki CSV ke saare columns automatically map ho jayein)
const collegeSchema = new mongoose.Schema({}, { strict: false });
const College = mongoose.model('College', collegeSchema, 'colleges');

const results = [];
// CSV file ka path (backend folder se)
const csvFilePath = path.join(__dirname, '../backend/data/Backend_Data.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
      // String numbers ko actual numbers mein convert karna
      for (let key in data) {
          if (!isNaN(data[key]) && data[key] !== '') {
              data[key] = Number(data[key]);
          }
      }
      results.push(data);
  })
  .on('end', async () => {
      try {
          console.log("⏳ Purana data delete kar rahe hain...");
          await College.deleteMany({}); 
          
          console.log("⏳ Naya data MongoDB mein dal rahe hain...");
          await College.insertMany(results);
          
          console.log(`✅ Success! ${results.length} colleges MongoDB mein add ho gaye.`);
          process.exit();
      } catch (error) {
          console.error("❌ Insertion failed:", error);
          process.exit(1);
      }
  });   