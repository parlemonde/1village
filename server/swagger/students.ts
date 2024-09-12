export const studentsDocs = {
  '/api/students': {
    get: {
      summary: "Récupère la liste des étudiants d'une classe",
      tags: ['Students'],
      parameters: [
        {
          in: 'query',
          name: 'classroomId',
          schema: {
            type: 'integer',
          },
          required: false,
          description: 'ID de la classe',
        },
      ],
      responses: {
        '200': {
          description: 'Liste des étudiants récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    classroom: { type: 'object' },
                  },
                },
              },
            },
          },
        },
        '403': {
          description: 'Accès interdit',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    post: {
      summary: 'Crée un nouvel étudiant',
      tags: ['Students'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                classroomId: { type: 'integer', description: 'ID de la classe' },
                firstname: { type: 'string', description: "Prénom de l'étudiant" },
                lastname: { type: 'string', description: "Nom de l'étudiant" },
              },
              required: ['classroomId', 'firstname', 'lastname'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Étudiant créé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
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
  '/api/students/{id}': {
    get: {
      summary: "Récupère les informations d'un étudiant",
      tags: ['Students'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'étudiant",
        },
      ],
      responses: {
        '200': {
          description: 'Étudiant récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '404': {
          description: 'Étudiant non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: "Met à jour les informations d'un étudiant",
      tags: ['Students'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'étudiant",
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstname: { type: 'string', description: "Prénom de l'étudiant" },
                lastname: { type: 'string', description: "Nom de l'étudiant" },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Étudiant mis à jour avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '400': {
          description: 'Requête invalide',
        },
        '404': {
          description: 'Étudiant non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    delete: {
      summary: 'Supprime un étudiant',
      tags: ['Students'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'étudiant",
        },
      ],
      responses: {
        '204': {
          description: 'Étudiant supprimé avec succès',
        },
        '404': {
          description: 'Étudiant non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/students/link-student': {
    post: {
      summary: 'Lie un étudiant à un parent',
      tags: ['Students'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                hashedCode: { type: 'string', description: "Code d'invitation haché" },
              },
              required: ['hashedCode'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Étudiant lié avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
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
        '404': {
          description: 'Étudiant non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/students/{studentId}/delete-user-link/{userId}': {
    delete: {
      summary: 'Supprime le lien entre un utilisateur et un étudiant',
      tags: ['Students'],
      parameters: [
        {
          in: 'path',
          name: 'studentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'étudiant",
        },
        {
          in: 'path',
          name: 'userId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur",
        },
      ],
      responses: {
        '204': {
          description: 'Lien supprimé avec succès',
        },
        '404': {
          description: 'Étudiant ou utilisateur non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
