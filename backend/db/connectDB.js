import mongoose from "mongoose";

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Successfully connect to mongoDB...");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
