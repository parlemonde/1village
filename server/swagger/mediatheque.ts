export const mediathequeDocs = {
  '/api/mediatheque': {
    get: {
      summary: 'Récupère toutes les activités de la médiathèque',
      tags: ['Mediatheque'],
      responses: {
        '200': {
          description: 'Liste des activités récupérées',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      description: "ID de l'activité",
                    },
                    status: {
                      type: 'integer',
                      description: "Statut de l'activité",
                    },
                    user: {
                      type: 'object',
                      properties: {
                        school: {
                          type: 'string',
                          description: "Nom de l'école de l'utilisateur",
                        },
                        type: {
                          type: 'integer',
                          description: "Type de l'utilisateur",
                        },
                        countryCode: {
                          type: 'string',
                          description: "Code du pays de l'utilisateur",
                        },
                      },
                    },
                    village: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Nom du village',
                        },
                        countryCodes: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description: 'Liste des codes des pays du village',
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    description: "Message d'erreur",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
