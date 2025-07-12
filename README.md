# Random Club Challenge

A modern golf club challenge app where users can manage clubs, create bags, assign clubs, and get random club suggestions with smooth animations and transitions.

## Features

- **🏌️ Club Management**: Create, edit, and delete individual golf clubs
- **🗑️ Bulk Operations**: Clear all clubs with safety confirmations
- **🎒 Bag Management**: Create and manage golf bags with custom names and descriptions
- **🔗 Club Assignment**: Assign clubs to bags with easy checkbox interface
- **🎲 Random Selection**: Get random club suggestions from your bags
- **🌙 Dark Mode**: Toggle between light and dark themes
- **✨ Smooth Animations**: Modern UI with view transitions and micro-interactions
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **💾 Shared Data**: Persistent data for all users (no authentication required)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: tw-animate-css, view transitions API
- **Database**: SQLite (server-side with better-sqlite3)
- **Icons**: Lucide React, custom SVG icons
- **Deployment**: Ready for server deployment

## Pages & Navigation

- **🏠 Home**: Landing page with app overview
- **🎒 Bags**: Manage golf bags and assign clubs
- **🏌️‍♂️ Clubs**: Full CRUD management for golf clubs
- **🎮 Play**: Get random club suggestions from your bags

## Database Setup

The app uses a server-side SQLite database that persists data for all users:

- Database file: `data/golf-clubs.db` (created automatically)
- All users share the same data
- No user authentication required
- Data persists across server restarts
- Auto-seeded with default golf clubs on first run

### Setting up the Database (for new clones or deployments)

**Recommended:**

Just run the setup script after installing dependencies:

```sh
npm install
npm run setup
```

This will create the `data/` directory and copy the template database if needed.

---

You can also initialize manually:

**Option 1: Use the Template Database**

1. Copy the template file to create your working database:
   ```sh
   cp database.template.sqlite data/golf-clubs.db
   ```
2. Start the app as usual.

**Option 2: Use the SQL Seed Script**

1. Create a new SQLite database and apply the schema/data:
   ```sh
   mkdir -p data
   sqlite3 data/golf-clubs.db < seed.sql
   ```
2. Start the app as usual.

> **Note:** Your working database (`data/golf-clubs.db`) is ignored by git. Only the template and seed files are tracked in the repository.

## Development

```bash
# Install dependencies
npm install

# Run setup script (creates database if needed)
npm run setup

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Bags
- `GET /api/bags` - Get all bags
- `POST /api/bags` - Create a new bag
- `PUT /api/bags/[id]` - Update a bag
- `DELETE /api/bags/[id]` - Delete a bag

### Clubs
- `GET /api/clubs` - Get all clubs (auto-seeded)
- `POST /api/clubs` - Create a new club
- `PUT /api/clubs/[id]` - Update a club
- `DELETE /api/clubs/[id]` - Delete a club
- `DELETE /api/clubs` - Clear all clubs

### Bag-Club Relations
- `GET /api/bags/[id]/clubs` - Get clubs for a bag
- `POST /api/bags/[id]/clubs` - Add club to bag
- `DELETE /api/bags/[id]/clubs?clubId=X` - Remove club from bag

### Random Selection
- `GET /api/bags/[id]/random` - Get random club from bag

## Data Structure

### Tables
- **golfClubs**: Available golf clubs with name, description, and icon
- **golfBags**: User-created golf bags with name and description
- **golfClubRelations**: Many-to-many relationship between bags and clubs

### Default Clubs
The app comes pre-seeded with common golf clubs:
- Driver, 3 Wood, 5 Wood
- 3 Hybrid, 4 Hybrid
- 3-9 Irons
- Pitching Wedge, Gap Wedge, Sand Wedge, Lob Wedge
- Putter

## UI Features

- **🎨 Theming**: Subtle green golf-themed color palette
- **🌙 Dark Mode**: System preference detection with manual toggle
- **✨ Animations**: Smooth transitions, hover effects, and micro-interactions
- **📱 Responsive**: Mobile-first design with touch-friendly interactions
- **♿ Accessible**: ARIA labels, keyboard navigation, and semantic HTML

## Deployment

The app is ready for deployment on any Node.js hosting platform:

1. **Vercel**: Deploy directly from GitHub
2. **Railway**: Connect repository and deploy
3. **DigitalOcean App Platform**: Deploy with Node.js
4. **Self-hosted**: Run with `npm start`

The SQLite database will be created automatically in the `data/` directory and will persist across deployments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own golf club management needs!
