const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const tourRouter = require('./routers/tourRouter');
const userRouter = require('./routers/userRouter');
const tourController = require('./controller/tourController');

const app = express();

//**********  MIDDLEWARE  ************
app.use(bodyParser.json()); //get json
app.use((req, res, next) => {
  req.timerequest = new Date().toISOString(); //Biến của midleware tồn tại trong 1 vòng cycle req-res
  next(); // add them cho request 1 bien de no di het vong du an
});
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Hello from midlleware dev!!!');
    next();
  });
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log('Hello from midlleware pro!!!');
    next();
  });
}

//app.param('id', tourController.checkID);

//MIDDLEWARE FOR STATIC LINK
app.use(express.static('./public')); // if someone type static soure.html this will connect to public/..html

///**********FUNCTION METHOD CRUD************

//app.get('/api/hoan/tours', getalldata);
// app.post('/api/hoan/tours', postdata);
// app.get('/api/hoan/tours/:id', getdata);
// app.patch('/api/hoan/tours/:id', patchdata);
// app.delete('/api/hoan/tours/:id', deletedata);

//**********ROUTES************

app.use('/api/hoan/tours', tourRouter);
app.use('/api/hoan/users', userRouter);

module.exports = app;
