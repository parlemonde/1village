export const authenticationDocs = {
    '/token': {
      post: {
        summary: 'Rafraîchit le jeton d\'accès',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  grant_type: {
                    type: 'string',
                    example: 'refresh_token',
                  },
                  refresh_token: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Nouveau jeton d\'accès généré',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: {
                      type: 'string',
                    },
                    token_type: {
                      type: 'string',
                    },
                    expires_in: {
                      type: 'integer',
                    },
                    refresh_token: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Requête invalide',
          },
          '401': {
            description: 'Authentification échouée',
          },
        },
      },
    },
    '/login': {
      post: {
        summary: 'Connecte un utilisateur',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'PLMO1_admin',
                  },
                  password: {
                    type: 'string',
                    example: 'Admin1234',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Utilisateur connecté avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Identifiants invalides',
          },
          '500': {
            description: 'Erreur du serveur',
          },
        },
      },
    },
    '/login-sso-plm': {
      post: {
        summary: 'Connecte un utilisateur via SSO PLM',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ssoToken: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Utilisateur connecté avec succès via SSO PLM',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token SSO invalide',
          },
          '500': {
            description: 'Erreur du serveur',
          },
        },
      },
    },
    '/logout': {
      post: {
        summary: 'Déconnecte un utilisateur',
        tags: ['Authentication'],
        responses: {
          '200': {
            description: 'Utilisateur déconnecté avec succès',
          },
          '500': {
            description: 'Erreur du serveur',
          },
        },
      },
    },
}