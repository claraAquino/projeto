import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { sequelize } from './config/database.js';
import userRoutes from './routes/user_routes.js';
import perfilRoutes from './routes/perfil_routes.js';
import usuarioPerfilRoutes from './routes/perfilUsuario_routes.js';

const app = express();
sequelize.sync();

app.use(helmet());
app.use(cors());
app.use(express.json()); // 👈 necessário para processar JSON no body

app.get('/health', (req, res) => res.send({ status: 'ok' }));
app.use('/users', userRoutes);//rota do usuário
app.use('/usuario-perfil', usuarioPerfilRoutes);//rota do perfil_usuario
app.use('/perfil', perfilRoutes);//rota do perfil

export default app;
