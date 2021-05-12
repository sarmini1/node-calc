/** Simple demo Express app. */

const express = require("express");
const app = express();

// useful error class to throw
const { NotFoundError, BadRequestError } = require("./expressError");

const MISSING = "Expected key `nums` with comma-separated list of numbers.";


/** Finds mean of nums in qs: returns {operation: "mean", result } */
app.get('/mean', function (req, res){

  //fail first and check if no nums were passed to q string
  if (!req.query.nums){
    throw new BadRequestError("nums are required");
  }

  //otherwise, put nums into an array and get the mean value
  let nums = req.query.nums.split(',');
  let invalidNum = nums.filter(n => isNaN(+n));

  console.log("invalidNum is", invalidNum);
  if (invalidNum.length === 1){
    throw new BadRequestError(`${invalidNum} is not a number`);
  }
  else if (invalidNum.length > 0){
    let multipleInvalidNums = invalidNum.join(",");
    throw new BadRequestError(`${multipleInvalidNums} are not numbers`);
  }

  let value = nums.reduce((a,b) => (+a + +b))/nums.length;

  return res.json({
    operation: "mean",
    value: value
  });
  
});


/** Finds median of nums in qs: returns {operation: "median", result } */


/** Finds mode of nums in qs: returns {operation: "mean", result } */


/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;