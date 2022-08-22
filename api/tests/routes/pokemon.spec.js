/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { pokemon, types, conn } = require('../../src/db.js');

const agent = session(app);

xdescribe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => conn.sync({ force: true })
  .then(async () => {
    await types.create({id: 1, name: 'normal'});
    const createdPokemon = await pokemon.create({name: 'Alberto'});
    createdPokemon.setTypes('1');
  }));
  after(() => {//Cuando termino los test borro basura que pueda haber quedado y moleste despues en la pagina
    conn.sync({force: true})
  })
  describe('GET /pokemons', () => {

    it('should get 200', (done) => {
      agent.get('/pokemons?offset=0&limit=1')
      .expect(200)
      .end(done);
    });

    it("Shouldn't bring pokemons from the db if 'all' isn't true",  async () => {
      const response = await agent.get('/pokemons?offset=0&limit=1&all=false')//Pido solo 1 de la api
      expect(response._body.length).to.be.eq(1);
    })

    it('Should respect the limit of requested pokemons', async () => {
      const response = await agent.get('/pokemons?offset=0&limit=5&all=false');
      expect(response._body.length).to.be.eq(5);
    })

    it('Should bring pokemons from the db if "all" is true', async () => {
      const response = await agent.get('/pokemons?offset=0&limit=1&all=true');
      expect(response._body[1].name).to.be.eq('Alberto');
    })

    it('Pokemons brought from the db and api should have the same format', async () => {
      const response = await agent.get('/pokemons?offset=0&limit=1&all=true');
      let apiPokemon = response._body[0];
      let dbPokemon = response._body[1];
      let result = true;

      //Verifico que los dos objetos tengan las mismas propiedades
      for(let key in apiPokemon){
        if(!dbPokemon.hasOwnProperty(key)){
          result = false;
          break;
        }
      }
      
      //Si tenian las mismas propiedades
      //Verifico que tambien tengan el mismo numero de keys
      if(result){
        result = Object.keys(apiPokemon).length === Object.keys(dbPokemon).length;
      }

      expect(result).to.be.true;
    })

    it('Should work if some parameters are not send by query', (done) =>{//Si no se le manda el limit anda igual, pero busca 40 pokemons y tarda como 2 segundos
      agent.get('/pokemons?limit=1')
      .expect(200)
      .end(done);
    })
  });
});
