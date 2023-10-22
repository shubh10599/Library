const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  borrowedBook: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: "book",
      },
      returned: {
        type: Boolean,
        default: false,
      },
      issueDate: {
        type: String,
        required: true,
      },
      returnDate: {
        type: String,
        required: true,
      },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    userName: Joi.string().required().min(3).max(10),
    password: Joi.string().required().min(5).max(10),
    email: Joi.string().required().email(),
    phone: Joi.string().required().length(10),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(data);
};

module.exports = { userSchema, validateUser, User };
