import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      formAction: ["'self'", "https://formspree.io"],
    },
  },
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - This should handle CSS, JS, and images
app.use(express.static(path.join(__dirname, 'public')));

// Routes - Only for HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/studio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'studio.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email address' 
    });
  }
  
  // Log the message (always works)
  console.log('=== NEW CONTACT FORM SUBMISSION ===');
  console.log('From:', name);
  console.log('Email:', email);
  console.log('Message:', message);
  console.log('Time:', new Date().toISOString());
  console.log('=====================================');
  
  // Try to send email if SendGrid is configured (production only)
  if (process.env.SENDGRID_API_KEY) {
    try {
      // This would require SendGrid package in production
      // For now, just log that we would send email
      console.log('Would send email via SendGrid to: info@pinnaclestudio.in');
    } catch (error) {
      console.error('Email service error:', error);
    }
  }
  
  // Always return success to user
  res.json({ 
    success: true, 
    message: 'Message received. We\'ll be in touch.' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Pinnacle Design Studio server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'public')}`);
});
