export const villagesDocs = {
  '/api/villages': {
    get: {
      summary: 'Récupère tous les villages',
      tags: ['Villages'],
      responses: {
        '200': {
          description: 'Liste des villages récupérés avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    countryCodes: {
                      type: 'array',
                      items: { type: 'string' },
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
      summary: 'Crée un nouveau village',
      tags: ['Villages'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                countries: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 2,
                  maxItems: 2,
                  uniqueItems: true,
                },
              },
              required: ['name', 'countries'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Village créé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  countryCodes: {
                    type: 'array',
                    items: { type: 'string' },
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
  '/api/villages/{id}': {
    get: {
      summary: 'Récupère un village par ID',
      tags: ['Villages'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du village',
        },
      ],
      responses: {
        '200': {
          description: 'Village récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  countryCodes: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Village non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: 'Met à jour un village',
      tags: ['Villages'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du village',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                countries: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 2,
                  maxItems: 2,
                  uniqueItems: true,
                  nullable: true,
                },
                activePhase: { type: 'number', nullable: true },
                anthemId: { type: 'number', nullable: true },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Village mis à jour avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  countryCodes: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  activePhase: { type: 'number' },
                  anthemId: { type: 'number' },
                },
              },
            },
          },
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '404': {
          description: 'Village non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    delete: {
      summary: 'Supprime un village par ID',
      tags: ['Villages'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du village à supprimer',
        },
      ],
      responses: {
        '204': {
          description: 'Village supprimé avec succès',
        },
        '404': {
          description: 'Village non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/villages/import/plm': {
    post: {
      summary: 'Importe des villages de ParLeMonde',
      tags: ['Villages'],
      responses: {
        '200': {
          description: 'Villages importés avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  count: { type: 'integer' },
                },
              },
            },
          },
        },
        '500': {
          description: 'Erreur du serveur ou erreur inconnue',
        },
      },
    },
  },
};
