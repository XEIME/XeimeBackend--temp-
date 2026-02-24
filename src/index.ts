import "dotenv/config";
import express from "express";
import authRoutes from './routes/auth.routes.js'
import schoolRoutes from './routes/school.routes.js'

const app = express();

app.use(express.json());

app.use('/auth', authRoutes)

app.use("/schools", schoolRoutes)

app.listen(3000, () => {
  console.log("Servidor rodando na porta http://localhost:3000");
});
