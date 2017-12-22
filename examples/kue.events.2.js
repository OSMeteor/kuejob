var kue = require('../index');

var Redis = require('ioredis');
var jobs = kue.createQueue({
    prefix: 'q',
    // jobEvents: false,
    // disableSearch: false,

    // redis:{
    //     port: 7379,
    //     host: '10.40.253.187',
    //     auth: '12345678',
    //     db: 12
    // }
    // 7000

    redis: {
        createClientFactory: function () {
             return  new Redis.Cluster([{
                port: 7000,
                host: '121.42.190.222'
            }, {
                port: 7001,
                host: '121.42.190.222'
            }, {
                port: 7002,
                host: '121.42.190.222'
            }, {
                port: 7003,
                host: '121.42.190.222'
            }, {
                port: 7004,
                host: '121.42.190.222'
            }, {
                port: 7005,
                host: '121.42.190.222'
            }, {
                port: 7006,
                host: '121.42.190.222'
            },{
                port: 7007,
                host: '121.42.190.222'
            }]);
            // return new Redis({ port: 19000,          // Redis port
            //     // host: "121.42.190.222",   // Redis host
            //     host: "10.40.253.187",
            //     family: 4,           // 4 (IPv4) or 6 (IPv6)
            //     password: "",
            //     db: 12
            // });
        }
    }


    // redis: {
    //   createClientFactory: function () {
    //       return new Redis({ port: 19000,          // Redis port
    //           // host: "121.42.190.222",   // Redis host
    //           host: "10.40.253.187",
    //           family: 4,           // 4 (IPv4) or 6 (IPv6)
    //           password: "",
    //           db: 12
    //       });
    //     // return new Redis({ port: 7379,          // Redis port
    //     //   host: "10.40.253.187",   // Redis host
    //     //   family: 4,           // 4 (IPv4) or 6 (IPv6)
    //     //   password: "12345678",
    //     //   db: 12
    //     // });
    //   }
    // }
});

jobs.on( 'error', function( err ) {
    console.log( 'Oops... ', err );
});

process.once( 'SIGTERM', function ( sig ) {
    jobs.shutdown( 5000, function(err) {
        console.log( 'Kue shutdown: ', err||'' );
        process.exit( 0 );
    });
});

function create() {
    var name = [ 'tobi', 'loki', 'jane', 'manny' ][ Math.random() * 4 | 0 ];
    var job  = jobs.create( 'video conversion', {
        title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
    })

        .removeOnComplete(true).attempts(3).ttl(100);
    // .removeOnComplete(!jm.debug)
    //     .attempts(task.retry)
    //     .ttl(task.ttl);

     console.log("add new job");
    job.on( 'complete', function () {
        console.log( " Job complete" );
    } ).on( 'failed', function () {
        console.log( " Job failed" );
    } ).on( 'progress', function ( progress ) {
        // console.log( '\r  job #' + job.id + ' ' + progress + '% complete' );
        process.stdout.write( '\r  job #' + job.id + ' ' + progress + '% complete' );
    } );

    job.save();
    //
    //   setTimeout( create, Math.random() * 2000 | 0 );
    setTimeout( create, 100 );
}

  create();


function convertFrame( i, fn ) {
    setTimeout( fn, Math.random() * 50 );
}


kue.app.set('title', 'osmeteor');
kue.app.listen( 3001 );
console.log( 'UI started on port 3001' );
