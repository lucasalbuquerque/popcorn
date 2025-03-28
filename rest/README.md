<p align="center">
  <h1>🍿 Popcorn Shop API</h1>
</p>

## Description

A NestJS-based REST API for a popcorn shop with user management, role-based access control, product catalog, and AI-powered chat recommendations.

## Features

- **User Management**

  - User registration and authentication
  - Role-based access control (Super Admin, Admin, User)
  - JWT-based authentication

- **Product Catalog**

  - Product creation, updates and deletion
  - Product search and filtering
  - Category management

- **AI Chat Assistant**
  - Product recommendations based on user queries
  - Natural language processing using Azure OpenAI
  - Contextual product suggestions

## API Documentation

The API documentation is available via Swagger UI at [http://localhost:4000/docs](http://localhost:4000/docs) when the application is running.

## Running

- `make docker-build` - Build and start containers
- `make docker-up` - Start containers
- `make docker-down` - Stop containers
- `make docker-logs` - View container logs
- `make docker-ps` - List running containers
- `make docker-clean` - Remove containers and prune system
- `make dev-down` - Stop development containers
