export const statisticsDocs = {
  '/api/statistics/sessions/{phase}': {
    get: {
      summary: 'Récupère les statistiques des sessions pour une phase spécifique',
      tags: ['Statistics'],
      parameters: [
        {
          in: 'path',
          name: 'phase',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'Phase pour laquelle récupérer les statistiques',
        },
      ],
      responses: {
        '200': {
          description: 'Statistiques des sessions pour la phase spécifiée',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  minDuration: {
                    type: 'number',
                  },
                  maxDuration: {
                    type: 'number',
                  },
                  averageDuration: {
                    type: 'number',
                  },
                  medianDuration: {
                    type: 'number',
                  },
                  minConnections: {
                    type: 'number',
                  },
                  maxConnections: {
                    type: 'number',
                  },
                  averageConnections: {
                    type: 'number',
                  },
                  medianConnections: {
                    type: 'number',
                  },
                  registeredClassroomsCount: {
                    type: 'number',
                  },
                  connectedClassroomsCount: {
                    type: 'number',
                  },
                  contributedClassroomsCount: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Paramètre de phase invalide',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/statistics/classrooms': {
    get: {
      summary: 'Récupère les informations des salles de classe',
      tags: ['Statistics'],
      responses: {
        '200': {
          description: 'Informations sur les salles de classe',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  classrooms: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        name: {
                          type: 'string',
                        },
                        village: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'integer',
                            },
                            name: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
