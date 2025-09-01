# Eventful by Leyyow

A comprehensive event management platform for popup event organizers

> Streamline your popup event organization with powerful tools for planning, managing attendees, and tracking event success.

## 🚀 Features

- **Event Management**: Complete toolkit for creating, organizing, and managing popup events
- **Attendee Management**: Track registrations, check-ins, and engagement
- **Real-time Analytics**: Monitor event performance and attendee insights
- **Modular Architecture**: Clean, organized modules for different event management functions
- **Modern Tech Stack**: Vue 3 with Composition API, TypeScript, and Vite
- **Responsive Design**: Mobile-friendly design using Tailwind CSS v4

## 🏗️ Architecture

Eventful by Leyyow follows a modular architecture with separate modules for different event management features:

### Core Modules

- **🔐 [Auth Module](src/modules/auth/README.md)** - User authentication and authorization
- **🎪 [Shared Module](src/modules/shared/README.md)** - Popup event creation and management
- **🏡 [Landing Module](src/modules/landing/README.md)** - Landing pages and public content
- **⚙️ [Settings Module](src/modules/settings/README.md)** - User and event configuration

### Layouts

- **LandingLayout** - Public pages and event landing pages
- **AuthLayout** - Authentication pages (login, register, forgot password)
- **MainLayout** - Main application interface for event organizers

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: Vue Router 4
- **Code Quality**: ESLint + Prettier
- **Fonts**: Custom Sato font family
- **State Management**: Pinia

## 📁 Project Structure

```
eventful-by-leyyow/
├── public/                 # Static assets and logos
├── src/
│   ├── assets/            # Images, fonts, and styles
│   ├── components/        # Shared UI components
│   ├── layouts/           # Application layouts
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication and user management
│   │   ├── shared/        # Event creation and management
│   │   ├── settings/      # User and system settings
│   │   └── landing/       # Public pages and landing
│   ├── router/            # Routing configuration
│   ├── utils/             # Utility functions and helpers
│   ├── composables/       # Vue composables and API calls
│   ├── App.vue           # Root component
│   └── main.ts           # Application entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd eventful
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Styling

Eventful by Leyyow uses Tailwind CSS v4 for styling with a custom design system:

- **Typography**: Custom Sato font family (Light, Regular, Medium, Semi, Bold, Heavy)
- **Theme**: Event-focused color scheme and spacing defined in `assets/css/theme.css`
- **Components**: Consistent UI components optimized for event management workflows

## 🔧 Development

### Module Development

Each module in Eventful by Leyyow is self-contained with its own:

- Routes configuration
- Components specific to the feature
- Views and page layouts
- API composables and data management
- Documentation

When adding new event management features:

1. Choose the appropriate module or create a new one
2. Follow the established patterns and conventions
3. Update module documentation
4. Ensure proper TypeScript typing
5. Test with real event scenarios

### Code Quality

Eventful by Leyyow enforces high code quality standards through:

- **TypeScript**: Strong typing for better development experience and fewer runtime errors
- **ESLint**: Code linting with Vue 3 and TypeScript rules
- **Prettier**: Consistent code formatting across the entire codebase
- **Vue 3 Standards**: Modern Vue.js best practices and Composition API patterns
- **Conventional Commits**: Standardized commit messages for better project history

## 🚀 Deployment

Eventful by Leyyow is configured for deployment on Vercel with the included `vercel.json` configuration. You can also deploy to any static hosting service by running:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

We welcome contributions to make Eventful by Leyyow even better for event organizers!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using **Conventional Commits** format (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common Types:**

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `perf` - A code change that improves performance
- `test` - Adding missing tests or correcting existing tests
- `build` - Changes that affect the build system or external dependencies
- `ci` - Changes to our CI configuration files and scripts
- `chore` - Other changes that don't modify src or test files
- `revert` - Reverts a previous commit

## 🔗 Links

- **Preview**: [leyyow.com](https://leyyow.com)
