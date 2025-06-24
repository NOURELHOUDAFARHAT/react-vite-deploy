const mongoose = require('mongoose');

const TripsSchema = new mongoose.Schema({
    cover:String,
    title: String,
    description:String,
    country: String,
    countryFrom:String,
    state:String,
    startDate:String,

    endDate: String,
 
    rangeDays:[Number],
    categories:[String],
    plannerName: { type: mongoose.Schema.Types.ObjectId, ref: 'Users',  select: 'fullName email avatar' }, 
    selectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users',  select: 'fullName email avatar' }]  

}, { collection: 'trips' });

const TripsModel = mongoose.model("trips", TripsSchema);

module.exports = TripsModel;