import "../loadEnvirontments.js";
import mongoose from "mongoose";
import debugCreator from "debug";

const debug = debugCreator("items:database:root");

const connectDatabase = async (mongoUrl: string) => {
  await mongoose.connect(mongoUrl);
  debug("Database is on");
};

export default connectDatabase;
