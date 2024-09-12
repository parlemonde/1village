export const weatherDocs = {
  '/api/weather': {
    get: {
      summary: 'Récupère les informations météorologiques pour une position donnée',
      tags: ['Weather'],
      parameters: [
        {
          in: 'query',
          name: 'latitude',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Latitude de la position',
        },
        {
          in: 'query',
          name: 'longitude',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Longitude de la position',
        },
      ],
      responses: {
        '200': {
          description: 'Informations météorologiques récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  timezone: { type: 'number', description: 'Fuseau horaire de la position' },
                  temperature: { type: 'number', description: 'Température actuelle en degrés Celsius' },
                  iconUrl: { type: 'string', description: "URL de l'icône météorologique" },
                },
              },
            },
          },
        },
        '400': {
          description: 'Longitude ou latitude invalide',
        },
        '500': {
          description: 'Erreur lors de la récupération des données météorologiques',
        },
      },
      security: [
        {
          TeacherAuth: [],
        },
      ],
    },
  },
};
