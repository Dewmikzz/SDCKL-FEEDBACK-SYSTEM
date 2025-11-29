# Feedback System - Sentral Digital College Kuala Lumpur

A comprehensive, mobile-responsive feedback system with analytical admin dashboard for Sentral Digital College Kuala Lumpur. The system allows students and visitors to submit feedback, and administrators to view, manage, and analyze feedback data.

## Features

### Public Features
- **Mobile-Responsive Feedback Form**: Submit feedback with name, email, phone, category, rating, and message
- **3D UI Effects**: Modern, interactive interface with animations
- **Preloader**: Logo animation with loading message
- **Real-time Validation**: Form validation with error messages
- **Success/Error Notifications**: User-friendly feedback on submission status
- **QR Code Ready**: The hosted link can be converted to QR code for easy access
- **Multi-Device Support**: Works on any device, any IP address, any location

### Admin Features
- **Secure Authentication**: JWT-based admin login system
- **Gmail-Style Dashboard**: Clean, modern interface with background patterns
- **Analytical Dashboard**: 
  - Total feedback count
  - Average rating
  - Status breakdown (pending, reviewed, resolved, archived)
  - Category distribution (pie chart)
  - Rating distribution (bar chart)
  - Recent trends
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Feedback Management**:
  - View all feedback with pagination
  - Search by name, email, or message
  - Filter by status and category
  - Edit feedback (status, category, rating, message)
  - Delete feedback
- **Multi-Device Access**: Access from any device, any IP, anywhere

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database (lightweight, no separate server needed)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Tailwind CSS** for responsive design
- **Recharts** for analytics visualization
- **Axios** for API calls
- **React Icons** for icons

## Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `JWT_SECRET` (use a strong secret in production)

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

## Default Admin Credentials

- **Username**: `admin@sdckl`
- **Password**: `sdckladmin123@`

**⚠️ Important**: Change the default admin password in production!

## Deployment to Vercel

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

### Quick Deploy

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-secret-key`
4. Deploy!

### Multi-Device Access

✅ **Fully Configured for Multi-Device Access:**
- CORS enabled for all origins
- Works on mobile, tablet, desktop
- Works from any IP address
- Works from any location
- Multiple users can access simultaneously

## Project Structure

```
QR_Feed_SDCKL/
├── server/
│   ├── config/
│   │   └── database.js       # SQLite database setup
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── feedback.js       # Public feedback routes
│   │   ├── admin.js          # Admin routes (protected)
│   │   └── auth.js           # Authentication routes
│   └── index.js              # Express server
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── config/
│   │   │   └── api.js        # API configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── data/
│   └── feedback.db           # SQLite database (created automatically)
├── vercel.json               # Vercel configuration
├── package.json
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/feedback` - Get all feedback (with optional filters)
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback/:id` - Get single feedback by ID

### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/feedback` - Get all feedback with pagination and filters
- `PATCH /api/admin/feedback/:id` - Update feedback
- `DELETE /api/admin/feedback/:id` - Delete feedback

## Mobile Responsiveness

The entire application is built with mobile-first design:
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for screens from 320px to 4K
- Tailwind CSS breakpoints: sm (640px), md (768px), lg (1024px)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- SQL injection protection (parameterized queries)
- CORS configuration for secure multi-origin access

## License

This project is created for Sentral Digital College Kuala Lumpur.

## Support

For issues or questions, please contact the development team.

**Powered by [DewX](https://www.dewmika.rf.gd)**
