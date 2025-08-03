import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectToDatabase} from './src/config/db.js';
import cookieParser from 'cookie-parser';
import {createTables} from './src/utils.js/dbUtils.js';
import {authRouter} from './src/routes/authRoutes.js';
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
	try {
		await connectToDatabase();
		await createTables();

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Error creating tables:', error.message);
		process.exit(1);
	}
};

startServer();
