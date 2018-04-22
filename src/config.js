var config = module.exports = {}

if (process.env.NODE_ENV === 'production') {
  config.selfHost = 'http://nagualchat.ml/'
} else {
  config.selfHost = 'http://localhost:8080/'
}

config.apiHost = "http://ec2-18-222-19-123.us-east-2.compute.amazonaws.com:8081/"
