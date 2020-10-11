const mongoose = require('mongoose');

const { Schema } = mongoose;

const NewsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  news_body: {
    type: String,
    required: true,
    max:2000
  },
  user_id:{
      type:String,
      required:true,
  }

},{ timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
