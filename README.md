# Fotoon API

API sukurtas „Fotoon“ nuotraukų bendrinimo tinklui.


## Naudojami įrankiai ir bibliotekos
Programavimo kalba:
 - [Node.js 16.0.0](https://nodejs.org/en/about/)
  
Bibliotekų valdymo sistema:
 - [NPM 7.10.0](https://docs.npmjs.com/about-npm)
  
Bibliotekos („child“ bibliotekos nepateiktos šiame sąraše):
 - [bcryptjs 2.4.3](https://www.npmjs.com/package/bcryptjs)
 - [body-parser 1.19.0](https://www.npmjs.com/package/body-parser)
 - [cookie-parser 1.4.6](https://www.npmjs.com/package/cookie-parser)
 - [cors 2.8.5](https://www.npmjs.com/package/cors)
 - [date-and-time 2.0.1](https://www.npmjs.com/package/date-and-time)
 - [dotenv 10.0.0](https://www.npmjs.com/package/dotenv)
 - [express 4.17.1](https://www.npmjs.com/package/express)
 - [jsonwebtoken 8.5.1](https://www.npmjs.com/package/jsonwebtoken)
 - [mongoose 6.0.12](https://www.npmjs.com/package/mongoose)
 - [swagger-jsdoc 6.1.0](https://www.npmjs.com/package/swagger-jsdoc)
 - [swagger-ui-express 4.1.6](https://www.npmjs.com/package/swagger-ui-express)
  
Papildomos bibliotekos:
 - [nodemon 2.0.15](https://www.npmjs.com/package/nodemon)

Atsisiųsti bibliotekoms, šio projekto aplanko direktorijoje per terminalą suveskite `npm install` (būtina turėti NPM bibliotekos valdymo sistemą).

## Environmental Variables
Šis projektas turi turėti `.env` failą savo aplanke, kuris yra reikalingas serverio tipui nustatyti (http/https) - `DEV_MODE`, duomenų bazės prisijungimui - `MONGO_SRV` ir sesijos kurimui ir patvritinimui - `JWT_SECRET`

```bash
  DEV_MODE=<true/false>
  MONGO_SRV=<mongodb connection srv>
  JWT_SECRET=<random string without ambiguous characters>
```
Jei buvo nurodyta, kad `DEV_MODE=false`, tada taip pat turi būti nurodyti šie parametrai:
```bash
  SSL_PRIVATE_KEY=<path to SSL private key>
  SSL_CERTIFICATE=<path to SSL certificate>
  SSL_CHAIN=<path to SSL chain>
```
    
## API Dokumentacija

Dabartinė [dokumentacija](https://api.fotoon.app/docs) (kuri yra pagrindiniame serveryje) prieinama per `api.fotoon.app/docs` interneto puslapį. Jei serveris yra paleistas lokaliai, prie dokumentacijos galima prieiti per [localhost/docs](localhost/docs). Lokalaus serverio dokumentacijos forma yra pati naujausia, tačiau yra šansas, kad ji yra nestabili ir dar niekur nenaudojama (skiriama tik `dev` ir `proto` kodo atšakoms).



## Autoriai

- [@augustinavicius](https://github.com/augustinavicius) | Ignas Augustinavičius
- [@alojine](https://github.com/alojine) | Benjaminas Paliokas
- [@Adomas02](https://github.com/Adomas02) | Adomas Kazėnas


## Papildoma informacija

Sukurta 2021/2022 VU kompiuterių architektūros grupiniam projektui.