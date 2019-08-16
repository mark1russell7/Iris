let entries = [];
addEntry(
    en(
        'Entry',
        [],
        ps(
            [],
            [
                p('name', 'string', '', 'the name of this entry', undefined),
                p('radius', 'number', 0, 'the radius of the entry bubble', undefined),
                p('sample size ratio', 'number', 0, 'ratio between the bounding radius of the sample instantation object to the radius of the entry bubble', undefined),
                p('pool bubble material', 'THREE.Material', {}, 'material of the surrounding sphere', undefined),
                p('result', 'Array', [0,''], 'the result of the search', undefined),
                p('data converter', 'function', () => {}, 'data converter', undefined),
                p('Parameter Values', 'object', {}, 'param values', undefined),
            ]
        )
    ),(function (w) {
        Object.assign(this,w);
        entries.push(this);
        this.Base = getEntry('Add Entry Drag Finder')(this)(w);
        if(w['initial parent'])
            w['initial parent']['add'](this['Base'])
        this.Showing = false;
        this.Selected = false;
        this.Listeners = [];
        this.Offset = 0;
        this['drag end handlers'] = {};
        this['drag handlers'] = {};
        this['Active Parameters'] = [];
        this.Parameters = [];
        this['Parameter Values'] = {};
        this['Promise'] =
            ge('Promise many W-Based')({
                w : w,
                each : [
                    (w) => this['Selection Halo'] = getEntry('Selection Halo')(this),
                    (w) => this['Initialize Parameters'] = getEntry('Book Entry Initialize Parameters')(this),
                    (w) => this['Update Instantiation'] = getEntry('Book Entry Update Instantiation')(this),
                    (w) => this['Make Draggable'] = getEntry('Make Draggable Entry')(this),
                    (w) => this['Clone'] = getEntry('Clone Entry')(this),
                    (w) => this['updateValue'] = getEntry('Book Entry Update Value')(this),
                    (w) => this['Update Sample'] = getEntry('Book Entry Update Sample')(this),
                    (w) => this['Show Graphic'] = getEntry('Book Entry Show Graphic')(this),
                    (w) => this['Hide Graphic'] = getEntry('Book Entry Hide Graphic')(this),
                    (w) => this['Dispose'] = getEntry('Dispose Entry')(this),
                ]
            }).all(
                (done) => {
                    ASQ().then((done)=>{this['Initialize Parameters'](w);done()});
                    done()
                },
                (done) => {
                    ASQ().then((done)=>{this['Make Draggable']({});done()});
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{this['Show Graphic'](w);done()});
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{this['Show Parameters'] = getEntry('Book Entry Show Parameters')(this); done()})
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{this['Hide Parameters'] = getEntry('Book Entry Hide Parameters')(this); done()})
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{getEntry('Entry Mouse Over Intersection')(this);done()});
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{getEntry('Entry Left Down Intersection')(this);done()});
                    done();
                },
                (done) => {
                    ASQ().then((done)=>{getEntry('Entry Right Down Intersection')(this);done()});
                    done();
                }
            ).then((done)=>done(this));





    })
)
non_instantiate.add('Entry');


addEntry(
    en(
        'Entry Add Listener',
        [],
        ps(
            [
                p(
                    'Handler',
                    'function',
                    undefined,
                    'the function to call on an interaction',
                    ps(
                        [],
                        []
                    )
                ),
                p('type', 'string', '', 'the type of listener to create', undefined),
            ],
            [
                p('Listener Object', 'object', undefined, 'the object on which to capture interaction', undefined),
                p('Handler Name', 'string', '', 'what to call the interaction listener', undefined),
            ]
        )
    ), (self) => (w) => {
        if(ge('undefined')({object : w['Listener Object']}))
            ge('Add Entry Drag Finder')(self)(w);
        self[w['Handler Name']] =
            new (ge('Object Interaction Listener'))({
                type : w['type'],
                handler : w['Handler'],
                'no interaction' : w['no interaction'],
                object : ge('dod')({value : w['Listener Object'], default : self['Drag Finder']}),
                recursive : ge('dod')({value : w['recursive'], default : false}),
        });
        self[w['Handler Name']].add();
        self['Listeners'].push(self[w['Handler Name']])
    }
)
non_instantiate.add('Entry Add Listener');
non_instantiate.add('Entry Selected Handler')
addEntry(
    en(
        'Entry Selected Handler',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {
        if(self['Selected'] === false) {
            self['Selected'] = true;
            self['Base']['add'](self['Selection Halo'])
        }
    }
)
non_instantiate.add('Entry Mouse Over Handler')
addEntry(
    en(
        'Entry Mouse Over Handler',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {
        if(self['Showing'] === false) {
            self['Showing'] = true;
            self['Show Parameters'](w);
        }
    }
)
non_instantiate.add('Entry Mouse Out Handler')
addEntry(
    en(
        'Entry Mouse Out Handler',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {
        if(!self['Selected'] === true) {
            self['Showing'] = false;
            self['Hide Parameters'](w)
        }
    }
)
non_instantiate.add('Entry Selected Handler');
addEntry(
    en(
        'Entry De-Selected Handler',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {
        if(self['Selected'] === true) {
            self['Selected'] = false;
            self['Base']['remove'](self['Selection Halo'])
        }
        if(self['Showing'] === true)
            self['Hide Parameters'](w)
    }
)

non_instantiate.add('Entry De-Selected Handler');

addEntry(
    en(
        'Add Entry Drag Finder',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {
        if(ge('undefined')({object : self['Drag Finder']})){
            self['Drag Finder'] = ge('Mesh')({
                Geometry : ge('Sphere')({
                    radius : self['radius']*1.3,
                    parts : 5,
                }),
                Material : ge('mbm')({
                    transparent : true,
                    opacity : 0,
                    depthWrite : false,
                    depthTest : false
                })
            });
            self['Drag Finder'].entry = self;

            // self['Drag Out Finder'] = ge('Mesh')({
            //     Geometry : ge('Sphere')({
            //         radius : self['radius']*2,
            //         parts : 5,
            //     }),
            //     Material : ge('mbm')({
            //         transparent : true,
            //         opacity : 0,
            //         depthWrite : false,
            //         depthTest : false
            //     })
            // });
            // self['Drag Out Finder'].entry = self;

            // let glob = new THREE.Vector3(0,0,0);
            // self['Base'].getWorldPosition(glob);
            // let par = self['Base']['parent'];
            // self['Drag Finder'].add(self['Base']);
            // if(par)
            //     par.add(self['Drag Finder']);
            // self['Base'] = self['Drag Finder'];
        }
        return self['Drag Finder'];
    }
)

non_instantiate.add('Add Entry Drag Finder');

non_instantiate.add('Make Draggable Entry')
addEntry(
    en(
        'Make Draggable Entry',
        [],
        ps(
            [],
            []
        )
    ), (self) => (w) => {



        // ge('Add Entry Drag Finder')(self)(w);
        //
        //
        //
        let position = self['Base']['position'].clone();

        self['Dragger'] = new (ge('Make Object Draggable On Axes'))({
            object : self['Drag Finder'],
            Axes: ['x','y','z'],
            'Drag Plane' : sphere,
            recursive : false,
            pred : (w) => follower === undefined ^ follower !== self['Base'],

            'on drag end handler' : (o) => {
                if(follower) {
                    follower.entry.Scaled = false;
                    follower.scale.multiplyScalar(7);

                    for(let handler in self['drag end handlers'])
                        self['drag end handlers'][handler]({entry : follower.entry})
                    follower = undefined;
                }
            },
            'On Change' : (o) => {

                if(!self['Cloned'] && !follower){
                    self['Scaled'] = true;
                    self['Cloned'] = true;
                    let base = self['Book']['Base'];
                    self['Clone'](base)
                        .then(
                            (done, copy) => {
                                if(self['Book']['Active Bubbles'][self['name']])
                                    self['Book']['Active Bubbles'][self['name']]['item'] = copy['Base'];
                                else if(self['Book']['Active Bubbles'][nicknames[self['name']]])
                                    self['Book']['Active Bubbles'][nicknames[self['name']]]['item'] = copy['Base'];
                                else console.error(copy,self['Book'], self['name'], nicknames[self['name']]);
                                self['Book']['Base']['remove'](self['Base']);
                                scene['add'](self['Base']);
                                self['Book']['entries'][copy['name']] = copy;
                                position = ge('dod')({
                                    value : self['Base']['position save'],
                                    default : position
                                });
                                copy['Base']['position']['set'](
                                    position['x'],
                                    position['y'],
                                    position['z'],
                                );
                                copy.Base['position save'] = self['Base']['position save'];
                                copy.Base.entry = copy;
                                follower = self['Base'];
                                self['Base'].scale.multiplyScalar(1/7);
                                if(self['Mac Scaled'])
                                    copy['Mac Scaled'] = undefined;
                                for(let handler in self['drag handlers'])
                                    self['drag handlers'][handler]({entry : follower.entry})
                                done();
                            }
                        )
                }else if(!self['Scaled']){
                    if(self['Mac Scaled'] === true) {
                        self['Base']['scale']['multiplyScalar'](1 / 2);
                        self['Mac Scaled'] = false;
                    }
                    self['Scaled'] = true;
                    follower = self['Base'];

                    self['Base'].scale.multiplyScalar(1/7);

                    for(let handler in self['drag handlers'])
                        self['drag handlers'][handler]({entry : follower.entry})
                }

            },
            'exclude' : self['Parameter Slider'],
            'move object' : self['Base'],
            'Add Drag Plane To Base' : false
        });
        self['Base']['add'](self['Dragger']['Base'])
        self['Dragger'].add();
        self['Listeners'].push(self['Dragger'])

        draggers.push(self['Drag Finder']);
        draggerEntries.push(self);
    }
)


non_instantiate.add('Clone Entry')
addEntry(
    en(
        'Clone Entry',
        [],
        ps(
            [],
            []
        )
    ),((self) => {
        return (w) => {
            let entry = new (ge('Entry'))({
                Book : self['Book'],
                name : self['name'],
                'Data Converter' : self['Data Converter'],
                'Parameter Values' : self['Parameter Values'],
                radius : self['radius'],
                result : self.result,
                'initial parent' : w
            });
            return entry.Promise.then(
                (done) => {
                    done(entry)
                }
            )
        }
    })
)


non_instantiate.add('Dipose Entry')
addEntry(
    en(
        'Dispose Entry',
        [],
        ps(
            [],
            []
        )
    ),((self) => {
        return (w) => {
            // do more
            if(self['Cloned'] === false) {
                if (self['Parameters Constructed'] === true)
                    for (let parameter of self['Parameters'])
                        parameter['Dispose']();
                self['Parameters Constructed'] = undefined;
                ge('Dispose Parameter')(self)({})
            }
            self['Listeners']
                .forEach(
                    listener => listener.remove()
                )
            entries.splice(entries.indexOf(self['Base']), 1);
            if(self['rotating']) {
                rotates.splice(rotates.indexOf(self['rotater']), 1)
                delete self['rotating'];
                delete self['rotates'];
            }

            draggers.splice(draggers.indexOf(self['Drag Finder']),1);
            draggerEntries.splice(draggerEntries.indexOf(self['Drag Finder']),1);
            entries.splice(entries.indexOf(self),1);
        }
    })
)

non_instantiate.add('Book Entry Initialize Parameters')
addEntry(
    en(
        'Book Entry Initialize Parameters',
        [],
        ps(
            [
                p('name', 'string', '', 'the name of this entry', undefined),
                p('radius', 'number', 0, 'the radius of the entry bubble', undefined),
            ],[]
        )
    ),((self) => {
        return (w) => {
            let Parameter = getEntry('Parameter');
            getEntry('Visit Entry Parameters')({name : self['name'], radius : self['radius'], visit : (w) => {
                    self['Parameter Values'][w['parameter']['name']] = this[w['parameter']['name']] || w['parameter']['default'];

                }})
        }
    })
)
non_instantiate.add('Visit Entry Parameters')
addEntry(
    en(
        'Visit Entry Parameters',
        [],
        ps(
            [],
            []
        )
    ),( (w) => {
        if(getMeta(w['name'])['parameters']['parameters'].required !== undefined && getMeta(w['name'])['parameters']['parameters'].required.length > 0) {
            for (let parameter of getMeta(w['name'])['parameters']['parameters'].required) {
                w['visit']({...w, parameter : parameter})
            }
        }
        if(getMeta(w['name'])['parameters']['parameters'].optional !== undefined && getMeta(w['name'])['parameters']['parameters'].optional.length > 0) {
            for (let parameter of getMeta(w['name'])['parameters']['parameters'].optional) {
                w['visit']({...w, parameter : parameter})
            }
        }
    })
)
let draggers = [];
let draggerEntries = [];
non_instantiate.add('Book Entry Update Instantiation')
addEntry(
    en(
        'Book Entry Update Instantiation',
        [],
        ps([],[])
    ),((self)=>{
        return (w) =>{

            if(self.exploder){
                let EntryObject = getEntry(self['name']);
                self['Instantiation'] = EntryObject;
                self['Instantiation']['entry'] = self;
                return;
            }

            if(non_instantiate.has(self['name'])) {
                self['Instantiation'] = getEntry('Mesh')({
                    Geometry: getEntry('Sphere')({
                        radius: self['radius'],
                        parts: 30
                    }), Material: fresnel_material
                })
                self['Instantiation']['entry'] = self;
            }else {
                let EntryObject = getEntry(self['name']);
                // console.log(EntryObject)

                if(EntryObject.prototype !== undefined){
                    self['Instantiation'] = new EntryObject((self['Parameter Values']));

                    self['Instantiation']['entry'] = self;
                    if(self['Instantiation'] instanceof THREE.Object3D || self['Instantiation'] instanceof THREE.Group)
                    {
                    }
                    else if(self['Instantiation']['Base'] !== undefined) {
                        self['Instantiation'] = self['Instantiation']['Base']
                        self['Instantiation']['entry'] = self;
                    }else if(typeof (self['Instantiation'].__proto__) !== 'object'){
                        try {
                            // console.log(self['Parameter Values'])

                            self['Instantiation'] = EntryObject(self['Parameter Values']);
                            // console.log(self['Instantiation'], EntryObject)
                            self['Instantiation']['entry'] = self;

                            // console.log(self['name'], self['Instantiation'], self['Parameter Values'], self['Instantiation'].prototype)
                        }catch (e) {
                            self['Instantiation'] = EntryObject;
                            // console.log(self['Instantiation'], self, self['Parameter Values'],e)
                            self['Instantiation']['entry'] = self;
                        }
                    }
                    self['Instantiation']['entry'] = self;
                }else{
                    try {
                        // console.log(self['Parameter Values'])

                        let ret = EntryObject(self['Parameter Values']);
                        if(ret)
                            self['Instantiation'] = ret;
                        else{
                            self['Instantiation'] = getEntry('Mesh')({
                                Geometry: getEntry('Sphere')({
                                    radius: self['radius'],
                                    parts: 30
                                }), Material: fresnel_material
                            })
                        }

                        self['Instantiation']['entry'] = self;

                        // console.log(self['name'], self['Instantiation'], self['Parameter Values'], self['Instantiation'].prototype)
                    }catch (e) {
                        self['Instantiation'] = EntryObject;
                        // console.log(self['Instantiation'], self, self['Parameter Values'],e)
                        self['Instantiation']['entry'] = self;
                    }
                }

                // try {
                //
                // } catch (e) {
                //     try {
                //         self['Instantiation'] = EntryObject(self['Parameter Values'])
                //         // console.log(self['name'], self['Instantiation'], self['Parameter Values'], self['Instantiation'].prototype)
                //         // console.log(self['Instantiation'])
                //     }catch (e) {
                //         self['Instantiation'] = EntryObject;
                //         // console.log(self['Instantiation'], self, self['Parameter Values'])
                //     }
                //
                // }
            }
        }
    })
)

non_instantiate.add('Book Entry Update Value')
addEntry(
    en(
        'Book Entry Update Value',
        [],
        ps([

        ],[
            p('parameter', 'Object', {}, 'parameter whose value is to be updated', undefined),
            p('value', 'Object', {}, 'the value to set the parameter to', undefined)
        ])
    ), ((self) =>{
        return (w) => {
            let EntryObject = getEntry(self['name']);
            EntryObject = getEntry(self['name']);
            try{
                // console.log(w, EntryObject, self)
                if(w['parameter']['type'] === 'any'){
                    self['Parameter Values'][w['parameter']['name']] = w['value'];
                    self['Update Sample']({});
                }else{
                    let type = eval(w['parameter']['type']);
                    let obj = new type();
                    // console.log(w)
                    if(w['value'] instanceof type){
                        self['Parameter Values'][w['parameter']['name']] = w['value'];
                        self['Update Sample']({});
                    }
                }
            }catch (e) {
                if((typeof w['value']) === w['parameter']['type']) {
                    self['Parameter Values'][w['parameter']['name']] = w['value'];
                    self['Update Sample']({});
                }
            }
        }
    })
)

non_instantiate.add('Book Entry Show Parameters')
addEntry(
    en(
        'Book Entry Show Parameters',
        [],
        ps([
        ],[

        ])
    ),( (self) => {
        return (w) => {
            if(self['Parameters Constructed'] === undefined)
            {
                let Parameter = getEntry('Parameter');
                getEntry('Visit Entry Parameters')({name : self['name'], radius : self['radius'], visit : (w) => {
                    let parameter = new Parameter({
                        ...w['parameter'],
                        'entry radius' : self['radius'],
                        entry : self,
                    });
                    self['Parameters'].push(parameter);

                }});
                self['Parameters Constructed'] = true;
            }

            if(!self['Parameter Slider'])
                self['Parameter Slider'] = ge('Parameter Slider')({
                entry : self
            });
            else self['Base']['add'](self['Parameter Slider']);

            let count = 0;
            let offset = self['Offset'] || 0;
            let pos1 = new THREE.Vector3(0,0,0);
            self.Base.getWorldPosition(pos1);
            // console.log(Math.sqrt((camera.position.x-pos1.x)**2+(camera.position.y-pos1.y)**2+(camera.position.z-pos1.z)**2))
            if(!self['Mac Scaled'] && 20 <= Math.sqrt((camera.position.x-pos1.x)**2+(camera.position.y-pos1.y)**2+(camera.position.z-pos1.z)**2)) {
                self['Base']['scale']['multiplyScalar'](2);
                self['Mac Scaled'] = true;
            }
            for(let parameter of self['Parameters']){
                if(offset !== 0) {offset--; continue;}
                self['Base'].add(parameter.Base);
                self['Active Parameters'].push(parameter);
                parameter.Base.position.set(
                    (self['radius'] * (1 + 1 / 6)) * Math.cos( Math.PI/4 + -2.5*(count) * Math.atan((self['radius'] / 6) / (self['radius'] * (1 + 1 / 6)))) - self['radius'],
                    (self['radius'] * (1 + 1 / 6)) * Math.sin( Math.PI/4 + -2.5*(count) * Math.atan((self['radius'] / 6) / (self['radius'] * (1 + 1 / 6)))),
                    0
                );
                count++;
                if(count === 6) break;
            }



        }
    })
)

non_instantiate.add('Parameter Slider')

addEntry(
    en(
        'Parameter Slider',
        [],
        ps([],[])
    ), (w) => {

        let st = new (ge('Number Slider'))({
            'On Change' : (o) => {
                // console.log(st['Current Value']);
                let res = Math.exp((-(4*(st['Current Value']))));
                // console.log(res);
                // // controls.rotateSpeed = res;
                // controls.zoomSpeed = res;
                // controls.panSpeed = res;
                console.log(res)
                w['entry']['Offset'] = Math.round(res);


            }
        });
        st.Dragger['Drag Plane'].scale.multiplyScalar(10);
        w['entry']['Base'].add(st.Base);
        st.Dragger.add();
        // let dist = 5;

        // st.Base.position.z = -dist;
        // st.Base.position.z = -w['parameter']['entry radius'];
        st.Base.position.x = -w['entry']['radius']*1.2;
        // st.Base.position.y = -w['parameter']['entry radius'];
        st.Base.rotation.y = -Math.PI/2;
        st['Dragger']['Change Axes']({
            Axes : ['z'],
        })
        st['respect to object']({object : st['Base']})
        // st.Base.scale.multiplyScalar(1/7);
        st.Base.add(new THREE.AxesHelper(5))
        st.Base.rotation.y += Math.PI/2;
        st.Base.rotation.x += Math.PI/2;
        st.Base.rotation.z += Math.PI/2;
        return st.Base;


    }
)

non_instantiate.add('Book Entry Hide Parameters')
addEntry(
    en(
        'Book Entry Hide Parameters',
        [],
        ps([

        ],[

        ])
    ),((self) => {
        return (w) => {
            for(let parameter of self['Active Parameters'])
                self['Base'].remove(parameter.Base);
            self['Active Parameters'] = [];
           self['Base'].remove(self['Delete Button']);
           if(self['Mac Scaled'] === true) {
               self['Base']['scale']['multiplyScalar'](1 / 2);
               self['Mac Scaled'] = false;
           }
           if(self['Parameter Slider'])
               self['Base']['remove'](self['Parameter Slider']);
        }
    })
)


non_instantiate.add('Book Entry Update Sample')
addEntry(
    en(
        'Book Entry Update Sample',
        [],
        ps([

        ],[

        ])
    ),((self) => (w) => {
            self['Update Instantiation'](w);

            let prev_sample = self['Sample'];

            let prev_undef = !getEntry('not undefined')({object : prev_sample});



            if(self['Instantiation']['Promise'])
                self['Instantiation']['Promise'].then((done) => {
                    if(getEntry('not undefined')({object : self['Data Converter']}))
                        self['Sample'] = self['Data Converter']({entry : self})
                    else if(self['Instantiation'] instanceof THREE.Object3D || self['Instantiation'] instanceof THREE.Group)
                        self['Sample'] = self['Instantiation']
                    else if(self['Instantiation'] !== undefined && self['Instantiation']['Base'] instanceof THREE.Group){
                        self['Sample'] = self['Instantiation']['Base'];
                    } else{
                        if(getEntry('not undefined')({object : self['Instantiation']}) && getEntry('not undefined')({object : self['Instantiation']['Base']})){
                            self['Sample'] = self['Instantiation']['Base']
                        }else{
                            if(non_instantiate.has(self['name']))
                                self['Sample'] = self['Instantiation']
                            else{
                                let Mesh = getEntry('Mesh');
                                let Sphere = getEntry('Sphere');
                                self['Sample'] = Mesh({
                                    Geometry: Sphere({radius: self['radius'], parts: 30}),
                                    Material: fresnel_material
                                });
                            }
                        }
                    }

                    if(prev_sample !== self['Sample']) {
                        self['Graphic'].add(self['Sample']);
                        if(!prev_undef)
                            self['Graphic'].remove(prev_sample);
                    }

                    let radius = ge('Compute Bounding Radius')({item : self['Sample']});
                    self['Sample'].scale.multiplyScalar((1/(radius))*self['radius'] * (self['sample size ratio'] || .65));

                    if(!non_instantiate.has(self['name'])) {
                        ASQ().then(
                            (done)=>{
                                if (!self['rotating']) {
                                    self['reset rotation'] = self['Base']['rotation']['clone']();
                                    self['rotating'] = true;
                                    self['rotater'] = (delta) => {
                                        self['Sample'].rotation.x += delta/3;
                                        self['Sample'].rotation.y += delta/3;
                                    }
                                    rotates.push(self['rotater'])
                                }
                                done();
                            }
                        )
                    }
                    done();
                })
            else{
                if(getEntry('not undefined')({object : self['Data Converter']}))
                    self['Sample'] = self['Data Converter']({entry : self})
                else if(self['Instantiation'] instanceof THREE.Object3D || self['Instantiation'] instanceof THREE.Group)
                    self['Sample'] = self['Instantiation']
                else if(self['Instantiation'] !== undefined && self['Instantiation']['Base'] instanceof THREE.Group){
                    self['Sample'] = self['Instantiation']['Base'];
                } else{
                    if(getEntry('not undefined')({object : self['Instantiation']}) && getEntry('not undefined')({object : self['Instantiation']['Base']})){
                        self['Sample'] = self['Instantiation']['Base']
                    }else{
                        if(non_instantiate.has(self['name']))
                            self['Sample'] = self['Instantiation']
                        else{
                            let Mesh = getEntry('Mesh');
                            let Sphere = getEntry('Sphere');
                            self['Sample'] = Mesh({
                                Geometry: Sphere({radius: self['radius'], parts: 30}),
                                Material: fresnel_material
                            });
                        }
                    }
                }

                if(prev_sample !== self['Sample']) {
                    self['Graphic'].add(self['Sample']);
                    if(!prev_undef)
                        self['Graphic'].remove(prev_sample);
                }

                let radius = ge('Compute Bounding Radius')({item : self['Sample']});
                self['Sample'].scale.multiplyScalar((1/(radius))*self['radius'] * (self['sample size ratio'] || .65));

                if(!non_instantiate.has(self['name'])) {
                    ASQ().then(
                        (done)=>{
                            if (!self['rotating']) {
                                self['reset rotation'] = self['Base']['rotation']['clone']();
                                self['rotating'] = true;
                                self['rotater'] = (delta) => {
                                    self['Sample'].rotation.x += delta/3;
                                    self['Sample'].rotation.y += delta/3;
                                }
                                rotates.push(self['rotater'])
                            }
                            done();
                        }
                    )
                }
            }





        }
    )
)
non_instantiate.add('Book Entry Hide Graphic')

addEntry(
    en(
        'Book Entry Hide Graphic',
        [],
        ps([

        ],[

        ])
    ),((self)=>{
        return (w)=>{
            if(getEntry('not undefined')({object : self['Graphic']})) {
                self['Base'].remove(self['Graphic']);
                self['Graphic'] = undefined;
            }

        }
    })
)
non_instantiate.add('Book Entry Show Graphic')


addEntry(
    en(
        'Book Entry Show Graphic',
        [],
        ps(
            [
                p('radius', 'number', 0, 'the radius of the entry bubble', undefined),
                p('pool bubble material', 'THREE.Material', undefined, 'material of the surrounding sphere', undefined),
                p('result', 'Array', [0,''], 'the result of the search', undefined),

            ],
            []
        )
    ),
    ( (self) => (w) =>{
            if(getEntry('not undefined')({object : self['Graphic']}))
                self['Base'].remove(self['Graphic']);
            self['Graphic'] = new THREE.Group();
            self['Base'].add(self['Graphic']);

            self['Update Sample'](w);

            self['Surrounding Sphere'] = (getEntry('Book Entry Surrounding Sphere'))({
                    radius : w['radius'],
                    'Surrounding Material' : w['pool bubble material'],
                });
            self['Graphic'].add(self['Surrounding Sphere']);


            let name_tube = new (getEntry('Book Entry Name Tube'))({radius : w['radius']});
            self['Graphic'].add(name_tube['Base']);

            name_tube['Base'].rotation.z += Math.PI / 2;
            name_tube['Name Tube'].rotation.x += Math.PI / 2;
            name_tube['Base'].position.y += w['radius'] * 1.275;

            let tube_text = new (getEntry('Tube Text'))({
                Geometry: name_tube['Name Tube'].geometry.clone(),
                Text: w['result'][1],
            });
            name_tube['Base'].add(tube_text.Base);
            tube_text.Base.rotation.y -= Math.PI/3;

        }
    )
)

addEntry(
    en(
        'Book Entry Name Tube',
        [],
        ps([
            p('radius', 'number', 0, 'the radius of the name tube', undefined),
        ],[
            p('Name Tube Material', 'THREE.Material', fresnel_material, 'material of the name tube', undefined),
            p('height parts', 'number', 30, 'number of height parts used for rendering the name tube', undefined),
            p('radial parts', 'number', 30, 'number of radial parts used for rendering the name tube', undefined),

        ])
    ),(function (w) {
        Object.assign(this,w);
        this['Base'] = new THREE.Group();
        let Tube = getEntry('Round Ended Tube');
        this['Name Tube'] = new Tube({
            radius: .15 * w['radius'],
            height: w['radius'] * 1.4,
            Material: getEntry('not undefined')({object : w['Name Tube Material']}) ? w['Name Tube Material'] : fresnel_material,
            'height parts': getEntry('not undefined')({object : w['height parts']}) ? w['height parts'] : 30,
            'radial parts': getEntry('not undefined')({object : w['radial parts']}) ? w['radial parts'] : 30
        });

        // let p = (new Tube({
        //     radius: .15 * w['radius'] * 1.001,
        //     height: w['radius'] * 1.4,
        //     Material: new THREE.MeshBasicMaterial({color : 'black', transparent : true, opacity : .05}),
        //     'height parts': getEntry('not undefined')({object : w['height parts']}) ? w['height parts'] : 30,
        //     'radial parts': getEntry('not undefined')({object : w['radial parts']}) ? w['radial parts'] : 30
        // }))
        // p.rotation.x += Math.PI / 2;
        // this['Base'].add(p)
        this['Base'].add(this['Name Tube']);
    })
)




addEntry(
    en(
        'Book Entry Surrounding Sphere',
        [],
        ps([

        ],[
            p('Surrounding Geometry', 'THREE.BufferGeometry', undefined, 'geometry of the surrounding sphere', undefined),
            p('radius', 'number', 1, 'radius of the surrounding sphere', undefined),
            p('parts', 'number', 30, 'radial parts used for the surrounding sphere', undefined),
            p('Surrounding Material', 'THREE.Material', fresnel_material, 'Material for the sphere', undefined),
            p('transparent', 'boolean', true, 'whether the sphere is transparent', undefined),
            p('opacity', 'number', .025, 'opacity of the sphere', undefined),
            p('color', 'THREE.Color', '#0000ff', 'color of the sphere', undefined),


        ])
    ),( (w) => getEntry('Mesh')({
            Geometry : getEntry('not undefined')({object : w['Surrounding Geometry']}) ? w['Surrounding Geometry'] : getEntry('Sphere')({
                radius : getEntry('not undefined')({object : w['radius']}) ? w['radius'] : 1,
                parts : getEntry('not undefined')({object : w['parts']}) ? w['parts'] : 30
            }),
            Material : getEntry('not undefined')({object : w['Surrounding Material']}) ? w['Surrounding Material'] : getEntry('msm')({
                transparent: getEntry('not undefined')({object : w['transparent']}) ? w['transparent'] : true,
                opacity: getEntry('not undefined')({object : w['opacity']}) ? w['opacity'] : .025,
                color: getEntry('not undefined')({object : w['color']}) ? w['color'] : 'blue'
            })
        }))
        // this['Base'].add(this['Surrounding Sphere']);
        // return

)



addEntry(
    en(
        'Selection Halo',
        [],
        ps(
            [],
            [
                p(
                    'Material',
                    'THREE.Material',
                    ge('mbm')({
                        color : ge('THREE.Color')({color : '#0400ff'}),
                        transparent : true,
                        opacity : .4,
                        depthTest : false
                    }),
                    'material of the halo',
                    undefined
                ),
                p(
                    'Geometry',
                    'THREE.BufferGeometry',
                    ge('THREE.TubeBufferGeometry')({
                        path : new (ge('Custom Curve')({
                            'curve function' : (t) =>
                                ge('THREE.Vector3')({
                                    x : Math.cos(t * 2 * Math.PI),
                                    y : Math.sin(t * 2 * Math.PI),
                                    z : 0
                                })
                        }))(),
                        'tubular segments' : 60,
                        'radius' : .025,
                        'radial segments' : 60,
                        'closed' : false
                    }),
                    'geometry of the halo',
                    undefined
                ),
                p('radius', 'number', 1, 'radius of the halo', undefined)
            ]
        )
    ),((w) => ge('Mesh')({
        Geometry: ge('dod')({
            value : w['Geometry'],
            default : ge('THREE.TubeBufferGeometry')({
                path : new (ge('Custom Curve')({
                    'curve function' : (t) =>
                        ge('THREE.Vector3')({
                            x : Math.cos(t * 2 * Math.PI),
                            y : Math.sin(t * 2 * Math.PI),
                            z : 0
                        }).multiplyScalar(w['radius'])
                }))(),
                'tubular segments' : 60,
                'radius' : .025 * w['radius'],
                'radial segments' : 60,
                'closed' : false
            })
        }),
        Material: ge('dod')({
            value : w['Material'],
            default : ge('mbm')({
                color: '#0400ff',
                transparent: true,
                opacity: .4,
                depthTest: false
            })
        })})))
