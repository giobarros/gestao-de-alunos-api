import { expect } from 'chai';
import { api } from './helpers/api.js';
import { comTokenAdmin, comTokenAluno } from './helpers/auth.js';
import testesDeMatricula from './fixture/alunos.json' with { type: 'json' };

describe('Validação do fluxo de cadastro e registro de trabalho do aluno', () => {

    let alunoId;
    let disciplinaId;

    afterEach(async () => {

        if (alunoId) {
            await api()
                .delete(`/api/admin/alunos/${alunoId}`)
                .set('Authorization', await comTokenAdmin());
        }

        if (disciplinaId) {
            await api()
                .delete(`/api/admin/disciplinas/${disciplinaId}`)
                .set('Authorization', await comTokenAdmin());
        }
    });

    testesDeMatricula.forEach(testeMatricula => {

        it(testeMatricula.testTitle, async () => {

            const cadastroAluno = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenAdmin())
                .send(testeMatricula.dadosAlunos);

            expect(cadastroAluno.status).to.equal(201);
            expect(cadastroAluno.body).to.have.property('id');

            alunoId = cadastroAluno.body.id;

            const cadastroDisciplina = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenAdmin())
                .send(testeMatricula.dadosDisciplinas);

            expect(cadastroDisciplina.status).to.equal(201);
            expect(cadastroDisciplina.body).to.have.property('id');

            disciplinaId = cadastroDisciplina.body.id;

            const cadastroMatricula = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenAdmin())
                .send({
                    alunoId: alunoId
                });

            expect(cadastroMatricula.status).to.equal(201);

            const tokenAluno = await comTokenAluno(
                testeMatricula.dadosAlunos.email,
                testeMatricula.dadosAlunos.senha
            );

            const registraTrabalho = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAluno)
                .send({
                    disciplinaId: disciplinaId,
                    titulo: testeMatricula.dadosTrabalho.titulo,
                    descricao: testeMatricula.dadosTrabalho.descricao
                });

            expect(registraTrabalho.status).to.equal(testeMatricula.statusCodeEsperado);
            expect(registraTrabalho.body).to.have.property('id');
            expect(registraTrabalho.body.alunoId).to.equal(alunoId);
            expect(registraTrabalho.body.disciplinaId).to.equal(disciplinaId);
            expect(registraTrabalho.body.titulo).to.equal(testeMatricula.dadosTrabalho.titulo)
            expect(registraTrabalho.body.descricao).to.equal(testeMatricula.dadosTrabalho.descricao);
        });
    });
});