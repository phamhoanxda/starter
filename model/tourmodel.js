const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// *** Conect to database ***//
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((/*connect*/) => {
    //console.log(con.connections);
    console.log('Conected to Database was successful!');
  });

// Create the schema for the model, Model ==> document (BSON)
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Max characters is 40'],
      minlength: [10, 'Min characters is 40'],
      //validate: [validator.isAlpha, 'Tour name must be only characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, ' A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, ' A tour must have maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, ' A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        messages: 'Difficulty is either: easy, medium, difficulty',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Max characters is 5'],
      min: [0, 'Min characters is 0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this key, only points yto current doc on new document creation
          return val < this.price;
        },
        messages: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, //       This tour      // remove scpacing and begin and end
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imagecover'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secreteTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Autoc caculate after get data from database
//remeber to use regular funtion (not arrow funtion) because we use this key*****
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});
//Midelleware for schema Document: run before save() and create() method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('Will save database ...');
//   next();
// });

//midlleware affter method save()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secreteTour: { $ne: true } });
  next();
});

//AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });
  next();
});

// Create model for document
const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
