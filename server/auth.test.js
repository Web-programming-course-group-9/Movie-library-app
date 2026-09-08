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

  describe('POST /api/users/signup', () => {
    it('onnistuu kelvollisilla tiedoilla', async () => {
      const res = await api.post('/users/signup', { user: testUser })
      expect(res.status).to.equal(201)
      expect(res.data).to.include.all.keys(['id', 'email'])
      expect(res.data.email).to.equal(testUser.email)
      expect(res.data).to.not.have.property('password_hash')
    })

    it('epäonnistuu liian lyhyellä salasanalla', async () => {
      const res = await api.post('/users/signup', {
        user: { email: 'toinen@example.com', password: 'lyhyt1' },
      })
      expect(res.status).to.equal(400)
    })

    it('epäonnistuu jos salasanassa ei ole isoa kirjainta tai numeroa', async () => {
      const res = await api.post('/users/signup', {
        user: { email: 'toinen@example.com', password: 'salasanasalasana' },
      })
      expect(res.status).to.equal(400)
    })

    it('epäonnistuu jos sähköposti on jo käytössä', async () => {
      await api.post('/users/signup', { user: testUser })
      const res = await api.post('/users/signup', { user: testUser })
      expect(res.status).to.equal(409)
    })
  })

  describe('POST /api/users/signin', () => {
    beforeEach(async () => {
      await api.post('/users/signup', { user: testUser })
    })

    it('onnistuu oikeilla tunnuksilla', async () => {
      const res = await api.post('/users/signin', { user: testUser })
      expect(res.status).to.equal(200)
      expect(res.data).to.include.all.keys(['id', 'email', 'token'])
      expect(res.data.email).to.equal(testUser.email)
    })

    it('epäonnistuu väärällä salasanalla', async () => {
      const res = await api.post('/users/signin', {
        user: { email: testUser.email, password: 'VaaraSalasana1' },
      })
      expect(res.status).to.equal(401)
    })

    it('epäonnistuu tuntemattomalla sähköpostilla', async () => {
      const res = await api.post('/users/signin', {
        user: { email: 'ei.olemassa@example.com', password: testUser.password },
      })
      expect(res.status).to.equal(401)
    })
  })

  describe('POST /api/users/logout', () => {
    it('onnistuu kirjautuneena', async () => {
      const signupRes = await api.post('/users/signup', { user: testUser })
      const signinRes = await api.post('/users/signin', { user: testUser })
      const token = signinRes.data.token
      expect(signupRes.status).to.equal(201)

      const res = await api.post(
        '/users/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      expect(res.status).to.equal(200)
    })

    it('epäonnistuu ilman tokenia', async () => {
      const res = await api.post('/users/logout')
      expect(res.status).to.equal(401)
    })
  })
})
