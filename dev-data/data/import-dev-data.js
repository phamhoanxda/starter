const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const Tour = require('./../../model/tourmodel');
// *** Conect to database ***//
// READ JSON DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA TO DATABASE

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('IMPORTED SUCCESSED!!!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//DELAETE ALL DATA FROM DATABASE

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DELETED SUCCESSED!!!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
