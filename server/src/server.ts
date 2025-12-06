import dotenv from "dotenv";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {prisma} from './lib/prisma'
import {errorHandler} from "./middlewares/errorHandler";
import authRoutes from './routes/auth.routes';
import languagesRoutes from './routes/languages.routes';
import coursesRoutes from './routes/courses.routes';
import lessonsRoutes from './routes/lessons.routes';

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
app.use('/api/languages', languagesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api', lessonsRoutes);

async function startServer(){
    try {
        await prisma.$connect();
        console.log('Connected to database');

        // Start server
        app.listen(port, () => {
            const url = `http://localhost:${port}`;
            console.log(`Server started: \u001b]8;;${url}\u0007${url}`);
        })
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
}

startServer();