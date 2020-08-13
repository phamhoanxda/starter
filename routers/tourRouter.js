const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasdata, tourController.getalldata);

router.route('/get-tour-stats').get(tourController.getTourStats);
router.route('/get-monthly-plan/:year').get(tourController.getMonthyPlan);
router
  .route('/')
  .get(tourController.getalldata)
  .post(tourController.createdata);

router
  .route('/:id')
  .get(tourController.getdata)
  .patch(tourController.patchdata)
  .delete(tourController.deletedata);

module.exports = router;
