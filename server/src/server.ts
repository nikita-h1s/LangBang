import dotenv from "dotenv";
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './routes/auth.routes';
import languagesRoutes from './routes/languages.routes';
import coursesRoutes from './routes/courses.routes';
import lessonsRoutes from './routes/lessons.routes';
import exercisesRoutes from './routes/exercises.routes';
import achievementsRoutes from './routes/achievements.routes';
import chatRoutes from './routes/chat.routes';
import usersRoutes from './routes/users.routes';

import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const swaggerDocument = YAML.load(path.join(process.cwd(), './src/swagger.yaml'));

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

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
}

export default app;