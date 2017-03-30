const csp = {
  directives: {
    'default-src': ['\'none\''],
    'connect-src': ['\'self\''],
    'font-src': ['\'self\''],
    'img-src': ['\'self\'', 'data:'],
    'script-src': ['\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\'', 'ajax.googleapis.com', 'www.google-analytics.com'],
    'style-src': ['\'self\'', '\'unsafe-inline\''],
    'report-uri': '/report-violation'
  }
};

const config = {
  development: {
    csp,
    db: 'mongodb://localhost/test',
    public: 'client/app/',
    brute: { freeRetries: 99999 }
  },
  production: {
    csp,
    db: process.env.MONGODB_DB_URL,
    public: 'build/',
    brute: {}
  },
  test: {
    csp,
    db: 'mongodb://localhost/test',
    public: 'client/app/',
    brute: { freeRetries: 99999 }
  }
};

module.exports = config[process.env.NODE_ENV];
