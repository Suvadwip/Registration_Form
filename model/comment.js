const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = new schema(
  {
    comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const commentModel = new mongoose.model("commentdata", commentSchema);
module.exports = commentModel;
