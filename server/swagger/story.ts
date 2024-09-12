export const storyDocs = {
  '/api/stories/all': {
    get: {
      summary: 'Récupère toutes les images des différentes catégories',
      tags: ['Stories'],
      parameters: [
        {
          in: 'query',
          name: 'villageId',
          schema: {
            type: 'integer',
          },
          required: false,
          description: 'ID du village pour filtrer les images',
        },
      ],
      responses: {
        '200': {
          description: 'Liste des images des différentes catégories récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  objects: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        imageUrl: { type: 'string' },
                        imageType: { type: 'string', enum: ['OBJECT', 'PLACE', 'ODD'] },
                        villageId: { type: 'number' },
                      },
                    },
                  },
                  places: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        imageUrl: { type: 'string' },
                        imageType: { type: 'string', enum: ['OBJECT', 'PLACE', 'ODD'] },
                        villageId: { type: 'number' },
                      },
                    },
                  },
                  odds: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        imageUrl: { type: 'string' },
                        imageType: { type: 'string', enum: ['OBJECT', 'PLACE', 'ODD'] },
                        villageId: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Requête invalide',
        },
        '403': {
          description: 'Accès interdit',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/stories/{imageId}': {
    delete: {
      summary: "Supprime une image d'une story",
      tags: ['Stories'],
      parameters: [
        {
          in: 'path',
          name: 'imageId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'image à supprimer",
        },
      ],
      responses: {
        '204': {
          description: "Image supprimée avec succès ou n'existe pas",
        },
        '403': {
          description: 'Accès interdit',
        },
        '500': {
          description: 'Erreur du serveur',
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
