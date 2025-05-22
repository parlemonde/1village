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
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_village.sql

echo "Importing user table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_user.sql

echo "Importing classroom table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_classroom.sql

echo "Importing student table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_student.sql

echo "Importing user_to_student table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_user_to_student.sql

echo "Importing phase_history table..."
docker-compose exec -T $DOCKER_MYSQL_SERVICE mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB < $(dirname "$0")/un_village_phase_history.sql

echo "Database import completed successfully!" 