export const classroomDocs = {
  '/api/classrooms': {
    get: {
      summary: 'Récupère toutes les classes',
      tags: ['Classroom'],
      responses: {
        '200': {
          description: 'Liste de toutes les classes récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    avatar: { type: 'string' },
                    delayedDays: { type: 'number' },
                    countryCode: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        type: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Aucune classe trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    post: {
      summary: 'Crée une nouvelle classe pour un enseignant',
      tags: ['Classroom'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'integer' },
                villageId: { type: 'integer' },
                name: { type: 'string' },
                avatar: { type: 'string' },
                countryCode: { type: 'string' },
                delayedDays: { type: 'number' },
              },
              required: ['userId', 'villageId'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Classe créée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  avatar: { type: 'string' },
                  delayedDays: { type: 'number' },
                  countryCode: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        '303': {
          description: 'Classe déjà existante',
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
  '/api/classrooms/{id}': {
    get: {
      summary: "Récupère les paramètres de la classe d'un enseignant",
      tags: ['Classroom'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la classe',
        },
      ],
      responses: {
        '200': {
          description: 'Détails de la classe récupérés avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  avatar: { type: 'string' },
                  delayedDays: { type: 'number' },
                  countryCode: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      type: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Classe non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: "Met à jour les paramètres d'une classe pour un enseignant",
      tags: ['Classroom'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la classe',
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
                avatar: { type: 'string' },
                delayedDays: { type: 'number' },
                hasVisibilitySetToClass: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Classe mise à jour avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  avatar: { type: 'string' },
                  delayedDays: { type: 'number' },
                  hasVisibilitySetToClass: { type: 'boolean' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Classe non trouvée',
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    delete: {
      summary: 'Supprime une classe pour un enseignant',
      tags: ['Classroom'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID de la classe à supprimer',
        },
      ],
      responses: {
        '204': {
          description: 'Classe supprimée avec succès',
        },
        '404': {
          description: 'Classe non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
