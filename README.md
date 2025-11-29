# Feedback System - Sentral Digital College Kuala Lumpur

A comprehensive, mobile-responsive feedback system with analytical admin dashboard for Sentral Digital College Kuala Lumpur. The system allows students and visitors to submit feedback, and administrators to view, manage, and analyze feedback data.

## Features

### Public Features
- **Mobile-Responsive Feedback Form**: Submit feedback with name, email, phone, category, rating, and message
- **Real-time Validation**: Form validation with error messages
- **Success/Error Notifications**: User-friendly feedback on submission status
- **QR Code Ready**: The hosted link can be converted to QR code for easy access

### Admin Features
- **Secure Authentication**: JWT-based admin login system
- **Analytical Dashboard**: 
  - Total feedback count
  - Average rating
  - Status breakdown (pending, reviewed, resolved, archived)
  - Category distribution (pie chart)
  - Rating distribution (bar chart)
  - Recent trends
- **Feedback Management**:
  - View all feedback with pagination
  - Search by name, email, or message
  - Filter by status and category
  - Edit feedback (status, category, rating, message)
  - Delete feedback
- **Real-time Updates**: Dashboard refreshes automatically after changes

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

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change the default admin password in production!

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
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── data/
│   └── feedback.db           # SQLite database (created automatically)
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

## Deployment

### For Production:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Set environment variables**:
   - `NODE_ENV=production`
   - `JWT_SECRET=<strong-random-secret>`
   - `PORT=<your-port>`

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Convert to QR Code**:
   - Once deployed, get your hosting URL (e.g., `https://yourdomain.com`)
   - Use any QR code generator to create a QR code from the URL
   - The QR code can be printed or displayed for easy access

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
- CORS configuration

## Future Enhancements

- Email notifications for new feedback
- Export feedback to CSV/Excel
- Advanced filtering and sorting
- Feedback response/reply system
- User accounts for feedback tracking
- Multi-language support

## License

This project is created for Sentral Digital College Kuala Lumpur.

## Support

For issues or questions, please contact the development team.

