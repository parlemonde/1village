# 1Village

![Build](https://github.com/parlemonde/1village/workflows/Build/badge.svg) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

- Server: NodeJS
- Client: NextJS

## Installation

Use docker to run the app:

```bash
docker-compose up
```

## Database Setup

For new developers, we provide comprehensive documentation on setting up and importing data into the database:

- [Database Setup and Import Guide](./db/README.md)
- [Database Structure Diagram](./db/database-diagram.md)

To import sample data into your local database:

```bash
chmod +x db/import-db.sh
./db/import-db.sh
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

**[Checkout the wiki here!](https://github.com/parlemonde/1village/wiki)**

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
