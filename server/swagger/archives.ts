export const archivesDocs = {
  '/archives/*': {
    get: {
      summary: 'Récupère un fichier archivé',
      tags: ['Archives'],
      parameters: [
        {
          in: 'path',
          name: '*',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Chemin du fichier archivé à récupérer',
        },
      ],
      responses: {
        '200': {
          description: 'Fichier archivé récupéré avec succès',
        },
        '404': {
          description: 'Fichier non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
      security: [
        {
          AdminAuth: [],
        },
      ],
    },
  },
  '/api/archives': {
    get: {
      summary: "Liste les dossiers archivés à partir d'un préfixe S3 spécifié",
      tags: ['Archives'],
      responses: {
        '200': {
          description: 'Liste des dossiers archivés récupérés avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
        '500': {
          description: 'Erreur du serveur lors de la récupération des dossiers archivés',
        },
      },
      security: [
        {
          ObservatorAuth: [],
        },
      ],
    },
  },
};
