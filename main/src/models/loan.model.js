const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "Your firstname is required",
    max: 30,
  },
  lastName: {
    type: String,
    required: "Your lastname is required",
    max: 30,
  },
  phoneNumber: {
    type: String,
    required: "Your phonenumber is required",
    max: 30,
  },
  email: {
    type: String,
    max: 200,
  },
  bank: {
    type: String,
    required: "Your gender is required",
    max: 10,
  },
  bvn: {
    type: String,
    required: "Your bvn is required",
    max: 15,
  },
  accountNumber: {
    type: String,
    required: "Your address is required",
    max: 100,
  },
  duration: {
    type: String,

    max: 10,
  },
  amount: {
    type: String,
    required: "Your email is required",
    max: 10,
  },
});

const guarantorSchema = new mongoose.Schema({
  guaAddress: {
    type: String,
    required: "Your address is required",
    max: 30,
  },
  guaFirstName: {
    type: String,
    required: "Your firstname is required",
    max: 30,
  },
  guaLastName: {
    type: String,
    required: "Your lastname is required",
    max: 30,
  },
  guaGender: {
    type: String,
    max: 10,
  },
  guaNumber: {
    type: String,
    required: "Your phone number is required",
    max: 10,
  },
  relationship: {
    type: String,

    max: 30,
  },
});

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: "Your address is required",
    max: 30,
  },
  accountBalance: {
    type: Number,
  },

  bank: {
    type: String,
    max: 30,
  },
  monthlyIncome: {
    type: Array,
  },
});

const mongoLoanSchema = new mongoose.Schema(
  {
    guarantor: guarantorSchema,
    loan: loanSchema,
    account: accountSchema,
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", mongoLoanSchema, "loans");

module.exports = Loan;
