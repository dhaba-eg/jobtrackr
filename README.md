# Vue JobTrackr 💼

A modern job application tracking system built with Vue 3, TypeScript, and Tailwind CSS. Keep track of your job applications, interview progress, and career opportunities all in one place.

![Vue JobTrackr](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tests](https://img.shields.io/github/actions/workflow/status/your-username/jobtrackr/tests.yml?style=for-the-badge&label=Tests)

## ✨ Features

- **📊 Dashboard Overview** - Comprehensive job application analytics
- **📝 Application Management** - Full CRUD operations for job applications
- **🔍 Advanced Filtering** - Filter by status, company, salary range, and more
- **📅 Application Timeline** - Visual timeline of your job search journey
- **💰 Salary Tracking** - Track salary offers and negotiation history
- **🌙 Dark/Light Mode** - Toggle between themes with persistence
- **⚡ Fast Performance** - Optimized with Vue 3 Composition API
- **🧪 Well Tested** - 95%+ test coverage with comprehensive test suite
- **🎨 Modern UI** - Beautiful interface with 40+ shadcn/ui components
- **🔐 Type Safety** - Full TypeScript implementation
- **📋 Form Validation** - Real-time validation with Zod schemas

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning fast build tool
- **Vue Router** - Client-side routing
- **Pinia** - State management

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - 40+ beautiful, accessible components
- **Radix Vue** - Unstyled, accessible UI primitives
- **Class Variance Authority** - Component variant management
- **Lucide Icons** - Crisp, customizable icons
- **Responsive Design** - Mobile-first approach

### Development & Testing

- **Vitest** - Unit and integration testing
- **Vue Test Utils** - Vue component testing utilities
- **ESLint & Prettier** - Code linting and formatting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v8 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/vue-jobtrackr.git
   cd vue-jobtrackr
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `pnpm dev`           | Start development server      |
| `pnpm build`         | Build for production          |
| `pnpm preview`       | Preview production build      |
| `pnpm test`          | Run tests in watch mode       |
| `pnpm test:run`      | Run tests once                |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm lint`          | Run ESLint                    |
| `pnpm format`        | Format code with Prettier     |
| `pnpm type-check`    | Run TypeScript type checking  |

## 🏗️ Project Structure

```
vue-jobtrackr/
├── src/
│   ├── api/                # API services and types
│   │   └── jobService.ts   # Job-related API calls
│   ├── components/         # Vue components
│   │   ├── ui/            # Shadcn/ui component library (40+ components)
│   │   ├── AppSidebar.vue
│   │   ├── DashboardStats.vue
│   │   ├── JobApplicationForm.vue
│   │   ├── JobCard.vue
│   │   ├── JobFilters.vue
│   │   ├── JobsGrid.vue
│   │   └── ThemeToggle.vue
│   ├── composables/       # Vue composition functions
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   ├── layouts/           # Layout components
│   │   └── MainLayout.vue
│   ├── lib/               # Utility functions
│   │   └── utils.ts
│   ├── router/            # Vue Router configuration
│   │   └── index.ts
│   ├── stores/            # Pinia stores
│   │   └── useJobStore.ts
│   ├── views/             # Page components
│   │   ├── AddJobView.vue
│   │   ├── EditJobView.vue
│   │   ├── JobDetailView.vue
│   │   ├── JobsView.vue
│   │   └── SettingsView.vue
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets & logos
|   └──tests/              # Comprehensive test suite
│      ├── components/     # Component tests
│      ├── composables/    # Composable tests
│      ├── stores/         # Store tests
│      └── test-utils.ts   # Testing utilities
├── public/                # Public static files
└── docs/                  # Documentation
```

## 🧪 Testing

This project maintains high test coverage with comprehensive unit and integration tests.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Generate coverage report
pnpm test:coverage
```

### Test Structure

- **Unit Tests** - Individual components and composables
- **Integration Tests** - Component interactions and workflows
- **Store Tests** - Pinia state management testing
- **Utility Tests** - Helper function validation

### Test Coverage

Current test coverage includes:

- ✅ **JobApplicationForm** - Form validation and submission
- ✅ **JobFilters** - Search and filtering functionality
- ✅ **JobCard** - Job display and interactions
- ✅ **useJobStore** - State management operations
- ✅ **useTheme** - Theme switching logic
- ✅ **API Services** - External service integration

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Customization

The application is highly customizable:

- **Themes** - Modify `tailwind.config.js` for custom colors and styling
- **Components** - Extend shadcn/ui components in `src/components/ui/`
- **API Integration** - Configure endpoints in `src/api/jobService.ts`
- **Layouts** - Customize app structure in `src/layouts/MainLayout.vue`
- **Routing** - Add new routes in `src/router/index.ts`

## 📊 Data Management

### Local Development

- Uses JSON Server for mock API
- Data stored in `db.json`
- Automatic data persistence

### Production Ready

- Easily adaptable to any REST API
- TypeScript interfaces for type safety
- Centralized API service layer

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set build command** to `pnpm build`
3. **Set output directory** to `dist`
4. **Deploy** 🎉

### Other Platforms

- **Netlify** - Drag and drop `dist` folder
- **GitHub Pages** - Use GitHub Actions workflow
- **AWS S3** - Upload `dist` folder to S3 bucket

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new features
5. **Ensure** all tests pass
6. **Submit** a pull request

### Code Standards

- **TypeScript** - All code must be typed
- **ESLint** - Follow the linting rules
- **Tests** - Maintain test coverage above 90%
- **Commits** - Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
