# Elokuvasovellus — Web-ohjelmoinnin sovellusprojekti

OAMK, Informaatioteknologia, syksy 2026. Ryhmäprojekti.

## Mikä tämä on

Web-sivusto leffaharrastajille. Data haetaan The Movie Database (TMDB) -rajapinnasta,
joka vaatii rekisteröitymisen ja API-avaimen/tokenin.

## Tekniikat

- Frontend: React (Vite), react-router-dom, axios
- Backend: Node.js + Express, ES-modulit (`"type": "module"`)
- Tietokanta: PostgreSQL, `pg`-kirjasto (Pool)
- Autentikointi: JWT (jsonwebtoken) + bcrypt
- Testaus: Mocha + Chai, REST-rajapinnan testit
- Ympäristömuuttujat: dotenv (backend), `VITE_`-alkuiset (frontend)
- cross-env NODE_ENV-asetuksiin (Windows-yhteensopivuus)

## Kansiorakenne

Backend noudattaa MVC-rakennetta alusta asti (kurssin todo-harjoituksen osa 8):

```
/                  React-projektin juuri, .env (VITE_API_URL)
  src/
    components/    ProtectedRoute.jsx, Row.jsx, ...
    context/       UserContext.js, UserProvider.jsx, useUser.js
    screens/       Authentication.jsx, NotFound.jsx, ...
    App.jsx  main.jsx
  server/
    index.js       Express-konfiguraatio, routerien mounttaus, virhemiddleware
    db.sql         Skeema + alkudata, ajetaan testien alussa
    .env           EI versionhallintaan
    helper/        db.js (pool), auth.js (JWT-middleware), test.js, ApiError
    models/        SQL-kyselyt
    controllers/   Validointi, statuskoodit, logiikka
    routes/        Reitit -> controller
```

## Konventiot

- Reitit ohjaavat pyynnön controllerille; controller kutsuu modelia. Ei SQL:ää routerissa.
- Virheet välitetään `next(error)`-kutsulla keskitetylle middlewarelle index.js:ssä.
- Käytä `ApiError`-luokkaa (`helper/ApiError.js`): `next(new ApiError('viesti', 400))`.
- Kaikki SQL parametrisoituna (`$1`, `$2`) — ei merkkijonokonkatenaatiota.
- Salasanat aina bcryptillä hashattuna. Hashia ei koskaan palauteta vastauksessa.
- Suojatut reitit: `router.post('/', auth, controllerFn)`.
- Sähköposti normalisoidaan: `.trim().toLowerCase()`.
- Testit käyttävät erillistä `test_movieapp`-tietokantaa ja ajavat `db.sql`:n
  `before`-hookissa, jotta jokainen ajo alkaa tunnetusta tilasta.

## Skriptit (server/package.json)

```json
"dev":        "cross-env NODE_ENV=development nodemon index.js"
"start:test": "cross-env NODE_ENV=test node index.js"
"test":       "cross-env NODE_ENV=test mocha *.test.js"
```

Testit ajetaan niin, että palvelin on käynnissä test-moodissa toisessa terminaalissa.

## Toteutettavat ominaisuudet (20 p.)

| ID | Ominaisuus | P. | Tila |
|----|-----------|----|----|
| 1 | Responsiivisuus | 2 | ei aloitettu |
| 2 | Rekisteröityminen (sähköposti + salasana, min. 8 merkkiä, iso kirjain ja numero) | 1 | ei aloitettu |
| 3 | Kirjautuminen ja uloskirjautuminen | 1 | ei aloitettu |
| 4 | Tilin poisto (poistaa myös 11, 13, 14) | 1 | ei aloitettu |
| 5 | Haku, väh. 3 eri kriteeriä, ei vaadi kirjautumista | 2 | ei aloitettu |
| 6 | Nyt elokuvateattereissa (Suomi) | 1 | ei aloitettu |
| 7 | Ryhmäsivu, listaus julkinen, sisältö vain jäsenille, omistaja voi poistaa | 2 | ei aloitettu |
| 8 | Liittymispyyntö, omistaja hyväksyy/hylkää | 1 | ei aloitettu |
| 9 | Jäsenen poisto tai itse poistuminen | 1 | ei aloitettu |
| 10 | Ryhmäsivun kustomointi (elokuvan lisäys) | 2 | ei aloitettu |
| 11 | Elokuvan arvostelu (teksti + tähdet 1–5, käyttäjänimi, ajankohta) | 2 | ei aloitettu |
| 12 | Arvostelujen selaaminen (kaikille) | 1 | ei aloitettu |
| 13 | Suosikkilista omana sivunaan | 1 | ei aloitettu |
| 14 | Suosikkilistan jako URL-osoitteena | 1 | ei aloitettu |
| 15 | Vapaavalintainen ominaisuus | 1 | ei aloitettu |

## Testattavat rajapinnat (5 p.)

Sekä positiiviset että negatiiviset testit:
kirjautuminen, uloskirjautuminen, rekisteröityminen, rekisteröitymisen poistaminen,
arvostelujen selaaminen.

## Dokumentointi (20 p.)

Luokkakaavio tietokannasta (2), käyttöliittymäsuunnitelma (2), REST-dokumentaatio (2),
kehitysjonon hallinta (2), versionhallinta (2), projektin hallinta (10).

## Tila

- GitHub-repo luotu
- Scrum aloitettu, projektikaaviot tehty
- Backendin alustus meneillään

## Muistettavaa

- `/server/.env` ja `/server/node_modules` .gitignoreen. TMDB-avainta ei repoon.
- Postgresin portti: Windows yleensä 5432, Mac 5435.
