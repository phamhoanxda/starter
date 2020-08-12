const fs = require('fs');
const Tour = require('./../model/tourmodel');
const { match } = require('assert');

// #region ForLocalDataBase
//**********GET DATA FROM JSON************
// const data = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// const checkID = (req, res, next, val) => {
//   const tour = data.find((el) => el.id === val);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       data: {},
//     });
//   }
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'fail',
//       massage: 'Missing the name or price',
//     });
//   }
//   next();
// };

// const deletedata = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
// const getalldata = (req, res) => {
//  res.status(200).json({
// status: 'success',
// date: req.timerequest,
// results: data.length,
// data: {
//   tours: data,
//},
// });
//};
//const postdata = (req, res) => {
// const id = data[data.length - 1].id + 1;
// const newTour = { id: id, ...req.body }; //assign to merger some objects into 1 object
// console.log(newTour);
// data.push(newTour);
// fs.writeFile(
//   `${__dirname}/../dev-data/data/tours-simple.json`, //I dont clear why use writefile not sycho ???
//   JSON.stringify(data), // Reason in video: we are in POST (in event loop) so will not block event
//   (err) => {
//     res.status(201).json({
//       status: 'success',
//       date: req.timerequest,
//       data: newTour,
//     });
//   }
// );
//};
//const getdata = (req, res) => {
// const id = req.params.id * 1;
// const tour = data.find((el) => el.id === id);
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: tour,
//   },
// });
//};
//const patchdata = (req, res) => {
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: '<Updated something here...DONE>',
//   },
// });
//};

//#endregion

const deletedata = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(400).json({
      status: 'success',
      data: {
        message: 'Delete done!',
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const getalldata = async (req, res) => {
  try {
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)

    //BUID QUERY
    const queryObj = { ...req.query }; // clone new object
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //ADVANCED QUERY
    // A1) FILLTERING
    // MongoDb structure { duration :{$gte: 5}, difficulty: 'easy'}
    // Mongoose structure { duration :{gte: 5}, difficulty: 'easy'}
    // So we need to conver them
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    // 1B) SORTING BY PARAM
    let query = Tour.find(JSON.parse(queryStr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('createdAt');
    }

    //FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);

    query = query.skip(skip).limit(limit);

    // EXCUTE QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      resullts: tours.length,
      data: {
        tour: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
const createdata = async (req, res) => {
  // const newtour = new Tour({  })
  // newtour.save()
  try {
    const newtour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newtour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid imput data!!!',
    });
  }
};
const getdata = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found this id tour',
    });
  }
};
const patchdata = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(400).json({
      status: 'success',
      data: {
        tour, // In ES6 tour whereas tour : tour // same name
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  deletedata: deletedata,
  getalldata: getalldata,
  createdata: createdata,
  getdata: getdata,
  patchdata: patchdata,
};
