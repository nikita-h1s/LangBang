import dotenv from "dotenv";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {prisma} from './lib/prisma'
import {errorHandler} from "./middlewares/errorHandler";
import authRoutes from './routes/auth.routes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(errorHandler);

const swaggerDocument = YAML.load('./src/swagger.yaml');

// Endpoints
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', authRoutes);

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