const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//const DB_LOCAL = process.env.LOCAL_DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const tours = JSON.parse(fs.readFileSync('../data/tours-simple.json'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully created');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}
