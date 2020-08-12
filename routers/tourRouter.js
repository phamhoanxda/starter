const express = require('express');
const tourController = require('../controller/tourController');
const route = express.Router();

route.route('/').get(tourController.getalldata).post(tourController.createdata);

route
  .route('/:id')
  .get(tourController.getdata)
  .patch(tourController.patchdata)
  .delete(tourController.deletedata);

module.exports = route;
