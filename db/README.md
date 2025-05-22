# Database Setup and Data Import Guide

This guide explains how to set up the local database environment and import data for the 1Village application. It's designed to help new developers understand the database structure and the process of importing data.

## Database Structure Overview

The 1Village application uses a MySQL database with the following main tables:

1. **village** - Contains information about villages, which are the main organizational units
2. **user** - Stores user account information
3. **classroom** - Contains classroom information, linked to villages and users
4. **student** - Stores student information, linked to classrooms
5. **user_to_student** - Junction table linking users to students
6. **phase_history** - Tracks the history of phase changes for villages

## Table Dependencies

Understanding the dependencies between tables is crucial for proper data import:

```
village <-- classroom <-- student <-- user_to_student --> user
village <-- phase_history
```

## Local Database Setup

The application uses Docker for local development. The database service is defined in `docker-compose.yml` as a MySQL 8 container.

### Prerequisites

- Docker and Docker Compose installed on your system
- SQL dump files (provided in the `db` directory)

### Starting the Database

1. Start the MySQL container:

   ```bash
   docker-compose up -d mysql
   ```

2. Wait for the MySQL service to be healthy:
   ```bash
   docker-compose ps mysql
   ```
   Look for "healthy" status in the output.

## Importing Data

We provide a script (`import-db.sh`) that handles the import process in the correct order to respect table dependencies.

### Using the Import Script

1. Make the script executable:

   ```bash
   chmod +x db/import-db.sh
   ```

2. Run the script:
   ```bash
   ./db/import-db.sh
   ```

### Understanding the Import Script

The script performs the following operations:

```bash
#!/bin/bash
# Define MySQL connection parameters
MYSQL_USER="root"
MYSQL_PASSWORD="my-secret-pw"
MYSQL_DB="village"
# Docker service name (from docker-compose)
DOCKER_MYSQL_SERVICE="mysql"

# Print status message
echo "Starting database import in correct order..."

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
docker-compose exec $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DB;"

# Import files in correct order based on dependencies
echo "Importing village table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_village.sql

echo "Importing user table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_user.sql

echo "Importing classroom table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_classroom.sql

echo "Importing student table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_student.sql

echo "Importing user_to_student table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_user_to_student.sql

echo "Importing phase_history table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < un_village_phase_history.sql

echo "Database import completed successfully!"
```

### Import Order Explanation

The import order is critical due to foreign key constraints:

1. **village** - Imported first as it has no dependencies
2. **user** - Imported second as it has no dependencies on other tables
3. **classroom** - Depends on village and user tables
4. **student** - Depends on classroom table
5. **user_to_student** - Depends on both user and student tables
6. **phase_history** - Depends on village table

## Table Details

### village Table

The village table stores information about villages, which are the main organizational units in the application.

- Primary key: `id`
- Notable fields:
  - `name`: Village name
  - `countryCodes`: Countries participating in the village
  - `activePhase`: Current phase of the village

### user Table

Stores user account information.

- Primary key: `id`

### classroom Table

Contains classroom information.

- Primary key: `id`
- Foreign keys:
  - `villageId`: References village(id)
  - `userId`: References user(id)

### student Table

Stores student information.

- Primary key: `id`
- Foreign key:
  - `classroomId`: References classroom(id)
- Notable fields:
  - `firstname`, `lastname`: Student name
  - `hashedCode`: Used for student authentication

### user_to_student Table

Junction table linking users to students.

- Primary key: `id`
- Foreign keys:
  - `userId`: References user(id)
  - `studentId`: References student(id)

### phase_history Table

Tracks the history of phase changes for villages.

- Primary key: `id`
- Foreign key:
  - `villageId`: References village(id)

## Troubleshooting

### Common Issues

1. **Import Fails Due to Foreign Key Constraints**:

   - Ensure you're importing tables in the correct order
   - Check if the referenced records exist in the parent tables

2. **Access Denied Errors**:

   - Verify MySQL username and password in the script
   - Check if the user has sufficient privileges

3. **File Not Found Errors**:
   - Ensure you're running the script from the correct directory
   - Check if the SQL dump files are in the expected location

### Checking Database Status

You can connect to the MySQL container to verify the import:

```bash
docker-compose exec mysql mysql -uroot -pmy-secret-pw village
```

Then run SQL queries to check the data:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM village;
SELECT COUNT(*) FROM classroom;
-- etc.
```

## Resetting the Database

If you need to reset the database and start fresh:

```bash
# Drop and recreate the database
docker-compose exec mysql mysql -uroot -pmy-secret-pw -e "DROP DATABASE IF EXISTS village; CREATE DATABASE village;"

# Re-run the import script
./db/import-db.sh
```

## Additional Resources

For more information about the database schema and application architecture, refer to the project documentation.
