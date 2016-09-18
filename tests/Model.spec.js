import Model from '../package/Model';

describe('Model', () => {

  class Person extends Model {
    get name() {
      return `${this.firstName} ${this.lastName}`;
    }

    isMe(context) {
      return this._id === context.userId;
    }
  }

  class Author extends Person {
    get name() {
      return `${this.lastName}, ${this.firstName}`;
    }
  }

  describe('basics', () => {
    it('has accessors/getters to the original fields', () => {
      const individual = new Author({
        firstName: 'George',
        lastName: 'Orwell',
      });

      expect(individual.firstName).to.equal('George');
      expect(individual.lastName).to.equal('Orwell');
    });

    it('has support for defined getters', () => {
      const reader = new Author({
        firstName: 'Joe',
        lastName: 'Doe',
      });

      const writer = new Author({
        firstName: 'George',
        lastName: 'Orwell',
      });

      expect(reader.name).to.equal('Joe Doe');
      expect(writer.name).to.equal('Orwell, George');
    });

    it('has methods dependent on context', () => {
      const individual = new Author({
        _id: 1,
      });

      // TODO! requires context to become {} if undefined
      expect(individual.isMe()).to.equal(false);
      expect(individual.isMe({ userId: 1 })).to.equal(true);
      expect(individual.isMe({ userId: 2 })).to.equal(false);
    });
  });

});
