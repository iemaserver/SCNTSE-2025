# SCMTS 2025 - Talent Search Application

## Overview

This is a React-based web application for the Prof. (Dr.) Satyajit Chakrabarti  Talent Search (SCMTS) 2025. The application serves as an informational website with a modern neon-themed design, animated particle background, and includes an AI-powered chatbot to help students choose between Science and English examinations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✓ Removed "Subject Help" from navigation menu
✓ Added floating AI chatbot for subject recommendation
✓ Implemented neon particle background with connecting lines
✓ Added countdown timer to exam date
✓ Enhanced UI with neon glow effects and modern styling
✓ Converted to frontend-only application (no database required)
✓ Updated questionnaire system to work through AI bot interface

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
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage (MemStorage class)
- **API Design**: RESTful endpoints

### Build and Development
- **Development**: TSX for running TypeScript server code
- **Production Build**: esbuild for server bundling, Vite for client bundling
- **Deployment**: Single-server deployment with static file serving

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

### Backend Components
- **Routes**: Express route handlers for API endpoints
- **Storage**: Memory-based storage implementation
- **Database Schema**: Drizzle schema definitions
- **Validation**: Zod schema validation for API requests

### UI System
- **Component Library**: Comprehensive shadcn/ui components
- **Design System**: Consistent styling with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Theme**: Default dark theme with custom color palette

## Data Flow

### Questionnaire Flow
1. User answers 4 multiple-choice questions
2. Frontend calculates recommendation based on answers
3. Response submitted to `/api/questionnaire` endpoint
4. Backend validates and stores response
5. Success confirmation displayed to user

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
- **Database**: Drizzle ORM, Neon Database client
- **Validation**: Zod with drizzle-zod
- **Session**: connect-pg-simple (configured but not actively used)
- **Development**: tsx for TypeScript execution

### Build Dependencies
- **Build Tools**: Vite, esbuild
- **TypeScript**: Full TypeScript support
- **PostCSS**: CSS processing with Tailwind
- **Replit Integration**: Replit-specific plugins and banners

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **API Proxy**: Vite middleware for API routes
- **Error Handling**: Runtime error overlay for development
- **Logging**: Custom logging system for API requests

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built client files
- **Single Process**: Combined server handles API and static files

### Database Setup
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: PostgreSQL connection via DATABASE_URL
- **Migrations**: Located in `./migrations` directory
- **Schema**: Shared schema definitions in `./shared/schema.ts`

### Environment Configuration
- **Development**: NODE_ENV=development with tsx
- **Production**: NODE_ENV=production with compiled JavaScript
- **Database**: DATABASE_URL environment variable required
- **Port**: Configurable server port (default Express behavior)

The application is designed for deployment on Replit with specific plugins and configurations for the platform, but can be adapted for other hosting environments by removing Replit-specific dependencies.