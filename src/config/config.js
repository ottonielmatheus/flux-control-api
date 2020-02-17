const dotenv = require('dotenv');

dotenv.config({ 
    path: {
        dev: '.env.development',
        prod: '.env'
    }[process.env.NODE_ENV] 
});

Date.prototype.addHours = function(hours) {
    this.setTime(this.getTime() + ( hours * 60 * 60 * 1000));
    return this;
}