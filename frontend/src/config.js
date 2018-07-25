var config = module.exports = {}

if (process.env.NODE_ENV === 'production') {
  config.selfHost = 'http://nagualism.space/';
} else {
  config.selfHost = 'http://0.0.0.0:8080/';
}

config.apiHost = 'http://nagualism.space/api/';
