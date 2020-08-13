const Tour = require('../model/tourmodel');

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
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //BUID QUERY
    const queryObj = { ...this.queryString }; // clone new object
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //ADVANCED QUERY
    // A1) FILLTERING
    // MongoDb structure { duration :{$gte: 5}, difficulty: 'easy'}
    // Mongoose structure { duration :{gte: 5}, difficulty: 'easy'}
    // So we need to conver them
    if (queryObj) {
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      );
      this.query = this.query.find(JSON.parse(queryStr));
    }
    return this;
  }

  sort() {
    // 1B) SORTING BY PARAM
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limitfields() {
    //FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //console.log(page, limit, skip);

    this.query = this.query.skip(skip).limit(limit);
    // if (this.query.page) {
    //   const numtours = await Tour.countDocuments();
    //   if (skip >= numtours) {
    //     throw new Error('the page was not exit!!');
    //   }
    // }
    return this;
  }
}

const getalldata = async (req, res) => {
  try {
    // EXCUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();
    const tours = await features.query;

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

//ALIASING DATA
const aliasdata = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  //req.query.fields = 'name,price,ratingsAverage,sumary,difficulty';
  next();
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

const getMonthyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const tours = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numtourStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      { $project: { _id: 0 } },
      {
        $sort: { numtourStart: -1 },
      },
      { $limit: 5 },
    ]);

    res.status(400).json({
      status: 'success',
      result: tours.length,
      data: {
        tour: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTour: { $sum: 1 },
          totalRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
    ]);

    res.status(400).json({
      status: 'success',
      data: {
        tour: stats,
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
  aliasdata: aliasdata,
  getTourStats: getTourStats,
  getMonthyPlan: getMonthyPlan,
};
