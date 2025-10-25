import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"

dotenv.config();

const app = express();
const PORT = 4000
app.use(cors())

app.use(express.json());

app.use('/api/user', userRoutes)
app.use('/api/sessions', sessionRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});