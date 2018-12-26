'use strict';

const Hoek = require('hoek');
const Mongoose = require('mongoose');
const EventEmitter = require('events').EventEmitter;

exports = module.exports = class Connector extends EventEmitter {
    constructor({ uri, config = {}, logger }) {

        super();

        Hoek.assert(typeof uri === 'string', new Error('uri must be a string'));
        Hoek.assert(uri !== '', new Error('uri is required'));

        this.mongoose = Mongoose;
        this.logger = logger;
        this.uri = uri;
        this.config = Object.assign({ useNewUrlParser: true }, config);
        this.models = {};
        this.connection = this.connect();
        this.addListeners();
    }

    log(message = '') {

        if (typeof this.logger === 'function') {
            this.logger(message);
        }
    }

    connect() {

        return this.mongoose.createConnection(this.uri, this.config);
    }

    addListeners() {

        this.connection
            .on('connected', () => {

                this.log('Connection to database ready');
                this.emit('ready', `✔ Connected to ${this.uri}`);
            })
            .on('error', (error) => {

                this.log(`Unable to connect to database: ${error.message}`);
                this.emit('error', error);
            })
            .on('open', () => {

                this.emit('open', 'Connection to database opened');
            })
            .on('close', () => {

                this.log('Connection to database closed');
                this.emit('close', 'Connection to database closed');
            })
            .on('disconnected', () => {

                this.log('Connection to database disconnected');
                this.emit('disconnected', 'Database disconnected');
            });
    }

    setModels(schemas = {}) {

        for (const key in schemas) {
            this.models[key] = this.connection.model(key, schemas[key]);
        }
    }

    getModel(name) {

        if (!this.models.hasOwnProperty(name)) {
            throw new Error(`Model '${name}' does not exist`);
        }

        return this.models[name];
    }
};
