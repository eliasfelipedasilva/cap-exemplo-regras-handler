'use strict'

const { randomUUID } = require('crypto')
const cds = require('@sap/cds')

// Use in-memory SQLite so each test run starts clean
cds.env.requires.db = { kind: 'sqlite', credentials: { url: ':memory:' } }

describe('UserService Tests', () => {
    const { GET, POST, expect } = cds.test(__dirname + '/..')

    const BASE = '/odata/v4/user'

    // ---- GET /user -------------------------------------------------------
    it('should list users', async () => {
        const { data, status } = await GET(`${BASE}/user`)
        expect(status).to.equal(200)
        expect(data.value).to.be.an('array')
    })

    // ---- POST /user – aplicação de regras de negócio ---------------------
    it('should apply business rules on CREATE – Brasil', async () => {
        const { data, status } = await POST(`${BASE}/user`, {
            id: randomUUID(),
            nome: 'Maria Silva',
            pais: 'Brasil',
            salario: 4000
        })
        expect(status).to.be.oneOf([200, 201])
        // Idioma deve ser definido como PT para Brasil
        expect(data.idioma).to.equal('PT')
        // Salário 4000 ≥ 3000 → imposto 20%
        expect(data.imposto).to.equal('20%')
    })

    it('should apply business rules on CREATE – USA', async () => {
        const { data, status } = await POST(`${BASE}/user`, {
            id: randomUUID(),
            nome: 'John Doe',
            pais: 'USA',
            salario: 2500
        })
        expect(status).to.be.oneOf([200, 201])
        // Idioma deve ser definido como EN para USA
        expect(data.idioma).to.equal('EN')
        // Salário 2500 < 3000 → imposto 0%
        expect(data.imposto).to.equal('0%')
    })

    it('should apply business rules on CREATE – high salary', async () => {
        const { data, status } = await POST(`${BASE}/user`, {
            id: randomUUID(),
            nome: 'Carlos Oliveira',
            pais: 'Brasil',
            salario: 6000
        })
        expect(status).to.be.oneOf([200, 201])
        expect(data.idioma).to.equal('PT')
        // Salário 6000 ≥ 5000 → imposto 207%
        expect(data.imposto).to.equal('207%')
    })

    // ---- Action: retornaNomeUsrDia ----------------------------------------
    it('should return user id with date via action retornaNomeUsrDia', async () => {
        const id = randomUUID()

        // Cria o usuário antes de chamar a action
        await POST(`${BASE}/user`, {
            id,
            nome: 'Ana Costa',
            pais: 'Brasil',
            salario: 3500
        })

        const { data, status } = await POST(`${BASE}/retornaNomeUsrDia`, { id })
        expect(status).to.equal(200)
        // O retorno deve conter o id do usuário
        expect(data.value).to.include(id)
    })
})
