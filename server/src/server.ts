import dotenv from "dotenv";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {prisma} from './lib/prisma'

import authRoutes from './routes/auth.routes';
import languagesRoutes from './routes/languages.routes';
import coursesRoutes from './routes/courses.routes';
import lessonsRoutes from './routes/lessons.routes';
import exercisesRoutes from './routes/exercises.routes'
import achievementsRoutes from './routes/achievements.routes';
import chatRoutes from './routes/chat.routes';
import usersRoutes from './routes/users.routes';

import {errorHandler} from "./middlewares/errorHandler";
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

const swaggerDocument = YAML.load('./src/swagger.yaml');

// Endpoints
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', authRoutes);
app.use('/api', languagesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api', lessonsRoutes);
app.use('/api', exercisesRoutes);
app.use('/api', achievementsRoutes);
app.use('/api', chatRoutes);
app.use('/api', usersRoutes);

app.use(errorHandler);

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