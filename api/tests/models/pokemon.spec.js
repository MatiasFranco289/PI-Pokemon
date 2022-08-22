const { pokemon, conn } = require('../../src/db.js');
const { expect } = require('chai');

xdescribe('Pokemon model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  
  after(() => {
    pokemon.sync({force: true});
  })

  describe('Pokemon model', () => {
    beforeEach(() => pokemon.sync({ force: true }));

    describe('Validators', () => {

      it('should throw an error if name is null', async () => {
          const response = await pokemon.create({})
          .then(() => {return new Error('It requires a valid name.')})
          .catch(() => {return 'Exitosamente fallado'});

          expect(response).to.be.eq('Exitosamente fallado');
      });


      it('should work when its a valid name', async () => {
        const name = 'Pikachu';
        const response = await pokemon.create({ name: name,});
        expect(response.dataValues.name).to.be.eq(name);
      });

      it("Shouldn't accept an id", async () => {
        const response = await pokemon.create({id: 1, name: 'jose'})
        .then(() => {return "Succes"})
        .catch(() => {return 'Error'});
        
        expect(response).to.be.eq('Error');
      })

      it('The id should be of type UUID', async () => {
        try{
          const response = await pokemon.create({name: 'pepe'});
          const id = response.dataValues.id;
          const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
          const isUUID = regexExp.test(id);
          expect(isUUID).to.be.true;
        }
        catch(err){
          throw new Error(err.message);
        }
      })
    });

  });
});
