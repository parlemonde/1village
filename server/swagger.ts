// swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { authenticationDocs } from './swagger/authentification';
import { activitiesDocs } from './swagger/activities';
import { analyticsDocs } from './swagger/analytics';
import { archivesDocs } from './swagger/archives';
import { audiosDocs } from './swagger/audios';
import { classroomDocs } from './swagger/classroom';
import { mediathequeDocs } from './swagger/mediatheque';
import { statisticsDocs } from './swagger/statistics';
import { usersDocs } from './swagger/users';
import { villagesDocs } from './swagger/villages';
import { commentDocs } from './swagger/comment';
import { countriesDocs } from './swagger/countries';
import { currenciesDocs } from './swagger/currencies';
import { featureFlagDocs } from './swagger/featureFlag';
import { gamesDocs } from './swagger/games';
import { imagesDocs } from './swagger/images';
import { languagesDocs } from './swagger/languages';
import { pelicoPresentationDocs } from './swagger/pelicoPresentation';
import { storyDocs } from './swagger/story';
import { studentsDocs } from './swagger/students';
import { teachersDocs } from './swagger/teachers';
import { teamCommentDocs } from './swagger/teamComment';
import { weatherDocs } from './swagger/weather';
import { xApiDocs } from './swagger/xApi';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: "Documentation de l'API 1village",
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Serveur de développement',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // JWT ou tout autre format que vous utilisez
      },
    },
  },
  security: [
    {
      bearerAuth: [], // Applique l'autorisation par défaut à toutes les routes
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: `API pour l'authentification des utilisateurs`,
    },
    {
      name: 'Activities',
      description: 'API pour la gestion des activités',
    },
    {
      name: 'Analytics',
      description: 'API pour la gestion des analyses de données',
    },
    {
      name: 'Archives',
      description: 'API pour la gestion des archives',
    },
    {
      name: 'Audios',
      description: 'API pour la gestion des fichiers audio',
    },
    {
      name: 'Classroom',
      description: 'API pour la gestion des classes',
    },
    {
      name: 'Comments',
      description: 'API pour la gestion des commentaires',
    },
    {
      name: 'Countries',
      description: 'API pour la gestion des pays',
    },
    {
      name: 'Currencies',
      description: 'API pour la gestion des devises',
    },
    {
      name: 'Feature Flags',
      description: 'API pour la gestion des feature flags',
    },
    {
      name: 'Games',
      description: 'API pour la gestion des jeux',
    },
    {
      name: 'Images',
      description: `API pour la gestion des fichiers d'images`,
    },
    {
      name: 'Languages',
      description: 'API pour la gestion des langues',
    },
    {
      name: 'Mediatheque',
      description: 'API pour la gestion de la médiathèque',
    },
    {
      name: 'Pelico Presentation',
      description: 'API pour la gestion des présentations Pelico',
    },
    {
      name: 'Statistics',
      description: 'API pour les statistiques',
    },
    {
      name: 'Stories',
      description: 'API pour la gestion des images de stories',
    },
    {
      name: 'Students',
      description: 'API pour la gestion des étudiants',
    },
    {
      name: 'Students',
      description: 'API pour la gestion des étudiants',
    },
    {
      name: 'Teachers',
      description: 'API pour la gestion des enseignants',
    },
    {
      name: 'TeamComments',
      description: 'API pour la gestion des commentaires des équipes',
    },
    {
      name: 'Users',
      description: 'API pour la gestion des utilisateurs',
    },
    {
      name: 'Villages',
      description: 'API pour la gestion des villages',
    },
    {
      name: 'Weather',
      description: 'API pour récupérer les informations météorologiques',
    },
    {
      name: 'xAPI',
      description: 'API pour envoyer des déclarations xAPI à un serveur distant',
    },
  ],
  paths: {
    ...authenticationDocs,
    ...activitiesDocs,
    ...analyticsDocs,
    ...archivesDocs,
    ...audiosDocs,
    ...classroomDocs,
    ...commentDocs,
    ...countriesDocs,
    ...currenciesDocs,
    ...featureFlagDocs,
    ...gamesDocs,
    ...imagesDocs,
    ...languagesDocs,
    ...mediathequeDocs,
    ...pelicoPresentationDocs,
    ...statisticsDocs,
    ...storyDocs,
    ...studentsDocs,
    ...teachersDocs,
    ...teamCommentDocs,
    ...usersDocs,
    ...villagesDocs,
    ...weatherDocs,
    ...xApiDocs,
  },
};

const options = {
  swaggerDefinition,
  apis: [], // Chemins où Swagger cherche les commentaires/documentation
};

// Swagger JSDoc Spécification
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
