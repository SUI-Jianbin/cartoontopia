const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

});

const Admin = mongoose.model('admin', adminSchema, 'adminlist');
module.exports = Admin;