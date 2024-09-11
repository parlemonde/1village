import type { RequestHandler } from 'express';
import { Router } from 'express';
import morgan from 'morgan';

import { handleErrors } from '../middlewares/handleErrors';
import { jsonify } from '../middlewares/jsonify';
import { login } from './login';
import { logout } from './logout';
import { loginWithPlmSSO } from './plm_sso';
import { refreshToken } from './refreshToken';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API pour l'authentification des utilisateurs
 */

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Rafraîchit le jeton d'accès
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: refresh_token
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nouveau jeton d'accès généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 expires_in:
 *                   type: integer
 *                 refresh_token:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Authentification échouée
 */
authRouter.post('/token', morgan('dev') as RequestHandler, jsonify, handleErrors(refreshToken));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur du serveur
 */
authRouter.post('/login', morgan('dev') as RequestHandler, jsonify, handleErrors(login));

/**
 * @swagger
 * /login-sso-plm:
 *   post:
 *     summary: Connecte un utilisateur via SSO PLM
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ssoToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès via SSO PLM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Token SSO invalide
 *       500:
 *         description: Erreur du serveur
 */
authRouter.post('/login-sso-plm', morgan('dev') as RequestHandler, jsonify, handleErrors(loginWithPlmSSO));

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Déconnecte un utilisateur
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Utilisateur déconnecté avec succès
 *       500:
 *         description: Erreur du serveur
 */
authRouter.post('/logout', morgan('dev') as RequestHandler, jsonify, handleErrors(logout));

export { authRouter };
