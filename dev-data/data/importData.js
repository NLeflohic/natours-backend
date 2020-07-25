const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

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

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));
const users = JSON.parse(fs.readFileSync('./dev-data/data/users.json'));
const reviews = JSON.parse(fs.readFileSync('./dev-data/data/reviews.json'));

const importData = async () => {
  try {
    await Tour.create(tours);
    //await User.create(users, { validateBeforeSave: false });
    //await Review.create(reviews);
    console.log('data successfully created');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    //await Tour.deleteMany({});
    await User.deleteMany({});
    //await Review.deleteMany({});
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
