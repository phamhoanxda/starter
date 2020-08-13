const mongoose = require('mongoose');

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
    },
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});
// Create model for document
const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
