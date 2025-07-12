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
- **Runtime**: Node.js 20.11.0 (LTS)
- **Deployment**: Ready for server deployment with PM2 process management

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

## PM2 Process Management

The project includes convenient scripts for managing the production deployment:

```bash
# Start the app with PM2
npm run pm2:start

# Stop the PM2 process
npm run pm2:stop

# Restart the PM2 process
npm run pm2:restart

# View real-time logs
npm run pm2:logs

# Check process status
npm run pm2:status

# Monitor performance
npm run pm2:monit

# Full deployment (build + restart)
npm run deploy
```

## Node.js Version

This project uses Node.js 20.11.0 (LTS). The `.nvmrc` file ensures consistent Node.js versions across all environments.

```bash
# Use the project's Node.js version
nvm use

# Install the required Node.js version (if not already installed)
nvm install
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

## GitHub Actions: Automated Deployment

This project includes a GitHub Actions workflow for automated deployment to a remote server (e.g., a VPS or cloud droplet).

### How it works
- On every push to the `main` branch, the workflow connects to your server via SSH, pulls the latest code, installs dependencies, runs the setup script, builds the app, and (re)starts the Next.js app using pm2.

### Required Secrets
Set these repository secrets in **Settings > Secrets and variables > Actions**:
- `USER`: SSH username for your server
- `HOST`: Hostname or IP address of your server
- `APP_PATH`: Absolute path to your app directory on the server (e.g., `/home/youruser/random-club-challenge`)
- `SSH_PRIVATE_KEY`: Private SSH key with access to the server

### How to use
1. Set up your server with Node.js 20.11.0, pm2, and SSH access.
2. Add the required secrets to your GitHub repository.
3. Push to the `main` branch to trigger deployment.

The workflow will automatically:
- Use the correct Node.js version (via `.nvmrc`)
- Install dependencies and run setup
- Build the application
- Deploy using the new `npm run deploy` script

The app will run as a PM2 process named `random-club-app`.

> **Tip:** You can customize the workflow in `.github/workflows/deploy.yml` for your environment or process manager.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own golf club management needs!
