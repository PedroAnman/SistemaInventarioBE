import { configure, getLogger } from 'log4js';
import { GET_DATE } from './constants';
const path = require('path');

configure({
    appenders: {
        out: { type: 'console' },
        app: { 
            type: 'file', 
            filename: 'logs/application.log',
            maxLogSize: 20971520,
            backups: 10 ,
            // layout: {
            //   type: 'pattern',
            //   pattern: '%d{yyyy-MM-dd hh:mm:ss:SSS}#%p#%m'
            // }
            layout: {
                type: 'pattern',
                pattern: '%x{ln} %-5p %m',
                tokens: {
                  ln: function () {
                    const date = GET_DATE();
                    let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
                    let month = ((1+date.getMonth()) < 10) ? `0${(1+date.getMonth())}` : (1+date.getMonth());
                    let year = date.getFullYear();
                    let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
                    let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
                    let seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
                    
                    return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':'
                      + seconds;
                  }
                }
              }
        }
    },
    categories: {
        default: { appenders: [ 'out', 'app' ], level: 'info' },
        LOG: { appenders: [ 'app' ], level: 'info' }
    }
});

function logger(nameClass: string, type: boolean, message: string, email: boolean = false) { 
    const filename = (path.basename(nameClass)).toUpperCase();
    if(type){
        getLogger('LOG').info(`${filename} :: ${message}`);
    }else{
        getLogger('LOG').error(`${filename} :: ${message}`);
    }
}

export{ 
    logger
};
