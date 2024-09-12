export const imagesDocs = {
  '/api/images/{id}/{filename}': {
    get: {
      summary: 'Récupère un fichier image',
      tags: ['Images'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur associé au fichier image",
        },
        {
          in: 'path',
          name: 'filename',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Nom du fichier image à récupérer',
        },
      ],
      responses: {
        '200': {
          description: 'Fichier image récupéré avec succès',
        },
        '404': {
          description: 'Fichier image non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
      security: [
        {
          ObservatorAuth: [],
        },
      ],
    },
    delete: {
      summary: 'Supprime un fichier image',
      tags: ['Images'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur associé au fichier image",
        },
        {
          in: 'path',
          name: 'filename',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Nom du fichier image à supprimer',
        },
      ],
      responses: {
        '204': {
          description: 'Fichier image supprimé avec succès',
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
  '/api/images': {
    post: {
      summary: 'Télécharge un nouveau fichier image',
      tags: ['Images'],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'binary',
                },
              },
              required: ['image'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Fichier image téléchargé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    description: 'URL du fichier image téléchargé',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Fichier image manquant ou invalide',
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
