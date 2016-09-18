import Model from '../package/Model';
import allow from '../package/allow';

describe('Authorization', () => {

  class Person extends Model {
    isMe(context) {
      return this._id === context.userId;
    }
  }

  allow(Person, {
    create() {
      return false;
    },
    read() {
      return false;
    },
  })

  class Author extends Person {
    get name() {
      return `${this.firstName} ${this.lastName}`;
    }
  }

  allow(Author, {
    read() {
      return true;
    },
  })

  describe('allow', () => {
    describe('inheritance', () => {
      it('inherits CRUD rules', () => {
        const john = new Person();
        const joe = new Author();

        expect(Person.allow.create()).to.equal(false);
        expect(Person.allow.read()).to.equal(false);
        expect(Person.allow.update()).to.equal(true);
        expect(Person.allow.delete()).to.equal(true);

        expect(Author.allow.create()).to.equal(false);
        expect(Author.allow.read()).to.equal(true);
        expect(Author.allow.update()).to.equal(true);
        expect(Author.allow.delete()).to.equal(true);

        expect(Person.allow.create).to.not.equal(Model.allow.create);
        expect(Person.allow.read).to.not.equal(Model.allow.read);
        expect(Person.allow.update).to.equal(Model.allow.update);
        expect(Person.allow.delete).to.equal(Model.allow.delete);

        expect(Author.allow.create).to.equal(Person.allow.create);
        expect(Author.allow.read).to.not.equal(Model.allow.read);
        expect(Author.allow.read).to.not.equal(Person.allow.read);
        expect(Author.allow.update).to.equal(Person.allow.update);
        expect(Author.allow.delete).to.equal(Person.allow.delete);
      });
    });
  });
});
