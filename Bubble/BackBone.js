if ( !Detector .webgl ) Detector .addGetWebGLMessage( )

let scene,   renderer,   camera,       vr_camera,        controls, vr_controls, vr_effect,   clock,     vr_button,
    display, vr_enabled, ambientLight, directionalLight, light,    lights,      textureCube, format,    camera_seq
let container;
clock      = new THREE .Clock( true )
display    = window
vr_enabled = false

container = document.getElementById( 'container' );
let show_stats = false;
if(show_stats) {
    let stats = new Stats();
    container.appendChild(stats.dom);
}
let cameraZ = 165;

let calculate_pane_width = (dist) => (camera.aspect)*dist * Math.tan((camera.fov * Math.PI / 180)) * 2 / 3;
let calculate_pane_height = (dist) => dist * Math.tan(camera.fov * Math.PI / 180) * 2 / 3;

let pane_y  = (dist, percent) => percent * calculate_pane_height(dist)/2;
let pane_x  = (dist, percent) => percent * calculate_pane_width(dist)/2;
// var frustumSize = 1000;
//
// var aspect = window.innerWidth / window.innerHeight;

// done(camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 10000 )
camera_seq =
    ASQ( )
        .then(
             ( done ) =>
                 done( camera = new THREE .PerspectiveCamera( 70,
                                                             window .innerWidth / window .innerHeight,
                                                             .1,
                                                             10000
                                                            )

)
        )
        .all(
            ( done,
              camera ) =>
            {
                camera  .position .set( 0, 0, cameraZ )
                done   ( camera )
            },
            ( done,
              camera ) =>
            {
                ASQ( )
                    .then(
                         ( done ) =>
                             done( controls = new THREE .OrbitControls( camera ) )
                    )
                    .then(
                        ( done,
                          controls ) =>
                        {
                            controls .target            =   new THREE .Vector3( 0, 0, 0 )
                            controls .lookSpeed         =   .07
                            controls .noFly             =   true
                            controls .lookVertical      =   true
                            controls .movementSpeed     =   0
                            controls .zoomSpeed         =   2.5
                            done( controls )
                        }
                    )
                done( camera )
            }

        )


ASQ( )
    .all(
        ( done ) =>
        {
            done( scene = new THREE .Scene( ) )
            ASQ( )
                .all(
                    ( done ) =>

                        // scene .add( new THREE .Mesh( new THREE .SphereGeometry( 10 ),
                        //                              new THREE .MeshStandardMaterial( { } )
                        //                            )
                        //           )
                    {}
                    ,
                    ( done ) =>
                    {
                        for( const _light in lights = {   ambientLight : ambientLight = new THREE .AmbientLight     ( 0xffffff , 1 ),
                                                          light        : light        = new THREE .DirectionalLight ( 0xffffff , .4 )})
                            scene .add( lights[ _light ] )
                        done( scene )
                    },
                    ( done ) =>
                    {
                        camera_seq
                            .then( ( done,
                                     camera ) =>
                                   {
                                       scene  .add( controls .object )
                                       done   ( camera )
                                   }
                            )
                        done( scene )
                    }
                )
        },
        ( done ) =>
            done(
                // new THREE .CubeTextureLoader( )
                //     .setPath( 'Media/Images/' )
                //     .load( [
                //         'px', 'nx',
                //         'py', 'ny',
                //         'pz', 'nz'
                //     ] .map( file => file + '.jpg' ) )
                // new THREE .CubeTextureLoader( )
                //     .setPath( 'Media/Images/' )
                //     .load( [
                //         'py', 'py',
                //         'py', 'py',
                //         'py', 'py'
                //     ] .map( file => file + '.jpg' ) )


                // left right
                // top bottom
                // behind front


                // 'fadetestside1', 'fadetestside2',
                // 'fadetesttop', 'fadetestbottom',
                // 'testbright1', 'ii-min'
new THREE .CubeTextureLoader( )
    .setPath( 'Media/Images/' )
    .load( [
        'ii-min', 'ii-min',
        'ii-min', 'ii-min',
        'ii-min', 'ii-min'
        // 'fadetestside1', 'fadetestside2',
        // 'fadetesttop', 'fadetestbottom',
        // 'testbright1', 'ii-min'
    ] .map( file => file + '.jpg' ) )
                )
    ).then((done,scene,tCube)=>done(scene,tCube))
    .then(
        ( done,
          scene,
          tCube ) =>
        {
            scene .background   =   tCube
            tCube .format       =   THREE .RGBAFormat
            textureCube         =   tCube
            done( scene )
        }
    )


ASQ( )
    .then(
        ( done ) =>
            done( renderer = new THREE .WebGLRenderer( { antialias : true, alpha : true, logarithmicDepthBuffer : true } ) )
    )
    .all(
        ( done,
          renderer ) =>
        {
            ASQ( renderer )
                .then(
                    ( done,
                      renderer ) =>
                        done( vr_effect = new THREE .VREffect( renderer ) )
                )
                .then(
                    ( done,
                      vr_effect ) =>
                    {
                        vr_effect .setSize( window .innerWidth,
                                            window .innerHeight )
                        done( vr_effect )
                    }
                )
            done( renderer )
        },
        ( done,
          renderer ) =>
        {
            renderer .setPixelRatio( Math .floor( window .devicePixelRatio ) )
            renderer.setClearColor('#ffffff', 0)
            done ( renderer )
        },
        ( done,
          renderer ) =>
        {
            document .body .appendChild( renderer .domElement )
            done ( renderer )
        },
        ( done,
          renderer ) =>
        {
            display .requestAnimationFrame( animate )
            ASQ( )
                .then(
                    ( done ) =>
                        done( vr_button = new webvrui .EnterVRButton( renderer .domElement,
                                                                      {
                                                                          color         :   'white',
                                                                          background    :    false ,
                                                                          corners       :   'square'
                                                                      })
                            )
                )
                .all(
                    ( done,
                      vr_button ) =>
                    {
                        vr_button
                            .on( "enter" ,     ( )       =>        vr_enabled = true  )
                            .on( "exit"  ,     ( )       =>        vr_enabled = false )
                            .on( "error" ,     ( error ) =>        { } )
                            .on( "hide"  ,     ( )       =>        document .getElementById( "ui" ) .style .display = "none"    )
                            .on( "show"  ,     ( )       =>        document .getElementById( "ui" ) .style .display = "inherit" )
                        done( vr_button )
                    },
                    ( done,
                      vr_button ) =>
                    {
                        vr_button .getVRDisplay( )
                            .then(
                                ( _display ) => display = _display
                            )
                            .catch(
                                ( )          => display = window
                            )
                        done( vr_button )
                    },
                    ( done,
                      vr_button ) =>
                    {
                        document .getElementById( "button" ) .appendChild( vr_button .domElement )
                        done( vr_button )
                    }
                )
            done( renderer )
        }
    ) .then(
        ( done,
          msg ) =>
        {
            done( msg )
        }
    )


ASQ( )
    .then(
         ( done )        =>
             done ( vr_camera   = new THREE .Object3D( ) )
    )
    .then(
         ( done,
           vr_camera )   =>
             done ( vr_controls = new THREE .VRControls( vr_camera ) )
    )
    .then(
         ( done,
           vr_controls ) =>
             done ( vr_controls .zoomSpeed = 2.5 )
    )


const animate =
    ( ) =>
    {
        render( );
        if(show_stats)
            stats.update();

    }

let rotates = [];
let mixers = new Set();
let rotate_entries = true;
let renders = [];

const render =
    ( ) =>
    {
        const delta = clock .getDelta( )

        if( vr_enabled === true )
        {
            vr_effect   .render ( scene,
                                  camera )
            controls    .update ( delta  )
            vr_controls .update ( delta  )

            let orbit_position      =  camera    .position .clone(),
                rotated_position    =  vr_camera .position .applyQuaternion( camera .quaternion )

            camera .position    .add        ( rotated_position      )
            camera .quaternion  .multiply   ( vr_camera .quaternion )
            camera .position    .copy       ( orbit_position        )

        }else {

            if( camera )
                renderer        .render( scene,
                                         camera )
            if( controls )
                controls        .update( delta )

            if( vr_controls )
                vr_controls     .update( delta )
        }

        renders.forEach(e => e(delta));
        ASQ()
            .all(
                (done) => {
                    entries.forEach(e=>{e.Base.lookAt(camera.position)});
                    if(bubble_book&&bubble_book.Needle&&bubble_book.Needle.Base)
                        bubble_book.Needle.Base.lookAt(camera.position);
                    done();
                },
                (done) => {
                    if ( mixers.size > 0 ) {
                        for(let mixer of mixers)
                            mixer.update( delta );
                    }
                    done();
                },
                (done) => {
                    // renders.forEach(e => e(delta));
                    done();
                },
            )
        if(rotate_entries)
            ASQ()
                .all(
                    ...rotates.map(e=>(done) => {e(delta); done()})
                )

        if( camera )
            camera .updateProjectionMatrix( )

        display .requestAnimationFrame( animate )
    }



let on_resize = [];
const resize =
    ( ) =>
    {
        vr_effect .setSize( window .innerWidth,
                            window .innerHeight )

        camera .aspect =    window.innerWidth
                          / window.innerHeight
        on_resize['forEach'](e=>e());
    }

window  .addEventListener   ( 'vrdisplaypresentchange',
                              resize, true )

window  .addEventListener   ( 'resize',
                              resize, true )
