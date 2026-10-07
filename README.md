# DevEvent

DevEvent is a modern web application designed to discover, browse, and book tech events such as meetups, conferences, hackathons, and developer workshops.

The project is built with Next.js and uses MongoDB to store events and bookings, while offering an immersive interface inspired by the developer ecosystem.

## Features

- Event catalog with featured recent events
- Event detail pages including description, agenda, venue, date, and organizer information
- Booking form with basic validation and duplicate protection
- Similar event suggestions
- Image upload via Cloudinary
- User analytics with PostHog
- Responsive modern interface using Tailwind CSS

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Cloudinary
- PostHog

## Prerequisites

Before starting the project, make sure you have:

- Node.js 20+
- npm
- An accessible MongoDB database
- A Cloudinary account for image uploads
- (Optional) A PostHog project for analytics

## Installation

```bash
git clone https://github.com/yann-fk-21/Dev-Event.git
cd Dev-Event
npm install
```

Then create a `.env.local` file in the project root with the following variables:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dev-event
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Running the Project

### Development mode

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

### Code validation

```bash
npm run lint
```

## Project Structure

```text
dev-events/
├── app/                  # Next.js routes and API
│   ├── api/              # Backend endpoints
│   ├── events/           # Event detail pages
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
├── database/             # Mongoose models
├── lib/                  # Services, utilities, and server actions
├── public/               # Static assets
├── package.json          # Scripts and dependencies
├── tailwind.config.ts   # Tailwind configuration
├── next.config.ts        # Next.js configuration
├── .env.local            # Local environment variables
└── README.md             # Project documentation
```

## Main API

### Fetch events

- `GET /api/events`

### Create an event

- `POST /api/events`
- Accepts a multipart form containing the event data and an image

### Fetch an event by slug

- `GET /api/events/[slug]`

## Data Model

The project uses the following models:

- `Event`: title, slug, description, image, venue, date, time, agenda, tags, organizer, etc.
- `Booking`: email, slug, event identifier

## Deployment

The project is ready to be deployed on Next.js-compatible platforms such as Vercel.

For production deployment, make sure to configure the environment variables and MongoDB database correctly.

## License

This project does not currently include an explicit license in the repository. Please check the repository license before using it commercially or distributing it.
