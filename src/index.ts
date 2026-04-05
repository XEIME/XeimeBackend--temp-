import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import "dotenv/config";
import express from "express";

import authRoutes from './routes/auth.routes.js'
import schoolRoutes from './routes/school.routes.js'
import teacherRoutes from './routes/teacher.routes.js'
import gradeRoutes from './routes/grades.routes.js'
import classRoutes from './routes/class.routes.js'
import studentAndParentRoutes from './routes/studentAndParent.routes.js'

const app = express();

app.use(express.json());

app.use('/auth', authRoutes)

app.use("/schools", schoolRoutes)

app.use("/teachers", teacherRoutes)

app.use("/grades", gradeRoutes)

app.use("/class", classRoutes)

app.use("/registration", studentAndParentRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(3000, () => {
  console.log("Servidor rodando na porta http://localhost:3000");
  console.log('Documentação disponível em http://localhost:3000/api-docs');
});
