const dotenv=require('dotenv');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const db=()=>{
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
};
module.exports=db;