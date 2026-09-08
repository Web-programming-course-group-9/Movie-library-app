import 'dotenv/config'
import { expect } from 'chai'
import { api, resetDb } from './helper/test.js'

const testUser = {
  email: 'testi.kayttaja@example.com',
  password: 'Salasana123',
}

describe('Autentikointi', () => {
  beforeEach(async () => {
    await resetDb()
  })

  describe('POST /api/auth/register', () => {
    it('onnistuu kelvollisilla tiedoilla', async () => {
      const res = await api.post('/auth/register', testUser)
      expect(res.status).to.equal(201)
      expect(res.data).to.have.property('token')
      expect(res.data.user.email).to.equal(testUser.email)
      expect(res.data.user).to.not.have.property('password_hash')
    })

    it('epäonnistuu liian lyhyellä salasanalla', async () => {
      const res = await api.post('/auth/register', {
        email: 'toinen@example.com',
        password: 'lyhyt1',
      })
      expect(res.status).to.equal(400)
    })

    it('epäonnistuu jos salasanassa ei ole isoa kirjainta tai numeroa', async () => {
      const res = await api.post('/auth/register', {
        email: 'toinen@example.com',
        password: 'salasanasalasana',
      })
      expect(res.status).to.equal(400)
    })

    it('epäonnistuu jos sähköposti on jo käytössä', async () => {
      await api.post('/auth/register', testUser)
      const res = await api.post('/auth/register', testUser)
      expect(res.status).to.equal(409)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await api.post('/auth/register', testUser)
    })

    it('onnistuu oikeilla tunnuksilla', async () => {
      const res = await api.post('/auth/login', testUser)
      expect(res.status).to.equal(200)
      expect(res.data).to.have.property('token')
    })

    it('epäonnistuu väärällä salasanalla', async () => {
      const res = await api.post('/auth/login', {
        email: testUser.email,
        password: 'VaaraSalasana1',
      })
      expect(res.status).to.equal(401)
    })

    it('epäonnistuu tuntemattomalla sähköpostilla', async () => {
      const res = await api.post('/auth/login', {
        email: 'ei.olemassa@example.com',
        password: testUser.password,
      })
      expect(res.status).to.equal(401)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('onnistuu kirjautuneena', async () => {
      const registerRes = await api.post('/auth/register', testUser)
      const token = registerRes.data.token

      const res = await api.post(
        '/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      expect(res.status).to.equal(200)
    })

    it('epäonnistuu ilman tokenia', async () => {
      const res = await api.post('/auth/logout')
      expect(res.status).to.equal(401)
    })
  })
})
