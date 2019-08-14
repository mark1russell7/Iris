// imports
    let express     = require('express');
    let bodyParser  = require('body-parser');
    let url         = require('url');
    let fs          = require('fs');
    let compression = require('compression');
    let helmet      = require('helmet');
    let session     = require('express-session');
    let ASQ         = require("asynquence");
    let compressor  = require('node-minify');
    let bcrypt      = require('bcryptjs');
    let app         = express();
    let mongoose    = require('mongoose'); // Database
//
// constants
//     const serverIP = "12964.122.103";
const serverIP = "127.0.0.1";
    const aaronIP = "129.64.148.131";
    const phoneIP = "129.64.141.124";
    const ROOT = "C:/Users/clmcr/WebstormProjects/Convex/src";
    const PORT = 9091;
    const MAX_CACHE_AGE = 0;
    const SITE = 'src/index.html';
    const ERROR_SITE = '404.html';
    const root_site_names = [SITE, '', 'lifeline'];
    const is_site = (p) => root_site_names.some(name => name.localeCompare(p) === 0);
    mongoose.Promise = global.Promise;
    const express_session = {
        secret: bcrypt.hashSync('s3Cur3', bcrypt.genSaltSync(10)),
        name: 'sessionId',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge : 1000 * 60  * 60 // 1 hour
        }
    };


    if(app.get('env').localeCompare('production')){
        app.set('trust proxy', 1); // trust first proxy
        express_session['cookie']['secure'] = true;
    }
    const type_book = {
        'image' : {
            'extensions': {
                'jpeg'  :   'image/jpeg',
                'jpg'   :   'image/jpeg',
                'png'   :   'image/png',
                'ico'   :   'image/x-icon'
            },
            'write' : (req, res, pathname) =>
                ((s) =>
                        s.on('open', function () {
                            res.set('Content-Type', type_book['image']['extensions'][pathname.substr(pathname.lastIndexOf('.') + 1)]);
                            res.set('Cache-Control', 'max-age=' + MAX_CACHE_AGE);
                            s.pipe(res);
                        })
                )(fs.createReadStream(pathname))
        },
        'video' : {
            'extensions': {
                'mp4'   :   'video/mp4'
            },
            'write' : function(req, res, pathname){
                const path = pathname;
                const content_type = type_book['video']['extensions'][pathname.substr(pathname.lastIndexOf('.') + 1)];
                const stat = fs.statSync(path);
                const fileSize = stat['size'];
                const range = req['headers']['range'];
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize-1;
                    const chunksize = (end-start)+1;
                    const file = fs.createReadStream(path, {start, end});
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': content_type,
                        'Cache-Control' : 'max-age='+ MAX_CACHE_AGE
                    };
                    res.writeHead(206, head);
                    file.pipe(res);
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': content_type,
                        'Cache-Control' : 'max-age='+ MAX_CACHE_AGE
                    };
                    res.writeHead(200, head);
                    fs.createReadStream(path).pipe(res);
                }
            }
        },
        'text' : {
            'extensions': {
                'html'  :   'text/html',
                'css'   :   'text/css',
                'js'    :   'application/javascript',
                'json'  :   'application/json',
                'txt'   :   'text/plain'
            },
            'write' : (req, res, site) =>
                fs.readFile(site, function (error, data) {
                    if (error) on_page_load_error(res, error);
                    else {
                        res.writeHead(200, {
                            'Content-Type' : type_book['text']['extensions'][site.substring(site.lastIndexOf('.')+1)] || 'text/html',
                            'Cache-Control' : 'max-age=' + MAX_CACHE_AGE
                        });
                        res.write(
                            (
                                    (
                                        SERVER_IP_BYPASS
                                            ?      req['connection']['remoteAddress'] !== serverIP
                                                && req['connection']['remoteAddress'] !== phoneIP
                                                && req['connection']['remoteAddress'] !== aaronIP
                                            : true
                                    )
                                &&
                                    FILES[site]
                            )
                                ? FILES[site]
                                : data.toString()

                        );
                        res.end();
                    }
                })
        }
    };
    const is_type = (type_extensions, pathname) => Object.keys(type_extensions).some(extension => pathname.endsWith(extension));
    const REQUEST_SIZE_LIMIT = '500mb';
    const REQUEST_TYPE = 'application/json';
    const parse_url = (u) => url.parse(u)['pathname'];
    const on_page_load_error = (res, error) => {
        console.log(error);
        fs.readFile(ERROR_SITE, function (error, data) {
            res.writeHead(404, {
                'Content-Type' : 'text/html',
                'Cache-Control' : 'max-age=' + MAX_CACHE_AGE
            });
            if (error)
                console.log(error);
            else
                res.write(data.toString());
            res.end();
        });
    };
    const FILES = {};
    const SERVER_IP_BYPASS = true;
    const DEBUG = true;
    const COMPRESS_AND_OBFUSCATE_FILES = false;
//

// routers
    let postRouter = (req, res) =>
        ASQ(req, res)
            .then(function(done, req, res){
                done(parse_url(req['url']), req, res);
            })
            .then(function(done, pathname, req, res){
                if(is_site(pathname.substring(1)))
                    type_book['text'].write(req, res, SITE);
                else
                    home(req, res);
                done();
            })
            .or(function(error){console.log(error)});

    let getRouter = (req, res) =>
        ASQ(req, res)
            .then(function(done, req, res){
                done(parse_url(req['url']), req, res);
            })
            .then(function(done, pathname, req, res){
                if(is_site(pathname.substring(1))) {
                    postRouter(req, res).pipe(done);
                }else
                    done(Object
                        .keys(type_book)
                        .filter(type =>
                            is_type(type_book[type]['extensions'], pathname)), pathname, req, res);
            })
            .then(function(done, query, pathname, req, res){
                if(query) {
                    if (query[0])
                        type_book[query[0]].write(req, res, pathname.startsWith(ROOT) ? pathname : ROOT + pathname);
                    else
                        type_book['text'].write(req, res, ROOT + pathname);
                }
                done();
            })
            .or(function(error){console.log(error)});
//

// Minify and Obfuscate js/css
    if(COMPRESS_AND_OBFUSCATE_FILES) {
        ASQ()
            .all(
            ...[
            "LIFELINE/BackBone.js",
            "LIFELINE/Entry.js",
            "LIFELINE/RunAfterSetup.js",
            "LIFELINE/Sugar.js",
            "LIFELINE/Entries/Geometries/AlgorithmEntries.js",
            "LIFELINE/Entries/Geometries/AnimationYard.js",
            "LIFELINE/Entries/Geometries/BoundingRadiusEntry.js",
            "LIFELINE/Entries/Geometries/BubbleBookAddEntry.js",
            "LIFELINE/Entries/Geometries/BubbleBookEntry.js",
            "LIFELINE/Entries/Geometries/ClosuredEntries.js",
            "LIFELINE/Entries/Geometries/DataConverters.js",
            "LIFELINE/Entries/Geometries/DraggingAttempt.js",
            "LIFELINE/Entries/Geometries/EntryEntry.js",
            "LIFELINE/Entries/Geometries/EntryTests.js",
            "LIFELINE/Entries/Geometries/FundamentalLanguageEntries.js",
            "LIFELINE/Entries/Geometries/GeometryEntries.js",
            "LIFELINE/Entries/Geometries/GuesserEntries.js",
            "LIFELINE/Entries/Geometries/HTMLEntries.js",
            "LIFELINE/Entries/Geometries/JSPropertyFunctionEntries.js",
            "LIFELINE/Entries/Geometries/KeyboardInputEntry.js",
            "LIFELINE/Entries/Geometries/ListenerEntry.js",
            "LIFELINE/Entries/Geometries/LogicalEntries.js",
            "LIFELINE/Entries/Geometries/MakeXSphereEntry.js",
            "LIFELINE/Entries/Geometries/MaterialEntries.js",
            "LIFELINE/Entries/Geometries/MathEntries.js",
            "LIFELINE/Entries/Geometries/MeshEntry.js",
            "LIFELINE/Entries/Geometries/NeedleEntry.js",
            "LIFELINE/Entries/Geometries/ParameterEntry.js",
            "LIFELINE/Entries/Geometries/PoolEntry.js",
            "LIFELINE/Entries/Geometries/PrimitiveEntries.js",
            "LIFELINE/Entries/Geometries/PromiseCriticalSectionEntry.js",
            "LIFELINE/Entries/Geometries/RoundedTubeEntry.js",
            "LIFELINE/Entries/Geometries/SearchBarEntry.js",
            "LIFELINE/Entries/Geometries/SearchTubeEntry.js",
            "LIFELINE/Entries/Geometries/SelectorEntry.js",
            "LIFELINE/Entries/Geometries/SlinkyGraphEntry.js",
            "LIFELINE/Entries/Geometries/SpiralEntries.js",
            "LIFELINE/Entries/Geometries/TextEntries.js",
            "LIFELINE/Entries/Geometries/THREEEntries.js",
            "LIFELINE/Entries/Geometries/Tools.js",
            "LIFELINE/Entries/Geometries/TubeTextEntry.js",
            "LIFELINE/Entries/Geometries/tunnel.js",
            "LIFELINE/Entries/Geometries/VectorEntry.js"]
            .map(e => (done) => {
                ASQ()
                    .promise(
                compressor.minify({
                    compressor: 'uglify-es',
                    input: ROOT + "/src/js/" + e,
                    output: 'temp/' + e,
                    options : {
                        mangle : false
                    }
                })
                    .then((min) => {FILES[ROOT + "/src/js/" + e] = min; console.log(min)})
                    ).pipe(done)

                }
            ))
            // .forEach((file) =>
            // compressor.minify({
            //     compressor: 'uglify-es',
            //     input: ROOT + "/src/js/" + file,
            //     output: 'temp/' + file,
            //     options : {
            //         mangle : false
            //     }
            // })
            //     .then((min) => {FILES[ROOT + "src/js/" + file] = min; console.log(min)}))
            //     .then((min) => FILES[ROOT + "/src/js/" + file] =
            //     JSO.obfuscate(min, {
            //         // USED
            //         compact: true,
            //         selfDefending: true,
            //         rotateStringArray: true,
            //         transformObjectKeys: true,
            //         stringArray: true,
            //         stringArrayEncoding: true,
            //         identifierNamesGenerator: 'hexadecimal',
            //         disableConsoleOutput: !DEBUG,
            //         debugProtection: !DEBUG,
            //         debugProtectionInterval: !DEBUG,
            //
            //         // SET TO FALSE FOR INCREASED JS SPEED AND REDUCED FILE SIZE
            //         controlFlowFlattening: true,
            //         controlFlowFlatteningThreshold: 0.75,
            //         deadCodeInjection: true,
            //         deadCodeInjectionThreshold: 0.4,
            //
            //         // UNUSED
            //         domainLock: [],
            //         identifiersPrefix: '',
            //         log: false,
            //         renameGlobals: false,
            //         stringArrayThreshold: 0.75,
            //         target: 'browser',
            //     }).getObfuscatedCode()

        // );
        // ["main.css", "normalize.css"].forEach((file) =>
        //     compressor.minify({
        //         compressor: 'clean-css',
        //         input: ROOT + "/src/css/" + file,
        //         output: 'temp/' + file
        //     }).then((min) => FILES[ROOT + "/src/css/" + file] = min
        //     .catch((error) => console.log(error)))
        // );
    }
//

// app config
    app.use(bodyParser.json({limit: REQUEST_SIZE_LIMIT, type: REQUEST_TYPE}));
    app.use(bodyParser.urlencoded({limit: REQUEST_SIZE_LIMIT, extended: true}));
    app.use(compression());
    app.use(helmet());
    app.use(session(express_session));

    app.get("/*", getRouter);
    app.post("/*", postRouter);

    app.listen(PORT, serverIP, () => console.log('Listening to port:  ' + PORT));
//


function home(req, res)
{
    // parse client requests (req.body)
}
