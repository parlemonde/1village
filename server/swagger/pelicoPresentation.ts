export const pelicoPresentationDocs = {
  '/api/pelico-presentation': {
    get: {
      summary: 'Récupère toutes les présentations Pelico',
      tags: ['Pelico Presentation'],
      responses: {
        '200': {
          description: 'Liste des présentations Pelico récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    content: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                          value: { type: 'string' },
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
    post: {
      summary: 'Crée une nouvelle présentation Pelico',
      tags: ['Pelico Presentation'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                content: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                      value: { type: 'string' },
                    },
                    required: ['type', 'value'],
                  },
                },
              },
              required: ['content'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Présentation Pelico créée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  content: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/pelico-presentation/{id}': {
    get: {
      summary: 'Récupère une présentation Pelico par ID',
      tags: ['Pelico Presentation'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la présentation Pelico',
        },
      ],
      responses: {
        '200': {
          description: 'Présentation Pelico récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  content: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Présentation Pelico non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: 'Met à jour une présentation Pelico par ID',
      tags: ['Pelico Presentation'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la présentation Pelico à mettre à jour',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                content: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                      value: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Présentation Pelico mise à jour avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  content: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        type: { type: 'string', enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '404': {
          description: 'Présentation Pelico non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    delete: {
      summary: 'Supprime une présentation Pelico par ID',
      tags: ['Pelico Presentation'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la présentation Pelico à supprimer',
        },
      ],
      responses: {
        '204': {
          description: 'Présentation Pelico supprimée avec succès',
        },
        '404': {
          description: 'Présentation Pelico non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
