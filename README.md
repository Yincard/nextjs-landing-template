# Next.js Landing Page Template with Authentication

A modern, responsive landing page template built with Next.js 14, TailwindCSS, and Firebase Authentication. Features smooth animations, dark mode support, and a complete authentication system.

## Features

- Modern UI with Tailwind CSS
- Firebase Authentication
- Fully responsive design

## Tech Stack

- Next.js 14
- React 18
- TailwindCSS
- Firebase
- NextAuth.js
- Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yincard/nextjs-landing-template.git
cd nextjs-landing-template
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── about/             # About page
│   ├── dashboard/         # Protected dashboard
│   ├── login/            # Authentication pages
│   └── layout.js         # Root layout
├── components/           
│   ├── auth/            # Auth components
│   ├── layout/          # Layout components
│   ├── providers/       # Context providers
│   └── ui/              # Reusable UI components
└── styles/              # Global styles
```

## Authentication Features

- Email/Password authentication
- Protected routes
- Persistent sessions
- Loading states
- Error handling
- Redirect handling

## Customization

### Styling

Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {...},
                secondary: {...}
            }
        }
    }
}
```

### Components

Key components that can be customized:

- `Header.js`: Navigation and branding
- `Footer.js`: Site footer and links
- `HeroBanner.js`: Landing page hero section
- `LoadingScreen.js`: Loading animations

## Deployment

1. Build the project:
```bash
npm run build
# or
yarn build
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Created by Yincard
