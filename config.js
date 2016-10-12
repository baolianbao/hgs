module.exports = {
    DB_URI: 'mongodb://localhost/huaguoshan',
    PASSWORD_SALT_ROUNDS: 10,

    /**
     * Session config 
     */
    SESSION_SECRET: 'recommand 128 bytes random string',

    /**
     * Email config
     */
    EMAIL_HOST: 'smtp.163.com',
    EMAIL_SECURE_CONNECTION: true,
    EMAIL_PORT: 465,
    EMAIL_TRANSPORT_METHOD: 'SMTP',
    EMAIL_ACCOUNT : 'your email address',
    EMAIL_PASSWORD: 'Your password'

}