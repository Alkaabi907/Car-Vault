# CarVault - Personal Car Collection Manager 🚗

A comprehensive MERN stack application for managing your personal car collection, tracking maintenance records, and monitoring expenses.

## Features

### 🚗 Car Management
- Add, edit, and delete cars from your collection
- Track car details: make, model, year, color, license plate, VIN, mileage
- Upload car images
- Add notes and additional information

### 🔧 Maintenance Tracking
- Record maintenance services (Oil Change, Tire Rotation, Brake Service, etc.)
- Track service dates, mileage, and costs
- Set reminders for next service
- Upload service receipts
- Filter maintenance by type

### 💰 Expense Management
- Categorize expenses (Fuel, Insurance, Registration, Repairs, Parts, Tires)
- Track spending by car and category
- Generate expense summaries
- Upload expense receipts

### 📊 Dashboard
- Overview of your car collection
- Quick stats and summaries
- Recent maintenance and expenses
- Quick action buttons

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and data

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Multer** - File upload handling

### Frontend
- **React** - UI library with JSX
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling with modern design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd carvault-mern
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carvault
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
# From the root directory
npm run dev
```

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all user's cars
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/car/:carId` - Get maintenance for specific car
- `GET /api/maintenance/:id` - Get single maintenance record
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/car/:carId` - Get expenses for specific car
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary/categories` - Get expense summary by category

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Car
```javascript
{
  user: ObjectId (ref: User),
  make: String,
  model: String,
  year: Number,
  color: String,
  licensePlate: String (unique),
  vin: String,
  mileage: Number,
  image: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Maintenance
```javascript
{
  car: ObjectId (ref: Car),
  user: ObjectId (ref: User),
  type: String (enum),
  description: String,
  date: Date,
  mileage: Number,
  cost: Number,
  location: String,
  nextServiceDate: Date,
  nextServiceMileage: Number,
  receipt: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```javascript
{
  car: ObjectId (ref: Car),
  user: ObjectId (ref: User),
  category: String (enum),
  description: String,
  amount: Number,
  date: Date,
  mileage: Number,
  location: String,
  receipt: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
carvault-mern/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   ├── Maintenance.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── maintenance.js
│   │   └── expenses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── cars/
│   │   │   ├── maintenance/
│   │   │   └── expenses/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Deployment

### Backend (Render/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the build folder
3. Set environment variables for API URL

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Team Roles

- **Scrum Master**: Project coordination and sprint management
- **Frontend Lead**: React components and user interface
- **Backend Lead**: Express API and server logic
- **Database Manager**: MongoDB schemas and data relationships
- **Designer**: UI/UX design and user experience
- **GitHub Manager**: Version control and code review

## Future Enhancements

- [ ] Photo upload functionality with Cloudinary
- [ ] Data export (PDF reports)
- [ ] Mobile app (React Native)
- [ ] Push notifications for maintenance reminders
- [ ] Advanced analytics and charts
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline support with PWA

---

**CarVault** - Keep track of your automotive investments! 🚗💨
