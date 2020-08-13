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
module.exports = APIFeatures;
