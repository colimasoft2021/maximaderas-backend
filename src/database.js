import mongoose from "mongoose";

let uri = process.env.DATABASE_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.Promise = global.Promise;
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Conectado a MongoDB 💾");
  })
  .catch(err => {
    console.error(err);
  });
