const dotenv = require('dotenv');

dotenv.config({ 
    path: {
        dev: '.env.development',
        prod: '.env'
    }[process.env.NODE_ENV] 
});