# Vehicle Incident Management App

This is a **Vehicle Incident Management System** built with **Next.js (App Router)**, **Prisma ORM**, and **MongoDB (NeoDB)**.  
It allows fleet managers to track, report, and manage vehicle incidents efficiently with features like filtering, dashboards, CRUD operations, and user assignment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Backend](#backend)
- [Deployment](#deployment)
- [License](#license)
- [Notes](#notes)

---

## Project Overview

The Vehicle Incident App allows users to:

- Log incidents for fleet vehicles.
- Assign incidents to specific team members.
- Track status and severity of incidents.
- Filter incidents by severity, status, assigned user, or vehicle.
- View detailed incident pages with updates, images, and documents.
- Manage incidents through a dashboard with statistics.
- Track incident occurrence dates and reporting users.

---

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)  
- **Backend:** Next.js API routes  
- **Database:** MongoDB (NeoDB) with Prisma ORM  
- **State Management:** React Query (for fetching, caching, and mutation)  
- **Authentication:** JWT and Google OAuth  
- **Real-time updates:** WebSocket.io (for project management features)  

---

## Features

### Incident Management
- Create, update, delete incidents
- Assign incidents to users (`assignedTo`)
- Upload images and documents per incident
- Track `clockIn` and `clockOut` times for users

### Filters & Pagination
- Filter incidents by:
  - Severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
  - Status (`PENDING`, `IN_PROGRESS`, `CLOSED`, `RESOLVED`, `CANCELLED`)
  - Car
  - Assigned user
- Paginated incident listing

### Dashboard
- Overview of incidents by status and severity
- Reports for user productivity and incident counts

### Frontend Components
- Incident table for desktop and mobile
- Form for adding/editing incidents
- Dynamic assigned-to dropdown
- Image preview with delete option
- Responsive layout with Tailwind CSS

### Backend
- Prisma models for `Incident`, `User`, `Car`, `Updates`
- CRUD APIs for incidents
- Filter and search APIs
- Real-time updates for incident changes (optional for future)

---

## Project Structure

├─ app/ # Next.js App Router pages
│ ├─ fleetmanager/
│ │ ├─ incidents/
│ │ │ ├─ [id]/ # Incident details & edit pages
│ │ │ ├─ new/ # Add new incident page
│ │ │ ├─ page.tsx # Incident list page
│ │ │ └─ stats/ # Dashboard page
├─ components/ # React UI components (Tables, Modals, Inputs)
├─ constants/ # Interfaces and enums
├─ lib/ # Utilities and database setup (Prisma)
├─ prisma/ # Prisma schema and migrations
├─ public/ # Static assets (images, fonts)
├─ styles/ # Tailwind & global styles
├─ package.json # Dependencies & scripts


## Getting Started

### Install Dependencies
npm install
npm run dev

Build for Production
npm run build
npm run start

API Endpoints
Incident APIs

GET /api/incidents – List incidents with optional filters (status, severity, carId, assignedToId)

POST /api/incidents – Create a new incident

PUT /api/incidents/:id/edit – Update an incident

DELETE /api/incidents/:id – Delete an incident

User APIs

GET /api/users – List users for assignment dropdown

POST /api/auth/google – Google OAuth authentication

Car APIs

GET /api/cars – List all cars

Frontend Details

React Query for API fetching and caching

Tailwind CSS for styling

Next.js dynamic routing for incident details pages

Form validation with TypeScript interfaces

Image preview and upload handling

Backend Details

Prisma ORM for database modeling

MongoDB (NeoDB) for storing incidents, users, cars, updates

Enum support for severity and status

Filtering and pagination support in APIs

Error handling using NextResponse.json

Notes

This app is built with Next.js App Router.

Implements assignedTo feature for incidents.

Includes image/document uploads and preview functionality.

Fully typed with TypeScript and optimized with React Query.
