let current_hitbox = {};
let hboxes = [];
let components = [];
let check_child = (chi, par) =>
    par === chi ||
        par.children &&
            (par.children.length !== 0 &&
            (par.children.includes(chi) || par.children.some(child => check_child(child, par))));

const SHORT_HOLD = .75; // 750ms
const LONG_HOLD = 1.5;  // 1.5s

const SHORT_FLAG = 1;
const LONG_FLAG = 2;
const NOTHING = 0;

function Component() {
    this.mat = {};
    this.geo = {};
    this.mesh = {};
    this.made = [];
    this.hitboxes = [];
    this.hitbox_effects = {};
    this.all = {};
    this.listeners = []; // function, delete name
    components.push(this);
    let self = this;


    this.onLongHold = function(e)
    {
        if(self instanceof Bubble)
            return this.onLongBubbleHold(e);
    }

    this.base = new THREE.Group();
    let mouse_in_hit_box = function (e) {
        let mouse_position = new THREE.Vector2((e.x / window.innerWidth) * 2 - 1,
            -(e.y / window.innerHeight) * 2 + 1);
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse_position, camera);
        let any = false;
        for (let index = 0; index < self.hitboxes.length; index++) {
            let intersect = raycaster.intersectObject(self.mesh[self.hitboxes[index]]);
            if (intersect[0]) {
                current_hitbox = self.hitboxes[index];
                if(self.hitbox_effects[self.hitboxes[index]])
                    self.hitbox_effects[self.hitboxes[index]](intersect[0], raycaster, mouse_position);
                any = true;
            }
        }
        if(!any)
            current_hitbox = null;
    };

    this.destroy = function () {
        components.splice(components.indexOf(this), 1);
        for(let index = 0; index < this.listeners.length; index++)
            this.listeners[index].listener.remove(this.listeners[index].name);
        for (let index = 0; index < this.made.length; index++)
            this.destroyOne(this.made[index]);
        for (let index = 0; index < this.hitboxes.length; index++)
            this.destroyOne(this.hitboxes[index]);
        this.destroyRecursive(this.base);
        for (let prop in this)
            delete this[prop];
        for (let prop in this.all)
            delete this.all[prop];
    };
    mouse_move.addLast(mouse_in_hit_box);
    this.listeners.push({listener : mouse_move, name : mouse_in_hit_box});
}

Component.prototype.draggable = function()
{
    let clock = new THREE.Clock(false);
    let total_time = 0;
    let action_flag = -1;
    let object = this;
    let saved = false;
    let self = this;
    let on_hold = function(e)
    {
        if(clock.running) {
            let mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            let vector = new THREE.Vector3(0, 0, 0);
            let insect = raycaster.intersectObject(object.base, true);
            if(insect[0] && insect.some(e => !object.hitboxes.some(f => object.mesh[f] === e.object))) {
                insect = raycaster.intersectObject(mouse_capture_mesh, true);
                raycaster.ray.at(insect[0].distance, vector);
                let delta = clock.getDelta()
                total_time += delta;
                if (total_time > SHORT_HOLD && total_time < LONG_HOLD && !saved) {
                    action_flag = SHORT_FLAG;
                    saved = true;
                    // dont follow mouse, does not work
                    // object.base.position.set(vector.z, vector.y, vector.x);
                    // put in pouch
                    // loop.all['pouch'].addItem(object);
                } else if (total_time > LONG_HOLD) {
                    action_flag = LONG_FLAG;

                    // delete orbital

                } else
                    action_flag = NOTHING;
            }else{
                controls.enableRotate = true;
                controls.enablePan = true;
                on_release(e);
            }
        }
    }
    let on_press = function(e)
    {
        if(!clock.running)
        {
            let mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            let vector = new THREE.Vector3(0, 0, 0);
            if(object.base !== undefined && object !== undefined) {
                try{
                    let insect = raycaster.intersectObject(object.base, true);
                    if (insect[0]) {
                        controls.enableRotate = false;
                        controls.enablePan = false;
                        clock.start();
                    }
                }catch(err){
                    object.base = undefined;

                    left_click.remove(on_press);
                    right_click.remove(on_press);

                    left_up.remove(on_release);
                    right_up.remove(on_release);

                    left_drag.remove(on_hold);
                    right_drag.remove(on_hold);

                }
            }else{

                left_click.remove(on_press);
                right_click.remove(on_press);

                left_up.remove(on_release);
                right_up.remove(on_release);

                left_drag.remove(on_hold);
                right_drag.remove(on_hold);
            }
        }
    }
    let on_release = function(e)
    {
        if(clock.running) {
            let delta = clock.getDelta()
            total_time += delta;
            let mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            let vector = new THREE.Vector3(0, 0, 0);
            if(object === undefined)
            {
                left_click.remove(on_press);
                right_click.remove(on_press);

                left_up.remove(on_release);
                right_up.remove(on_release);

                left_drag.remove(on_hold);
                right_drag.remove(on_hold);
                return;
            }
            let insect = raycaster.intersectObject(object.base, true);
            if(insect[0] && !saved && total_time > SHORT_HOLD && total_time < LONG_HOLD && insect.some(e => e.object.is_hitbox !== true)) {
                action_flag = SHORT_FLAG;
                saved = true;
                // dont follow mouse, does not work
                // object.base.position.set(vector.z, vector.y, vector.x);
                // put in pouch
                loop.all['pouch'].addItem(object);
            }else if (insect[0] && total_time > LONG_HOLD && insect.some(e => e.object.is_hitbox !== true)){

                self.onLongHold(e);
            }
            clock.stop();
            if (action_flag === SHORT_FLAG) {

            } else if (action_flag === LONG_FLAG) {

            }
            action_flag = -1;
            total_time = 0;
            clock = new THREE.Clock(false);
            controls.enableRotate = true;
            controls.enablePan = true;
        }
    } // remove on destroy()
    left_click.addLast(on_press);
    right_click.addLast(on_press);

    left_up.addLast(on_release);
    right_up.addLast(on_release);

    left_drag.addLast(on_hold);
    right_drag.addLast(on_hold);
    this.listeners.push({listener : left_click, name : on_press});
    this.listeners.push({listener : right_click, name : on_press});
    this.listeners.push({listener : left_up, name : on_release});
    this.listeners.push({listener : right_up, name : on_release});
    this.listeners.push({listener : left_drag, name : on_hold});
    this.listeners.push({listener : right_drag, name : on_hold});
}

Component.prototype.add = function (w) {
    for (let prop in w)
        this.all[prop] = w[prop];
};

Component.prototype.makeHitbox = function (name, scaled_geo) {
    let hitbox_name = name + " hitbox";
    this.geo[hitbox_name] = scaled_geo;
    this.mat[hitbox_name] = hitbox_material.clone();
    this.mesh[hitbox_name] = new THREE.Mesh(this.geo[hitbox_name], this.mat[hitbox_name]);
    this.hitboxes.push(hitbox_name);
    this.mesh[name].add(this.mesh[hitbox_name]);
    this.mesh[hitbox_name].is_hitbox = true;
    hboxes.push({name : name, hitbox_name : hitbox_name, geo : scaled_geo, self : this});
};

Component.prototype.addGeo = function (name, geo) {
    this.geo[name] = geo;
};

Component.prototype.addMat = function (name, mat) {
    this.mat[name] = mat;
};

Component.prototype.makeMesh = function (name) {
    this.mesh[name] = new THREE.Mesh(this.geo[name], this.mat[name]);
    this.made.push(name);
    this.base.add(this.mesh[name]);
};


Component.prototype.destroyRecursive = function (object) {
    // (((self) => [[object, () => {}],
    //  [object.children, (no_children, obj) =>
    //  !no_children ? obj[0].forEach(child => {
    //      self.destroyRecursive(child)
    //      true
    //  }) : false
    //  ]].forEach(
    //      obj => [undefined, null].some(val => obj[1](obj[0] === val, obj))))(this))
    //     ?
    //         ['geometry',
    //          'material'
    //         ].forEach(prop =>
    //             [undefined, null].every(val => object[prop] !== val) ? object[prop].dispose() : {})
    //     : {};
    if(object.children !== undefined)
        object.children.forEach(child => this.destroyRecursive(child));
    if (object.geometry !== undefined && object.geometry !== null) {
        object.geometry.dispose();
        delete object.geometry;
    }
    if (object.material !== undefined && object.material !== null) {
        object.material.dispose();
        delete object.material;
    }
    if (object !== undefined && object.parent !== undefined && object !== null && object.parent !== null)
        object.parent.remove(object);
};

/*
*     (((self) => [[object, () => {}],
     [object.children, (obj) =>
     obj[0].forEach(child => {
         self.destroyRecursive(child)
         true
     })
     ]].forEach(
         obj => [undefined, null].some(val => obj[0] === val) ? {} : () => {
                 obj[1](obj)
                 ['geometry',
                 'material'
                 ].forEach(prop =>
                     [undefined, null]
                         .every(val =>
                             object[prop] !== val)
                     ? object[prop].dispose() : {})
                 [undefined, null]
                     .forEach(val =>
                         ((par) =>
                             [object, par]
                                 .every(obj =>
                                     obj !== val)
                             ? par.remove(object) : {})
                         (object.parent))}
    ))(this))
*
* */

Component.prototype.destroyOne = function (name) {
    ((DISPOSE) =>
            [['geo', DISPOSE],
            [ 'mat', DISPOSE],
            [ 'mesh',(self, prop, name) => scene.remove(self[prop][name])]
            ].forEach(prop =>
                ((self) =>
                    (() =>
                        {[undefined, null]
                            .every(val =>
                                ((obj, val) =>
                                    obj !== val)
                                (self[prop[0]][name], val))
                            ? prop[1](self, prop[0], name) : {}
                        delete self[prop[0]][name]
                    })()
                )(this)))
    ((self, prop, name) => self[prop][name].dispose())
};

Component.prototype.addListener = function(callback, loop = null, include_hitboxes = false)
{
    if(!this.all['listeners'])
        this.all['listeners'] = [];
    let on_click = make_listener(this, callback, include_hitboxes);
    if(loop) {
        loop.addLast(on_click);
        this.listeners.push({listener : loop, name : on_click})
    }
    this.all['listeners'].push(on_click);
    return on_click;
}


