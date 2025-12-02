import dotenv from "dotenv";
import express, {type Request, type Response} from 'express';
import {prisma} from './lib/prisma'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Endpoints
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the server');
})

async function startServer(){
    try {
        await prisma.$connect();
        console.log('Connected to database');

        // Start server
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
}

startServer();