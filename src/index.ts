import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import "dotenv/config";
import express from "express";

import cors from "cors";

import authRoutes from './routes/auth.routes.js'
import schoolRoutes from './routes/school.routes.js'
import teacherRoutes from './routes/teacher.routes.js'
import gradeRoutes from './routes/grades.routes.js'
import classRoutes from './routes/class.routes.js'
import studentAndParentRoutes from './routes/studentAndParent.routes.js'
import student from './routes/student.routes.js'
import parent from './routes/parent.routes.js'

const app = express();

//using global cors before my rotes
app.use(cors ({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.use("/schools", schoolRoutes);

app.use("/teachers", teacherRoutes);

app.use("/grades", gradeRoutes);

app.use("/class", classRoutes);

app.use("/registration", studentAndParentRoutes);

app.use("/students", student);

app.use("/parents", parent );

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(5000, () => {
  console.log("Servidor rodando na porta http://localhost:5000");
  console.log('Documentação disponível em http://localhost:5000/api-docs');
});