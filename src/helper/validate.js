// Import Modules
const Joi = require("joi");

exports.checkValidateFormSignup = (formValues) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .required()
      .messages({ "string.empty": "Full Name is not allowed to be empty!" }),
    email: Joi.string()
      .required()
      .pattern(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.(com|net|org)$", "i"))
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.pattern.base": "Email is invalid!",
      }),
    password: Joi.string().required().min(8).messages({
      "string.empty": "Password is not allowed to be empty!",
      "string.min": "Password length must be at least 8 characters long!",
    }),
    phone: Joi.string().required().min(10).max(10).messages({
      "string.empty": "Phone is not allowed to be empty!",
      "string.min": "Phone must be 10 characters!",
      "string.max": "Phone must be 10 characters!",
    }),
  });

  // Add values form and check if has erros or not
  const { error } = schema.validate(
    {
      fullname: formValues.fullname,
      phone: formValues.phone,
      email: formValues.email,
      password: formValues.password,
    },
    { abortEarly: false } // Continue checking error if has error or not
  );

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};

exports.checkValidateFormLogin = (formValues) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .pattern(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.(com|net|org)$", "i"))
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.pattern.base": "Email is invalid!",
      }),
    password: Joi.string().required().min(8).messages({
      "string.empty": "Password is not allowed to be empty!",
      "string.min": "Password length must be at least 8 characters long!",
    }),
  });

  // Add values form and check if has erros or not
  const { error } = schema.validate(
    {
      email: formValues.email,
      password: formValues.password,
    },
    { abortEarly: false } // Continue checking error if has error or not
  );

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};

exports.checkValidateFormCheckout = (formValues) => {
  const schema = Joi.object({
    fullname: Joi.string().required().messages({
      "string.empty": "Fullname is not allowed to be empty!",
    }),
    email: Joi.string()
      .required()
      .pattern(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.(com|net|org)$", "i"))
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.pattern.base": "Email is invalid!",
      }),
    phone: Joi.string().required().min(10).max(10).messages({
      "string.empty": "Password is not allowed to be empty!",
      "string.min": "Password length must be at least 10 characters long!",
      "string.max": "Password length must not exceed 10 characters!",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Fullname is not allowed to be empty!",
    }),
  });

  // Add values form and check if has erros or not
  const { error } = schema.validate(
    {
      fullname: formValues.fullname,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address,
    },
    { abortEarly: false } // Continue checking error if has error or not
  );

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};
