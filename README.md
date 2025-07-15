# SCMTS 2025 - Talent Search Application

## Overview

This is a React-based web application for the Prof. (Dr.) Satyajit Chakrabarti  Talent Search 2025. 

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules

## Key Components

### Frontend Components
- **Navigation**: Fixed navigation with smooth scrolling
- **Hero Section**:  introduction with exam date
- **About Section**: Information about SCMTS
- **Questionnaire Section**: Interactive subject selection tool
- **Exam Info Section**: Detailed examination structure
- **Venues Section**: Exam location information
- **FAQ Section**: Collapsible frequently asked questions
- **Footer**: Contact information and quick links

### UI System
- **Component Library**: Comprehensive shadcn/ui components
- **Design System**: Consistent styling with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Theme**: Default dark theme with custom color palette

## Data Flow

### Navigation Flow
1. Single-page application with smooth scrolling navigation
2. Wouter handles client-side routing
3. 404 page for undefined routes
4. Responsive mobile navigation with sheet component

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Data Fetching**: TanStack Query
- **Routing**: Wouter
- **Icons**: Lucide React
- **Validation**: Zod
- **Date Handling**: date-fns

### Backend Dependencies
- **Server**: Express.js
- **Development**: tsx for TypeScript execution
