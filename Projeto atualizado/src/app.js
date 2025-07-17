import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/database.js';
import { fileURLToPath } from 'url';

// Importações de rotas
import userRoutes from './routes/user_routes.js';
import perfilRoutes from './routes/perfil_routes.js';
import authRoutes from './routes/auth_routes.js';
import perfilUsuarioRoutes from './routes/perfilUsuario_routes.js';
import categoriaRoutes from './routes/categoria_routes.js';
import subcategoriaRoutes from './routes/subcategoria_routes.js';
import documentoRoutes from './routes/documento_routes.js';
import feedbackRoutes from './routes/feedback_routes.js';
import sessaoRoutes from './routes/sessao_routes.js';
import utilsRoutes from './routes/utils_router.js';
import atendimentoRoutes from './routes/atendimento_routes.js';
import embeddingRouter from './routes/embeddings.js';
import generateRoute from './routes/generate_routes.js';

const app = express();
sequelize.sync();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📥 Requisição recebida: ${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:8000"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],  
      },
    },
  })
);

// Para __dirname funcionar no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Montar rotas da API antes das rotas estáticas
app.use('/auth', authRoutes);

// Rota raiz para enviar o arquivo login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// ROTAS
app.get('/health', (req, res) => res.send({ status: 'ok' }));

app.use('/users', userRoutes);
app.use('/perfis', perfilRoutes);
app.use('/perfil-usuario', perfilUsuarioRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/subcategoria', subcategoriaRoutes);
app.use('/documentos', documentoRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/sessoes', sessaoRoutes);
app.use('/api', utilsRoutes);
app.use('/api/atendimento', atendimentoRoutes);

app.use('/api/generate', generateRoute);


app.use('/api/embeddings', embeddingRouter);


export default app;

async function init() {
  try {
    const [results] = await sequelize.query("SHOW search_path");
    console.log('Search path:', results);
  } catch (error) {
    console.error('Erro ao verificar search_path:', error);
  }
}

init();
