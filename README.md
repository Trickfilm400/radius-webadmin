# radius-webadmin

This web UI should be a collection of useful tools for (free)radius server management. At the moment a user-management
page
is added and a debug page for freeradius servers which helps configure and testing freeradius configs.
The user-management saves users inside a MySQL database.

The plan is to add more features over time like web-based configuration of the freeradius config.

**Note:** For the debug-tool you need the
corresponding [freeradius-debug-utils](https://github.com/Trickfilm400/freeradius-debug-utils) project.

**Currently, this project is inside a beta phase.**

## Screenshot

User-Page:
![User-Page](./.github/user.page.jpg)

Debug-Page:
![Debug: Logs](./.github/debug.processed-logs.jpg)
![Debug: Abstract](./.github/debug.abstract-logs.jpg)

## Usage

Install with docker compose:

```yaml
services:
  panel:
    image: localhost:5000/radius-webadmin
    ports:
      - 3000:3000
    environment:
      - DATABASE_URL=mysql://username:password@mysql-host/radius-database
    # enable log rotation
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
```

### Development

Make sure to install dependencies:

```bash
npm ci
```

#### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

&copy; MIT License 2025 Trickfilm400