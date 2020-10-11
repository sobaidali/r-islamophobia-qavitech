const mongoose = require('mongoose');

const { Schema } = mongoose;

const DonationSchema = new Schema({
  amount: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
  },
  user_id:{
      type:String
  }

},{ timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);