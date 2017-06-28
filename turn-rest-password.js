let config = {
    username: '',
    ttl: 86400,
    turn_port: 3478,
    turns_port: 5349,
    host: '',
    shared_secret: '',
};

function generate_username(username) {
    let ts = Math.floor(+ new Date() / 1000);
    return ts + ':' + username;
}

function generate_password(usercombo, shared_secret) {
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha1', shared_secret);
    hmac.update(usercombo);
    return hmac.digest('hex');
}

function issue_credential() {
    let response = {};
    response.username = generate_username(config.username);
    response.password = generate_password(response.username, config.shared_secret);
    response.ttl = config.ttl;

    let uris = [];
    if (config.turn_port) {
        uris.push('turn:' + config.host + ':' + config.turn_port);
    }
    if (config.turns_port) {
        uris.push('turns:' + config.host + ':' + config.turns_port);
    }

    response.uris = uris;

    return response;
}

function main(_config) {
    if (_config.username) {
        config.username = _config.username;
    }
    if (_config.ttl) {
        config.ttl = _config.ttl;
    }
    if (_config.turn_port) {
        config.turn_port = _config.turn_port;
    }
    if (_config.turns_port) {
        config.turns_port = _config.turns_port;
    }
    if (!_config.host) {
        throw "host value is essential.";
    }
    else {
        config.host = _config.host;
    }
    if (!(config.turn_port) && !(config.turns_port)) {
        throw "at least one turn/turns port should be set.";
    }
    if (!_config.shared_secret) {
        throw "shared_secret value must be set";
    }
    else {
        config.shared_secret = _config.shared_secret;
    }

    return issue_credential();
}

module.exports = main;

