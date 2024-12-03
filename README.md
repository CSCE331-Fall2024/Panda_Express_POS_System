# Panda Express POS System  
**CSCE331-Fall2024-Project-3-Team-0B**

---

## Table of Contents  
- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  

---

## Overview  
This project implements a **Point of Sale (POS) System** for Panda Express. It is a full-stack web application designed to streamline ordering and management processes for Panda Express employees while delivering an efficient and visually pleasing interface for customers.  

The system includes role-based access for **cashiers**, **managers**, and **customers**, with functionality tailored for each user type. The application dynamically adapts to environmental factors such as day/night themes based on real-time weather data.

---

## Features  
### General Features:  
- **Dynamic Theming**: Real-time adjustment between day/night themes using weather API.  
- **Role-Based Access Control (RBAC)**:  
  - **Customers**: Self-service ordering.  
  - **Cashiers**: Order processing and customer interaction.  
  - **Managers**: Access to managerial tools and the cashier interface.  
- **Responsive Design**: Optimized for different devices and screen sizes.  
- **Weather Integration**: Displays real-time weather icons and temperature for user location.  

### Customer-Specific Features:  
- Easy-to-use interface for browsing menu items by category.  
- Dynamic order summaries and cost breakdowns (subtotal, tax, total).  

### Cashier-Specific Features:  
- Simplified interface for quickly managing orders and processing payments.  
- Real-time menu display for assisting customers in-person.  

### Manager-Specific Features:  
- Managerial tools integrated with the cashier interface for seamless oversight.  

---

## Tech Stack  
### Frontend:  
- **TypeScript**: Provides static typing to enhance code reliability, maintainability, and developer efficiency.
- **React.js**: Dynamic UI rendering and component-based architecture.  
- **Next.js**: Server-side rendering and routing.  
- **Tailwind CSS**: Fast and efficient styling for responsive design.  
- **Lucide Icons**: Modern SVG icons for better visual appeal.  

### Backend:  
- **Node.js**: Backend API handling.  
- **Express.js**: REST API endpoints for menu items, user roles, and login management.  

### APIs:  
- **Weather API**: Fetches real-time weather data to determine the theme and display weather-related icons.  

### Database:  
- **PostgreSQL**: Storage for menu items, user roles, and orders.  
