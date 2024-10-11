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

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = schema.validate(
    {
      fullname: formValues.fullname,
      phone: formValues.phone,
      email: formValues.email,
      password: formValues.password,
    },
    { abortEarly: false } // Tiếp tục kiểm tra lỗi chứ ko có dừng sau khi tìm thấy
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

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = schema.validate(
    {
      email: formValues.email,
      password: formValues.password,
    },
    { abortEarly: false } // Tiếp tục kiểm tra lỗi chứ ko có dừng sau khi tìm thấy
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
