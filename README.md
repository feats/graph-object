<p align="center">
  <img src="http://www.pixhoster.info/f/2016-09/d78d3dff14fb32cd46f058c237e1b6ac.jpg" />
</p>

# the GraphObject [![Build Status](https://travis-ci.org/Quadric/graph-object.svg?branch=master)](https://travis-ci.org/Quadric/graph-object)
Don't let your graph oriented project become a mess. Add structure to it!

### Disclaimer

_This is an **experimental project** not ready for production use yet.
Part of the features described in this document are still being implemented.
The best way to check the features currently implemented is checking out our [example app](https://github.com/Quadric/perfect-graphql-starter)._

_We are looking for feedback and are open for discussing the strategy adopted here.
Do not hesitate opening an issue and sharing your thoughts with us, it will make us happy. :)_

## Install
```
npm install graph-object --save
```

## Models Usage
`new MyModel({ field: value })`

```js
import { Model } from 'graph-object';

class Author extends Model {
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

```js
> const orwell = new Author({ firstName: 'George', lastName: 'Orwell' });
> orwell.firstName
'George'
> orwell.name
'George Orwell'
```

## Authorization

#### Allow/Deny Access

`allow(object, objectCRUD, fields_RU_)`

```js
import { allow, controlAccess } from 'graph-object';

class Post extends Model {
  ...
}

class Author extends Model {
  get posts() {
    return Post.objects.find({ 'author._id': this._id });
  }

  get publicPosts() {
    return controlAccess(
      Post.objects.find({ 'author._id': this._id })
    )
  }

  allowedPosts(context) {
    return controlAccess(
      Post.objects.find({ 'author._id': this._id }), context
    )
  }
}

allow(Post, {
  read(context) { // Post's CRUD permissions could be changed
    return this.author._id === context.userId || !this.private;
  },
}, {
  views: { // `view` field permissions.
           // Only `read` and `update` are available for fields.
    read(context) {
      return this.author._id === context.userId;
    },
    update(context) {
      return false;
    }
  }
});
```

```js
> // someAuthor only published a private ({private: 1}) post.
> someAuthor.posts
Error: 'read' permission not granted by Post
> someAuthor.public
[]
> someAuthor.allowedPosts({ userId: 1 })
[Post]
```

## Managers Usage

Managers are inspired in the [Django's manager](https://docs.djangoproject.com/en/1.10/topics/db/managers/) concept. More docs to come.


## Connectors Setup

In order to retrieve and persist the data from your objects you should connect your [models](#Models-Usage)
to your prefered storage provider. Graph-object is agnostic about that, so you can use any database and storage engines,
as many as you want, as long as there are adapters available for them.

**Note**: If no connector is specified for a given class, it will by default use a _dumb_ memory store.

The example below will give your [managers](#Managers-Usage) access to both mongodb and memory stores.

```js
import models from './models';
import adapter from 'graph-object-adapter-waterline';
import memoryAdapter  from 'sails-memory';
import mongoAdapter  from 'sails-mongo';
import { injectConnectors } from 'graph-object';

const persistingModels = injectConnectors(models, adapter({
  default: {
    adapter: mongoAdapter,
    host: 'localhost', // defaults to `localhost` if omitted
    port: 27017, // defaults to 27017 if omitted
    user: 'username_here', // or omit if not relevant
    password: 'password_here', // or omit if not relevant
    database: 'database_name_here' // or omit if not relevant
    identifiers: {
      Author: 'authors',
      Posts: 'posts',
    }
  },
  memory: {
    adapter: memoryAdapter,
    identifiers: {
      Author: 'people',
      Posts: 'posts',
    }
  },
});

export default persistingModels;
```

## Models, Managers and Connectors. What da heck!?!

If these concepts make you confused, [this issue](https://github.com/apollostack/apollo-server/issues/118) could help clarifying it.


## GraphQL resolvers

Graph-object models are _plug & play_ to GraphQL servers. Just make sure you run `generateResolvers(schema, models)`
to have the resolvers generated.

```js
import schema from '/domain/schemas';
import persistingModels from './models';
import { apolloExpress } from 'apollo-server';

const resolvers = generateResolvers(schema, persistingModels);
addResolveFunctionsToSchema(schema, resolvers);

...

app.use('/graphql', bodyParser.json(), apolloExpress({
  schema,
  resolvers,
  context: {},
}));
```

## Example

Please check out the [Perfect GraphQL Starter](https://github.com/Quadric/perfect-graphql-starter) for a working example app.

## Motivate
If you like this project just give it a star :)
