const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//**********STARTING SERVER***********

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Start runing app listener on port: ${port}`);
});
