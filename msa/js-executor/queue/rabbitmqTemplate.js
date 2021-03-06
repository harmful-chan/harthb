'use strict';

const config = require('config'),
    JsInvokeMessageProcessor = require('../api/jsInvokeMessageProcessor'),
    logger = require('../config/logger')._logger('rabbitmqTemplate');

const requestTopic = config.get('request_topic');
const host = config.get('rabbitmq.host');
const port = config.get('rabbitmq.port');
const vhost = config.get('rabbitmq.virtual_host');
const username = config.get('rabbitmq.username');
const password = config.get('rabbitmq.password');
const queueProperties = config.get('rabbitmq.queue_properties');
const pollInterval = config.get('js.response_poll_interval');

const amqp = require('amqplib/callback_api');

let queueOptions = {durable: false, exclusive: false, autoDelete: false};
let connection;
let channel;
let stopped = false;
let queues = [];

function RabbitMqProducer() {
    this.send = async (responseTopic, scriptId, rawResponse, headers) => {

        if (!queues.includes(responseTopic)) {
            await createQueue(responseTopic);
            queues.push(responseTopic);
        }

        let data = JSON.stringify(
            {
                key: scriptId,
                data: [...rawResponse],
                headers: headers
            });
        let dataBuffer = Buffer.from(data);
        channel.sendToQueue(responseTopic, dataBuffer);
        return new Promise((resolve, reject) => {
            channel.waitForConfirms((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

(async () => {
    try {
        logger.info('Starting ThingsBoard JavaScript Executor Microservice...');
        const url = `amqp://${username}:${password}@${host}:${port}${vhost}`;

        connection = await new Promise((resolve, reject) => {
            amqp.connect(url, function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        channel = await new Promise((resolve, reject) => {
            connection.createConfirmChannel(function (err, channel) {
                if (err) {
                    reject(err);
                } else {
                    resolve(channel);
                }
            });
        });

        parseQueueProperties();

        await createQueue(requestTopic);

        const messageProcessor = new JsInvokeMessageProcessor(new RabbitMqProducer());

        while (!stopped) {
            let pollStartTs = new Date().getTime();
            let message = await new Promise((resolve, reject) => {
                channel.get(requestTopic, {}, function (err, msg) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(msg);
                    }
                });
            });

            if (message) {
                messageProcessor.onJsInvokeMessage(JSON.parse(message.content.toString('utf8')));
                channel.ack(message);
            } else {
                let pollDuration = new Date().getTime() - pollStartTs;
                if (pollDuration < pollInterval) {
                    await sleep(pollInterval - pollDuration);
                }
            }
        }
    } catch (e) {
        logger.error('Failed to start ThingsBoard JavaScript Executor Microservice: %s', e.message);
        logger.error(e.stack);
        exit(-1);
    }
})();

function parseQueueProperties() {
    let args = {};
    const props = queueProperties.split(';');
    props.forEach(p => {
        const delimiterPosition = p.indexOf(':');
        args[p.substring(0, delimiterPosition)] = +p.substring(delimiterPosition + 1);
    });
    queueOptions['arguments'] = args;
}

async function createQueue(topic) {
    return new Promise((resolve, reject) => {
        channel.assertQueue(topic, queueOptions, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

process.on('exit', () => {
    exit(0);
});

async function exit(status) {
    logger.info('Exiting with status: %d ...', status);

    if (channel) {
        logger.info('Stopping RabbitMq chanel.')
        await channel.close();
        logger.info('RabbitMq chanel stopped');
    }

    if (connection) {
        logger.info('Stopping RabbitMq connection.')
        try {
            await connection.close();
            logger.info('RabbitMq client connection.')
            process.exit(status);
        } catch (e) {
            logger.info('RabbitMq connection stop error.');
            process.exit(status);
        }
    } else {
        process.exit(status);
    }
}
