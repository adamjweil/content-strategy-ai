# Content Strategy AI

A powerful AI-driven content strategy platform built with Next.js and Firebase, leveraging OpenAI's API to provide intelligent content analysis and planning capabilities.

## Features

- **Content Analysis**: Analyze URLs and get detailed insights about content quality, SEO performance, and strategic recommendations
- **Content Calendar**: Plan and manage your content schedule with AI-assisted content ideas generation
- **URL Management**: Save and organize URLs for batch analysis
- **PDF Export**: Generate detailed reports of your content analysis
- **User Authentication**: Secure Firebase authentication system

## Tech Stack

- **Frontend**: Next.js 15.1, React 19.0
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase
- **AI Integration**: OpenAI API
- **PDF Generation**: @react-pdf/renderer
- **TypeScript**: For type safety and better developer experience

## Screenshots

Here's a visual overview of the Content Strategy AI platform:

### Content Analysis Dashboard
![Content Analysis Dashboard](/public/screenshots/Analysis.png)
*Comprehensive content analysis with performance metrics, audience insights, and strategic recommendations*

### Content Calendar & Planning
![Content Calendar Preferences](/public/screenshots/Calendar_prefs.png)
*Customize your content mix and planning preferences*

### AI-Generated Content Recommendations
![AI Content Recommendations](/public/screenshots/Recommended_story.png)
*Smart content recommendations with strategic insights based on your audience and goals*

### URL Management
![URL Management](/public/screenshots/URLs.png)
*Easily manage content URLs for analysis and tracking*

## Prerequisites

Before running this application, make sure you have:

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- Firebase account
- OpenAI API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd content-strategy-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

- `/src/app`: Main application pages and routing
- `/src/components`: Reusable React components
- `/src/contexts`: React context providers (Auth, etc.)
- `/src/lib`: Utility functions and Firebase configuration
- `/src/types`: TypeScript type definitions
- `/public`: Static assets and images

## Features in Detail

### Content Analysis
- Upload URLs for analysis
- Get detailed SEO insights
- Receive content quality scores
- View engagement metrics
- Get AI-powered recommendations

![Content Analysis Dashboard](/public/screenshots/Analysis.png)

### Content Calendar
- Plan content strategy
- Generate content ideas
- Schedule content publication
- Track content performance

![Content Calendar Preferences](/public/screenshots/Calendar_prefs.png)

### Dashboard
- View analytics overview
- Manage saved URLs
- Access recent analyses
- Export reports to PDF

![URL Management](/public/screenshots/URLs.png)

### Content Recommendations
- Receive AI-generated content ideas
- Get strategic insights for content creation
- Understand audience targeting recommendations
- Optimize content type and timing

![AI Content Recommendations](/public/screenshots/Recommended_story.png)

## Deployment

The application is configured for deployment on Vercel and Firebase. Follow these steps:

1. Set up Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license information here]

## Support

[Add support contact information here]
