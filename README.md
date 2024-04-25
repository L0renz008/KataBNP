# Property Management Portal

This project is a web application designed to facilitate property management tasks for property managers. It includes functionalities such as managing properties, tenants, and maintenance tasks.

## Objective

The objective of this project is to develop a Kata for an interview

## Technologies Used

### Backend

- **Python 3.12.3**
- **Flask**: Micro web framework for Python
- **PostgreSQL 16**: Database management system
- **psycopg2**: PostgreSQL adapter for Python
- **flask_cors**: Flask extension for handling Cross-Origin Resource Sharing (CORS)
- **flasgger**: Flask extension for Swagger API documentation

### Frontend

- **Angular 17.3.5**: TypeScript-based web application framework
- **SCSS**: CSS preprocessor for styling
- **NgRx**: State management library for Angular
- **RxJS**: Library for handling asynchronous operations in Angular

## Installation and Setup

### Backend

1. **Set Up PostgreSQL Database**:
   - Install PostgreSQL on your machine if not already installed.
   - Create a new database named `Kata_BNPParibas` for the application.

2. **Clone this Repository**:
   ```bash
   git clone https://github.com/L0renz008/KataBNP.git
   cd KataBNP
   ```

3. **Install Python Dependencies**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```

4. **Environment Variables**:
   - Create a `.env` file in the project root and set the following variables:
     ```plaintext
     database
     user
     password
     host
     port
     ```

5. **Run the Flask Server**:
   ```bash
   flask --app app run
   ```

### Frontend

1. **Install Angular CLI**:
   - Install Angular CLI globally if not already installed:
     ```bash
     npm install -g @angular/cli@17.3.5
     ```

2. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Angular Development Server**:
   ```bash
   ng serve
   ```

5. **Access the Application**:
   - Open a web browser and navigate to `http://localhost:4200` to access the Property Management Portal frontend.

## Usage

- **Backend API Documentation**:
  - Swagger API documentation is available at `http://localhost:5000/apidocs` after starting the Flask server.

- **Frontend Usage**:
  - Use the Angular frontend to interact with the backend API and manage properties, tenants, and maintenance tasks.

## Additional Notes

- **Testing**:
  - Unit tests are located in the `tests/` directory. Not all tests were developed due to time constraints in completing this kata.

- **POSTMAN**
  - Here is a link to the POSTMAN API. It is where I wrote some of the CRUD Operations. Not all operations are listed but the main one. https://api.postman.com/collections/33805902-6c811a3c-34b7-49c4-8a94-f9ed8b75c837?access_key=PMAT-01HWASVAYTJWY1HWR8N336HJKA

- **Others**
  - Due to time constraint between my current job and this Kata, some features have not been implemented in all the frontend but only on **Properties**. It will be a pleasure to discuss with you about this and my implemention of others features with more time!
  - My main ideas are :
    - A search bar for the tenants and the tasks
    - The possibility to edit a tenant and a task (as it is with a property)


