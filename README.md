# hapi-nosql-mongoose
Mongoose plugin for [HapiJS](https://hapijs.com/) (v17+)

## Install

```bash
# npm
npm install hapi-nosql-mongoose mongoose

# yarn
yarn add hapi-nosql-mongoose mongoose
```

## Register as Hapi Plugin

```javascript
const Mongoose = require('hapi-nosql-mongoose');
const schemas = require('./my/mongoose/schemas');

await server.register({
    plugin: Mongoose,
    options: {
        uri: 'mongodb://localhost:27017/database',
        config: {...},
        schemas: {...}
    }
});
```
#### Options
+ **uri**: a mongodb valid uri
+ **config**: a javascript object with [mongoose options](http://mongoosejs.com/docs/connections.html#options)
+ **schemas**: a javascript object with mongoose schema definitions

#### Schema Definitions
For ease of use you can have a folder with all your schema definitions along an `index.js` file that exports all the schemas inside the folder. e.g:

```bash
-- /my/mongoose/schemas/
  |-- index.js
  |-- post.js
  |-- user.js
```

```javascript
// Post schema (post.js)
'use strict';

const Schema = require('mongoose').Schema;

const Post = new Schema({
    title: {
        type: String,
        trim: true
    },
    content: String,
    authorId: {
        type: String // referencing the User as you see fit
    },
    createdAt: {
        type: Date,
        'default': Date.now
    }
});

module.exports = Post;
```

```javascript
// User schema (user.js)
'use strict';

const Schema = require('mongoose').Schema;

const User = new Schema({
    uuid: {
        type: String,
        'default': uuid.v4 // using an uuid library
    },
    name: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        'default': Date.now
    }
});

module.exports = User;
```

```javascript
// Exporter (index.js)
'use strict';

const Post = require('./post');
const User = require('./user');

const schemas = {
    Post,
    User
};

module.exports = schemas
```
