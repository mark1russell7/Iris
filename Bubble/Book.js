/*
* Book:
*   has entries
*   can search for entries (fuzzyset)
*
*
*
*   Entry:
*       Brain
*       Body
*       Body Parts
*       Environment
* */

let makeClosuredSet = (function(){
    let set = {};
    let search = function (args) {

    }
    return [(name, entry) => set[name] = entry,
        search,
        (name) => set[name],
        (name, entry) => set[name] = entry,
        () => set
    ];
});
let [addEntry, searchEntry, getEntry, updateEntry, getEntries] = makeClosuredSet();
let [addBody, searchBody, getBody, updateBody, getBodies] = makeClosuredSet();
let [addBrain, searchBrain, getBrain, updateBrain, getBrains] = makeClosuredSet();


let Entry = function (Brain={},
                      Body={},
                      BodyParts={},
                      Environment={})
{
    this.Brain = Brain;
    this.Body = Body;
    this['Body Parts'] = BodyParts;
    this.BodyParts = this['Body Parts'];
    this.Environment = Environment;
    this.Base = new THREE.Group();

    this.Body.circle;
    let self = this;
    this['Brain']['Encircle'] = function(){
        self.Body.circle = m(sphere(computeBounding(self.Base),30,30), mbm({transparent:true,opacity:.05,color:'white'}));
    }

    this.Generalized = false;
    this.toggleGeneralized = function () {
        if(self.Generalized){
            self.Generalization.parent.add(self.Base);
            self.Base.position.set(
                self.Generalization.position.x,
                self.Generalization.position.y,
                self.Generalization.position.z
            )
            self.Base.parent.remove(self.Generalization);
        }else{
            self.Generalization = m(sphere(computeBounding(self.Base),30,30),fresnel_material);
            self.Base.parent.add(self.Generalization);
            self.Generalization.position.set(
                self.Base.position.x,
                self.Base.position.y,
                self.Base.position.z
            )
            self.Base.parent.remove(self.Base);
        }
        self.Generalized = !self.Generalized;
    }

    // let getBoundingRadiusGroup = function (group) {
    //     let radius = 0;
    //     for(let child of group){
    //         radius = Math.max(getBoundingRadiusGroup(child.children), radius);
    //         if(child.geometry) {
    //             child.geometry.computeBoundingSphere();
    //             radius = Math.max(radius, child.geometry.boundingSphere.radius);
    //         }
    //     }
    //     return radius;
    // }
    //

    // mouse_move.push(function (e) {
    //     let mouse = new THREE.Vector2(
    //         (e.x / window.innerWidth) * 2 - 1,
    //         -(e.y / window.innerHeight) * 2 + 1
    //     );
    //     let raycaster = new THREE.Raycaster();
    //     raycaster.setFromCamera(mouse, camera);
    //     let vector = new THREE.Vector3(0,0,0);
    //     let insect = raycaster.intersectObject(!self.Body.circle ? self.Base: self.Body.circle, true);
    //     if(insect[0]){
    //         raycaster.ray.at(insect[0].distance, vector);
    //         if(!self.Body.circle)
    //             self.Brain.Encircle();
    //         self.Base.add(self.Body.circle);
    //     }else{
    //         self.Base.remove(self.Body.circle);
    //     }
    // });
}



addBody('Fresnel Material', fresnel_material);
addBody('Sphere', sphere);
addBody('Mesh', m);
addBody('Cylinder', cyl);

addBody('Droplet Needle Torus Mesh', function(w={}){
    let noKit = !w['Kits'] || !w['Kits']['Needle Torus'];
    let kit = noKit ? {} : w['Kits']['Needle Torus']
    let needle_graphic =
        getBody('Mesh')(
            new THREE.TorusGeometry(
                (noKit || !kit['Radius'])       ? 12/6      : kit['Radius'],
                (noKit || !kit['Thickness'])    ? 1.25/6    : kit['Thickness'],
                (noKit || !kit['Parts'])        ? 100       : kit['Parts'],
                (noKit || !kit['Parts'])        ? 100       : kit['Parts']
            ),
            getBody('Fresnel Material')
    );
    return needle_graphic;
});

addBody('Droplet Needle Water Circle', function (w={}) {
    let noKit = !w['Kits'] || !w['Kits']['Needle Water Circle'];
    let kit = noKit ? {} : w['Kits']['Needle Water Circle'];
    return getBody('Water')({
                Kits : {
                    Water : {
                        Geometry :
                            new THREE.CircleGeometry(
                                (noKit || !kit['Radius'])   ? 10.75/6   : kit['Radius'],
                                (noKit || !kit['Parts'])    ? 100       : kit['Parts']
                            )
                    }
                }
            });
});

addBody('Water', function (w={}) {
    let water_parameters = {
        color: '#0a81ff',
        scale: .2,
        flowX: 1,
        flowY: -1
    };
    let textureLoader = new THREE.TextureLoader();
    let water = new THREE.Water( w['Kits']['Water']['Geometry'], {
        color: water_parameters.color,
        scale: water_parameters.scale,
        flowDirection: new THREE.Vector2( water_parameters.flowX, water_parameters.flowY ),
        // flowMap : textureLoader.load( 'Water_1_M_Flow.jpg' ),
        textureWidth: 512,
        textureHeight: 512,
        clipBias : 0,
        flowSpeed : 0.0075,
        reflectivity : 0.02,
        shader : THREE.Water.WaterShader

    } );
    return water;
})

addBody('Droplet Needle Graphic', function (w) {
    let group = new THREE.Group();

    let needle_torus = getBody('Droplet Needle Torus Mesh')(w);
    needle_torus.rotation.y += Math.PI/2;
    group.add(needle_torus);

    let water = getBody('Droplet Needle Water Circle')(w);
    water.rotation.x = Math.PI * - 0.5;
    water.rotation.y -= Math.PI/2;
    group.add( water );

    return group;
});


addBrain('Outline Round End Tube', function (w) {
    let kit = w['Kits']['Outline Round End Tube'];
    w['Kits']['Round Ended Tube Outline'] = w['Kits']['Outline Round End Tube'];
    kit['Tube'].add(getBody('Round Ended Tube Outline')(w));
    return kit['Tube'];
});
addBody('Outlined Round Ended Tube', function (w) {
    w['Kits']['Outline Round End Tube']['Tube'] = getBody('Round End Tube')(w);
    return getBrain('Outline Round End Tube')(w);
});
addBody('Needle Search Bar Outlined Round Ended Tube', function (w={}) {
    w['Kits'] = {};
    let size = .75/4;
    let search_bar_length = size*10.75 * .65 * 2;
    let search_bar_radius = size*1.25;
    let tube_radius_ratio = 1/6;
    w['Kits']['Round End Tube'] = {
        Radius : search_bar_radius,
        Length : search_bar_length,
        Ratio : tube_radius_ratio,
    }
    w['Kits']['Outline Round End Tube'] = {
        Radius : search_bar_radius,
        Length : search_bar_length,
        Ratio : tube_radius_ratio,
        Tube : getBody('Round End Tube')(w)
    }

    return getBrain('Outline Round End Tube')(w);
});
addBody('Droplet Needle Search Bar Tube', function (w={}) {
    w['Kits'] = {};
    let size = .75/4;
    let search_bar_length = size*10.75 * .65 * 2;
    let search_bar_radius = size*1.25;
    let tube_radius_ratio = 1/6;
    w['Kits']['Round End Tube'] = {
        Radius : search_bar_radius,
        Length : search_bar_length,
        Ratio : tube_radius_ratio,
    }
    return getBody('Round End Tube')(w);
});
addBody('Droplet Needle Search Filter Tube Outline', function (w={}) {
    w['Kits'] = {};
    let size = .75/4;
    let search_bar_length = size*10.75 * .65 * 2;
    let search_bar_radius = size*1.25;
    let tube_radius_ratio = 1/6;
    w['Kits']['Round Ended Tube Outline'] = {
        Radius : search_bar_radius,
        Length : search_bar_length,
        Ratio : tube_radius_ratio,
    }
    return getBody('Round Ended Tube Outline')(w);
})
addBody('Tube', function (w) {
    let kit = w['Kits']['Tube'];
    let tube =
        getBody('Mesh')(
            getBody('Cylinder')(
                kit['Radius'],
                kit['Length']
            ),
            kit['Material'] || getBody('Fresnel Material')
        );
    tube.rotation.x += Math.PI/2;
    return tube;
});
addBody('Search Tube', function (w) {
    return getBody('Tube')({
        Kits : {
            Tube : {
                Radius : (.75/4) * 1.25,
                Length : (.75/4) * 10.75 * .65 * 2
            }
        }
    })
});
addBody('Round End Tube', function (w) {
    let group = new THREE.Group();
    let kit = w['Kits']['Round End Tube'];
    let search_bar = getBody('Tube')({
        Kits : {
            Tube : {
                Radius : kit['Radius'],
                Length : kit['Length']
            }
        }
    });
    group.add(search_bar);
    [-1,1].forEach((val) => {
        ((cap) => {
           group.add(cap);
           cap.position.z += val * kit['Length'] / 2;
        })( getBody('Mesh') (
                getBody('Sphere')(
                    kit['Radius'],
                    30,
                    30
                ),
                getBody('Fresnel Material')
            ));
    });
    return group;
});

addBody('Round Ended Tube Outline', function (w) {
    let group = new THREE.Group();
    let kit = w['Kits']['Round Ended Tube Outline'];
    CustomSinCurve.prototype.getPoint = function (t) {
        return ((radius, angle) =>
                    new THREE.Vector3(
                        radius * Math.cos(angle),
                        radius * Math.sin(angle),
                        0
                    ).multiplyScalar(this.scale)
                )(( kit['Radius'] + kit['Radius']*kit['Ratio']),
                    t * Math.PI + Math.PI/2)
    };
    let path = new CustomSinCurve(1);
    ((vertical_outline, horizontal_outline) => {
        [1,-1].forEach((val) => {
            ((v,h)=>{
                group.add(v);
                v.position.set(0,val * (kit['Radius'] + kit['Radius']*kit['Ratio']),0);
                v.rotation.x += Math.PI/2;

                group.add(h);
                h.position.set(0,0,val*kit['Length']/2);
                h.rotation.y += val*Math.PI/2;
            })(vertical_outline.clone(), horizontal_outline.clone())
        })

    })( getBody('Mesh')(
            getBody('Cylinder')(
                kit['Radius'] * kit['Ratio'],
                kit['Length']
            ),
            getBody('Fresnel Material')
        ),
        getBody('Mesh')(
            new THREE.TubeBufferGeometry(
                path,
                2000,
                kit['Radius'] * kit['Ratio'],
                50
            ),
            getBody('Fresnel Material')
        )
    )
    return group;
});


addBrain('Spiral', function (w) {
    let R = w['R'] || 2;
    let n = w['n'] || 8;
    let r =  R / (1/Math.tan(Math.PI/n) - 1);
    let precision = w['precision'] || .01;
    let material = w['material'] || msm({transparent:  true, opacity : .7, color : 'rgba(0, 191, 255, 1)'});

    let increase = r;
    let q = (t) => R + increase + r * t/Math.PI;

    let guess = function(r_1,r_2,t_1){
        let correct = Math.pow(r_1+r_2,2);
        let q_1 = q(t_1);
        let g = function (start, end) {
            let t_guess = (end-start)/2.0 + start;
            let q_2 = q(t_guess);
            let result = q_1**2.0 + q_2**2.0 - 2.0 * q_1 * q_2 * Math.cos(t_1-t_guess);
            // console.log(start, end)
            if(end - start <= precision)
                return t_guess;
            if(Math.abs(result - correct) <= precision)
                return t_guess;
            else if(result < correct){
                return g(t_guess, end, precision);
            }else return g(start, t_guess, precision);
        }
        return g(t_1, t_1 + Math.PI / 4);
    }

    let center = m(sphere(R,30,30),material);
    scene.add(center);
    let t_prev;
    let r_1;
    let started = false;
    let add_sphere = function(r_2){
        if(!started){
            increase = r_2 || r;
            started = true;
            t_prev = 0;
            r_1 = r_2;
            let first = m(sphere(increase,30,30),material);
            center.add(first);
            first.position.set(0,0,(R+increase));
            return first;
        }
        let t_guess = guess(r_1,r_2,t_prev,R,r,precision);
        t_prev = t_guess;
        r_1 = r_2;
        let next_sphere = m(sphere(r_2,30,30),material);

        center.add(next_sphere);
        let distance = R + increase + increase * (t_guess)/Math.PI;
        next_sphere.position.set(
            0,
            distance * Math.sin(t_guess + Math.PI),
            -distance * Math.cos(t_guess + Math.PI)
        );
        return next_sphere;
    }
    let add_non_sphere_mesh = function (mesh) {
        if(mesh.geometry){
            // console.log(computeBounding(mesh))
            // mesh.geometry.computeBoundingSphere();
            // console.log(mesh)
            // let placeholder = add_sphere(mesh.geometry.boundingSphere.radius);

            // console.log(computeBounding(mesh))
            let placeholder = add_sphere(computeBounding(mesh));
            center.add(mesh);
            mesh.position.set(placeholder.position.x,placeholder.position.y,placeholder.position.z);
            center.remove(placeholder);
        }
    }
    return {
        add_sphere : add_sphere,
        add_non_sphere_mesh : add_non_sphere_mesh,
        'r(t)' : guess,
        base : center,
        r : r,
        R : R,
        precision : precision,
        n : n
    }
});



function computeBounding(mesh) {
    let radius = 0;
    let meshVec = new THREE.Vector3(0,0,0);
    mesh.getWorldPosition(meshVec);
    if(mesh.children && mesh.children.length > 0) {
        for(let child of mesh.children){
            let vec = new THREE.Vector3(0,0,0);
            child.getWorldPosition(vec);
            let distance = Math.sqrt((vec.x-meshVec.x)**2+(vec.y-meshVec.y)**2+(vec.z-meshVec.z)**2);
            radius = Math.max(distance + computeBounding(child)*mesh.scale.x,radius);
        }
    }
    if(mesh.geometry) {
        mesh.geometry.computeBoundingSphere();
        radius = Math.max(radius, mesh.geometry.boundingSphere.radius*Math.max(mesh.scale.x,mesh.scale.y,mesh.scale.z));
    }
    return radius;
}

