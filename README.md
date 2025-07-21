# radius-webadmin

With this web ui you can control freeradius and manage users saved inside a MySQL database.

The plan is to add more features over time like web-based configuration of the freeradius config.

**Currently, this project is inside a beta phase.**

## Screenshot

![User-Page](./.github/user.page.jpg)

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