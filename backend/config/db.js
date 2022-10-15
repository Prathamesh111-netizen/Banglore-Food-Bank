import mongoose from 'mongoose';

// connect to the mongoDB collection
const connectDB = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		})
		.then((res) =>
			console.log(
				`MongoDB Connected: ${res.connection.host}`)
		)
		.catch((err) => {
			console.error(`Error: ${err.message}`);
			process.exit(1);
		});
};

export default connectDB;
