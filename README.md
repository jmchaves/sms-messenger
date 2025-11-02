# SMS Messenger

A full-stack SMS messaging application that allows users to send and receive SMS messages through a web interface using Twilio integration.

## 🚀 Technologies

### Backend (API)
- **Ruby on Rails 8.0** - Web application framework
- **MongoDB 7** - NoSQL database with Mongoid ODM
- **Devise + JWT** - Authentication system with JSON Web Tokens
- **Twilio Ruby SDK** - SMS messaging integration
- **Puma** - Web server
- **Docker** - Containerization

### Frontend (Client)
- **Angular 20.3** - Frontend framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **RxJS** - Reactive programming library
- **Angular Router** - Client-side routing

### DevOps & Tools
- **Docker Compose** - Multi-container orchestration
- **Mongo Express** - MongoDB web-based admin interface
- **Kamal** - Deployment tool
- **Rubocop** - Ruby code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- Docker and Docker Compose
- Git

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jmchaves/sms-messenger.git
   cd sms-messenger
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   **Get the actual environment variables from**: [https://envshare.dev/unseal#gjNK6AS5K8qSsj9PXLRwF5d4Hby1T1FSRCqQGp3Km9tR](https://envshare.dev/unseal#gjNK6AS5K8qSsj9PXLRwF5d4Hby1T1FSRCqQGp3Km9tR)
   

3. **Build and start the application**
   ```bash
   docker compose up --build
   ```
> 💡 **Note**: Make sure you have the required permissions; otherwise, run sudo docker compose up --build

   This will start:
   - **API Server**: http://localhost:3000
   - **Angular Client**: http://localhost:4200
   - **MongoDB**: localhost:27017
   - **Mongo Express**: http://localhost:8081

## 🎯 Usage

### Accessing the Application

1. **Web Interface**: Navigate to http://localhost:4200
2. **API**: Endpoints available at http://localhost:3000/api/v1/
3. **Database Admin**: MongoDB admin interface at http://localhost:8081

### Test User Credentials

The application comes with a pre-configured test user for easy testing:

- **Email**: `test@example.com`
- **Password**: `password123`

### Features

- **User Authentication**: Secure login/logout with JWT tokens
- **SMS Messaging**: Send SMS messages through Twilio integration
- **Message History**: View sent and received messages
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🏗️ Project Structure

```
sms-messenger/
├── api/                    # Rails API backend
│   ├── app/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Data models (User, Message)
│   │   └── services/       # Business logic (TwilioService)
│   ├── config/             # Rails configuration
│   └── db/                 # Database seeds
├── client/                 # Angular frontend
│   ├── src/app/
│   │   ├── login/          # Authentication component
│   │   ├── messenger/      # Main messaging interface
│   │   ├── services/       # Angular services
│   │   └── guards/         # Route guards
│   └── public/             # Static assets
├── mongo/                  # MongoDB data and initialization
└── docker-compose.yml      # Container orchestration
```

## 📞 Support

For support and questions, please open an issue in the repository.
