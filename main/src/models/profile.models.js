const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://shawen17:Shawenbaba1@shawencluster.jzsljb4.mongodb.net/user_details"
);

const profileSchema = new mongoose.Schema({
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
  avatar: {
    type: String,
    max: 200,
  },
  gender: {
    type: String,
    required: "Your gender is required",
    max: 10,
  },
  bvn: {
    type: String,
    required: "Your bvn is required",
    max: 15,
  },
  address: {
    type: String,
    required: "Your address is required",
    max: 100,
  },
  currency: {
    type: String,

    max: 10,
  },
  email: {
    type: String,
    required: "Your email is required",
    max: 10,
  },
  userName: {
    type: String,

    max: 50,
  },
  status: {
    type: String,
    max: 25,
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

const socialsSchema = new mongoose.Schema({
  facebook: {
    type: String,

    max: 30,
  },
  twitter: {
    type: String,

    max: 30,
  },
  instagram: {
    type: String,

    max: 30,
  },
});

const educationSchema = new mongoose.Schema({
  level: {
    type: String,
    max: 30,
  },
});

const organizationSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: "Your address is required",
    max: 30,
  },
  orgNumber: {
    type: String,

    max: 30,
  },
  employmentStatus: {
    type: String,

    max: 30,
  },
  sector: {
    type: String,
    max: 10,
  },
  duration: {
    type: String,

    max: 10,
  },
  officeEmail: {
    type: String,

    max: 30,
  },
});

const accountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: "Your address is required",
    max: 30,
  },
  accountBalance: {
    type: Number,
  },
  loanRepayment: {
    type: Number,
  },
  bank: {
    type: String,
    max: 30,
  },
  accountNumber: {
    type: Number,
  },
  monthlyIncome: {
    type: Array,
  },
});

const mongoUserProfileSchema = new mongoose.Schema(
  {
    profile: profileSchema,
    guarantor: guarantorSchema,
    socials: socialsSchema,
    education: educationSchema,
    organization: organizationSchema,
    account: accountSchema,
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("Profile", mongoUserProfileSchema, "users");

module.exports = UserProfile;
