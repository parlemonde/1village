// swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Définition de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentation de l\'API pour votre projet',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Remplacez par l'URL de votre serveur
      description: 'Serveur de développement',
    },
  ],
};

// Options pour Swagger JSDoc
const options = {
  swaggerDefinition,
  apis: ['./server/**/*.ts'], // Chemins où Swagger cherche les commentaires/documentation
};

// Swagger JSDoc Spécification
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
