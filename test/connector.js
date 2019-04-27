'use strict';

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = require('@hapi/lab').script();
const Connector = require('../lib/connector');
const Post = require('./schemas/post');

describe('Mongoose Connector', () => {

    it('should throw an error if uri is not defined', () => {

        const fn = () => {

            new Connector();
        };

        expect(fn).to.throw(Error);
    });

    it('should throw an error if uri is empty', () => {

        const fn = () => {

            new Connector({
                uri: ''
            });
        };

        expect(fn).to.throw(Error);
    });

    it('returns a Connector instance', () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        expect(connector).to.be.instanceof(Connector);
    });

    it('returns a Connector instance with a logger', () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test',
            logger: (message) => {

                return message;
            }
        });

        expect(connector).to.be.instanceof(Connector);
    });

    it('returns a message on Connector "ready" event', async () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        const result = await new Promise((resolve) => {

            connector
                .once('ready', (message) => {

                    resolve(message);
                });
        });

        expect(result).to.be.equal('✔ Connected to mongodb://localhost:27017/test');
    });

    it('returns a message on Connector "close" event', async () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        await connector.connection
            .then((connection) => {

                connection.close();
            });

        const result = await new Promise((resolve) => {

            connector
                .once('close', (message) => {

                    resolve(message);
                });
        });

        expect(result).to.be.equal('Connection to database closed');
    });

    it('initializes the schemas', async () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        await new Promise((resolve) => {

            connector
                .once('ready', () => {

                    resolve();
                });
        });

        connector.setModels({ Post });

        const models = Object.keys(connector.models);

        expect(models.length).to.be.equal(1);
    });

    it('throws an error when trying to get a model that does not exist', async () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        await new Promise((resolve) => {

            connector
                .once('ready', () => {

                    resolve();
                });
        });

        connector.setModels({ Post });

        const fn = () => {

            connector.getModel('Comment');
        };

        try {
            fn();
        }
        catch (error) {
            expect(error.message).to.be.equal('Model \'Comment\' does not exist');
        }
    });

    it('returns a model', async () => {

        const connector = new Connector({
            uri: 'mongodb://localhost:27017/test'
        });

        await new Promise((resolve) => {

            connector
                .once('ready', () => {

                    resolve();
                });
        });

        connector.setModels({ Post });
        const model = connector.getModel('Post');

        expect(model.modelName).to.be.equal('Post');
    });

});
