const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSignup = (data) => {
  const errors = {};

  /* eslint-disable no-param-reassign */
  //data.title = !isEmpty(data.title) ? data.title : '';
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.gender = !isEmpty(data.gender.toString()) ? data.gender.toString() : '';
  //data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';
  //data.streetAddress = !isEmpty(data.streetAddress) ? data.streetAddress : '';
  //data.subUrb = !isEmpty(data.subUrb) ? data.subUrb : '';
  //data.postCode = !isEmpty(data.postCode) ? data.postCode : '';
  //data.state = !isEmpty(data.state) ? data.state : '';
  //data.purpose = !isEmpty(data.purpose) ? data.purpose : '';
  /* eslint-enable no-param-reassign */

  // if (validator.isEmpty(data.title)) {
  //   errors.title = 'Title field is required';
  // }

  if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = 'Name must be between 2 and 30 chars';
  }

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = 'First Name field is required';
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last Name field is required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must have between 6 and 30 chars';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (validator.isEmpty(data.gender)) {
    errors.gender = 'Gender is required';
  }

  // if (validator.isEmpty(data.phoneNumber)) {
  //   errors.phoneNumber = 'Phone number is required';
  // }

  // if (validator.isEmpty(data.streetAddress)) {
  //   errors.streetAddress = 'Street Address is required';
  // }

  // if (validator.isEmpty(data.subUrb)) {
  //   errors.subUrb = 'Sub URB is required';
  // }

  // if (validator.isEmpty(data.postCode)) {
  //   errors.postCode = 'Post Code is required';
  // }

  // if (validator.isEmpty(data.state)) {
  //   errors.state = 'Post Code is required';
  // }

  // if (validator.isEmpty(data.purpose)) {
  //   errors.purpose = 'Purpose is required';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateSignup;
