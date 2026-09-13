import request from 'supertest';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function comTokenAdmin() {
    const loginResposta = await request(BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            email: process.env.ADMIN_EMAIL,
            senha: process.env.ADMIN_PASSWORD
        });

    return `Bearer ${loginResposta.body.token}`;
}

export async function comTokenAluno(email, senha) {
    const loginResposta = await request(BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            email: email,
            senha: senha
        });

    return `Bearer ${loginResposta.body.token}`;
}