export const teachersDocs = {
  '/api/teachers/invite': {
    get: {
      summary: "Génère un code d'invitation unique pour un enseignant",
      tags: ['Teachers'],
      responses: {
        '200': {
          description: "Code d'invitation généré avec succès",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  inviteCode: { type: 'string', description: "Code d'invitation généré" },
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
  },
  '/api/teachers/set-activity-visibility/{id}': {
    put: {
      summary: "Change la visibilité d'une activité pour un parent",
      tags: ['Teachers'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'activité",
        },
      ],
      responses: {
        '204': {
          description: "Visibilité de l'activité modifiée avec succès",
        },
        '403': {
          description: 'Accès interdit',
        },
        '404': {
          description: 'Activité non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/teachers/detach/{parentId}/{studendId}': {
    delete: {
      summary: "Détache un parent d'un étudiant pour l'enseignant et sa classe",
      tags: ['Teachers'],
      parameters: [
        {
          in: 'path',
          name: 'parentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du parent',
        },
        {
          in: 'path',
          name: 'studendId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'étudiant",
        },
      ],
      responses: {
        '204': {
          description: 'Détachement réussi',
        },
        '404': {
          description: 'Aucun lien parent-étudiant trouvé',
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
};
