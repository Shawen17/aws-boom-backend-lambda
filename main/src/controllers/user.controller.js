const UserProfile = require("../models/profile.models");
const Loan = require("../models/loan.model");
const fs = require("fs");
const { mediaUpload } = require("../middlewares");
const path = require("path");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

exports.allAccess = (req, res) => {
  res.status(200).json("Public Content.");
};

exports.userBoard = (req, res) => {
  const email = req.query.email;
  UserProfile.findOne({ "profile.email": email })
    .exec()
    .then((profile, err) => {
      if (!profile) {
        return res.status(404).json({ message: "Profile Not found." });
      }

      res.status(200).json(profile);
    });
};

exports.allUserProfiles = async (req, res) => {
  try {
    let page = req.query.page;
    let search = req.query.search;
    if (!page) {
      page = 1;
    }
    const regex_pattern = `.*${search}.*`;
    const query = {
      $or: [
        { "profile.email": { $regex: regex_pattern, $options: "i" } },
        { "profile.userName": { $regex: regex_pattern, $options: "i" } },
        { "profile.firstName": { $regex: regex_pattern, $options: "i" } },
        { "profile.lastName": { $regex: regex_pattern, $options: "i" } },
        { "profile.status": { $regex: regex_pattern, $options: "i" } },
        { "profile.address": { $regex: regex_pattern, $options: "i" } },
        { "account.accountName": { $regex: regex_pattern, $options: "i" } },
        { "guarantor.guaAddress": { $regex: regex_pattern, $options: "i" } },
        { "guarantor.guaFirstName": { $regex: regex_pattern, $options: "i" } },
        { "guarantor.guaLastName": { $regex: regex_pattern, $options: "i" } },
        { "organization.orgName": { $regex: regex_pattern, $options: "i" } },
        {
          "organization.employmentStatus": {
            $regex: regex_pattern,
            $options: "i",
          },
        },
        { "organization.sector": { $regex: regex_pattern, $options: "i" } },
        {
          "organization.officeEmail": { $regex: regex_pattern, $options: "i" },
        },
      ],
    };
    var profiles;
    if (search) {
      profiles = await UserProfile.find(query).exec();
    } else {
      profiles = await UserProfile.find({}).exec();
    }
    if (!profiles) {
      return res.status(404).json({ message: "Empty array set" });
    }

    const per_page = 20;
    const start_index = (page - 1) * per_page;
    const end_index = page * per_page;
    const users_paginated = profiles.slice(start_index, end_index);
    const all_users = profiles.length;
    const activeCount = await UserProfile.countDocuments({
      "profile.status": "Active",
    });
    const savingsCount = await UserProfile.countDocuments({
      "account.accountBalance": { $gt: 0 },
    });
    const loanCount = await UserProfile.countDocuments({
      "account.loanRepayment": { $gt: 0 },
    });

    res.status(200).json({
      users_paginated: users_paginated.map((profile) => profile.toObject()), // Convert to plain JavaScript objects
      all_users: all_users,
      active: activeCount,
      loan: loanCount,
      savings: savingsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update_status = async (req, res) => {
  const user_id = req.params.id;
  const status = req.params.result;
  try {
    await UserProfile.updateOne(
      { _id: user_id },
      { $set: { "profile.status": status } }
    ).exec();

    res.status(200).json({ message: "Status Updated" });
  } catch (err) {
    res.status(404).json({ message: "User Not Found" });
  }
};

exports.loan_history = async (req, res) => {
  const email = req.query.email;

  try {
    const loans = await Loan.find({ "loan.email": email }).exec();
    previousLoans = loans.map((loan) => loan.toObject());
    res.status(200).json(previousLoans);
  } catch (err) {
    res.status(404).json({ message: "User Not Found" });
  }
};

exports.loan_apply = async (req, res) => {
  try {
    const { account, guarantor, loan } = req.body;
    const email = loan.email;
    const profile = await UserProfile.findOne({
      "profile.email": email,
      $or: [
        { "profile.status": "Active" },
        { "profile.status": "Blacklisted" },
      ],
    }).exec();

    // Check if the profile exists and has an active loan
    if (profile) {
      return res.status(409).json({
        message:
          "Cannot make a new loan request while you have an active loan.",
      });
    }

    const newLoan = new Loan({
      account: JSON.parse(account),
      guarantor: JSON.parse(guarantor),
      loan: JSON.parse(loan),
    });

    await newLoan
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Loan request submitted successfully.",
          _id: doc._id.toString(),
        });
      })
      .catch(function (error) {
        res.status(400).json({ message: error.message });
      });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: err.message });
  }
};

exports.update_portfolio = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const data = req.body;

    let queryCriteria = {};
    for (const key in data) {
      if (key !== "user_id" && key !== "avatar") {
        queryCriteria[key] = JSON.parse(data[key]);
      }
    }
    if (req.file) {
      const avatar = req.file;
      try {
        const data = await mediaUpload.uploadToS3(avatar);
        if (data) {
          image = `${process.env.REACT_APP_MEDIA_URL}/${data.key}`;
          if (queryCriteria.profile) {
            queryCriteria.profile.avatar = `/${data.key}`;
          } else {
            queryCriteria.profile = { avatar: `/${data.key}` };
          }
        }
      } catch (err) {
        console.error(err);
        res.status(402).json({
          status: "failed",
          message: err.message,
        });
      }
    }

    let query = {};
    for (const key in queryCriteria) {
      for (const subKey in queryCriteria[key]) {
        const queryKey = `${key}.${subKey}`;
        query[queryKey] = queryCriteria[key][subKey];
      }
    }
    await UserProfile.updateOne({ _id: user_id }, { $set: query }).exec();
    const document = await UserProfile.findOne({ _id: user_id }).exec();

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.advanced_filter = async (req, res) => {
  try {
    let page = req.query.page;
    if (!page) {
      page = 1;
    }
    const organization = req.body.organization
      ? JSON.parse(req.body.organization)
      : null;
    const profile = req.body.profile ? JSON.parse(req.body.profile) : null;

    let combined = {};
    if (profile) {
      combined = { ...profile };
    }
    if (organization) {
      combined = { ...combined, ...organization };
    }

    let query = {};

    for (let [key, value] of Object.entries(combined)) {
      if (key === "profile" && Object.keys(value).length > 0) {
        for (let [i, j] of Object.entries(value)) {
          if (j !== "") {
            let queryKey = `profile.${i}`;
            const regex_pattern = `.*${j}.*`;
            query[queryKey] = { $regex: regex_pattern, $options: "i" };
          }
        }
      }
      if (key === "organization" && Object.keys(value).length > 0) {
        for (let [i, j] of Object.entries(value)) {
          if (j !== "") {
            let queryKey = `organization.${i}`;
            const regex_pattern = `.*${j}.*`;
            query[queryKey] = { $regex: regex_pattern, $options: "i" };
          }
        }
      }
    }

    const profiles = await UserProfile.find({ $and: [query] }).exec();
    const allDocuments = profiles.map((profile) => profile.toObject());

    res.status(200).json(allDocuments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const avatar = req.file ? req.file : null;
    const account = req.body.account ? JSON.parse(req.body.account) : null;
    const organization = req.body.organization
      ? JSON.parse(req.body.organization)
      : null;
    const education = req.body.education
      ? JSON.parse(req.body.education)
      : null;
    const socials = req.body.socials ? JSON.parse(req.body.socials) : null;
    const guarantor = req.body.guarantor
      ? JSON.parse(req.body.guarantor)
      : null;
    const profile = req.body.profile ? JSON.parse(req.body.profile) : null;

    if (avatar) {
      try {
        const data = await mediaUpload.uploadToS3(avatar);
        if (data) {
          const image = `${process.env.REACT_APP_MEDIA_URL}/${data.key}`;
          profile.avatar = `/${data.key}`;
        }
      } catch (err) {
        console.error(err);
        res.status(402).json({
          status: "failed",
          message: err.message,
        });
      }
    }

    const data = {
      profile: profile,
      account: account,
      organization: organization,
      education: education,
      socials: socials,
      guarantor: guarantor,
    };
    const newUser = new UserProfile(data);
    await newUser
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "User Added successfully.",
          _id: doc._id.toString(),
        });
      })
      .catch(function (error) {
        res.status(400).json({ message: error.message });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.adminBoard = (req, res) => {
  res.status(200).json("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json("Moderator Content.");
};
