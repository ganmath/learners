#!/bin/bash
# Update the system
yum update -y

# Install Docker
amazon-linux-extras enable docker
yum install -y docker
systemctl start docker
systemctl enable docker

# Add ec2-user to the docker group
usermod -aG docker ec2-user

# Install Docker Compose manually
if [ ! -f /usr/local/bin/docker-compose ]; then
  curl -L "https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# Create /directus directory if it doesn't exist
if [ ! -d "/directus" ]; then
  mkdir /directus
fi
cd /directus

# Write docker-compose.yml
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  directus:
    image: directus/directus:latest
    ports:
      - "8055:8055"
    environment:
      DATABASE_CLIENT: mongodb
      DATABASE_HOST: mongodb
      DATABASE_PORT: 27017
      DATABASE_NAME: blogdb
      ADMIN_EMAIL: admin@example.com
      ADMIN_PASSWORD: admin123
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  fastapi:
    build: ./fastapi
    ports:
      - "8000:8000"

volumes:
  mongo-data:
EOF

# Run docker-compose
docker-compose up -d