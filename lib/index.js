// Inspired by https://github.com/asilluron/hapi-mongoose
'use strict';

const Connector = require('./connector');

const register = async (server, options) => {

    const connector = new Connector(options);

    await new Promise((resolve, reject) => {

        connector
            .once('ready', () => {

                const schemas = options.schemas || {};
                connector.setModels(schemas);

                server.expose('mongoose', connector.mongoose);
                server.expose('connection', connector.connection);

                server.decorate('server', 'mongoose:connector', connector);

                resolve();
            })
            .once('close', (message) => {

                connector.log(message);
            })
            .once('error', (error) => reject(error));
    });
};

exports.plugin = {
    register,
    pkg: require('../package')
};
