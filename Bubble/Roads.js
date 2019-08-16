let GLOBAL = {}, DEBUG = {};
let MAKE_STATE = function(TYPE, LOCAL){
    return {STATUS : TYPE, LOCAL : LOCAL}
}

let [City, Road, getCity, getCities, Intersection, getIntersection, create] = ((w) => {
    let cities = {};
    let intersections = {};

    let create = function (CLASS, PARAM) {
        return new (CLASS)(PARAM);
    }
    let Road = function(...STEPS){
        function ROAD() {
            this['EVALUATE'] = function (o) {
                STEPS['forEach']
                (STEP => STEP(o));
                if(o['return'])
                    return o['return'](o);
            }
        }
        return create(ROAD,{});
    }
    let City = function(NAME, ROADS){
        if(!(ROADS instanceof Array))
            ROADS = [ROADS];
        function CITY() {
            this['EVALUATE'] = function (o) {
                ROADS['forEach']
                (ROAD => ROAD['EVALUATE'](o));
                if(o['return'])
                    return o['return'](o);
            }
        }
        cities[NAME] = CITY;
    }
    let getCity = function (NAME) {
        return cities[NAME];
    }
    let getCities = function () {
        return cities;
    }
    let Intersection = function (NAME, w) {
        w['Closure']['EVALUATE'](w);
        function INTERSECTION(o) {
            return w['Inner'](w)['EVALUATE'](o)
        }
        intersections[NAME] = INTERSECTION;
    }
    let getIntersection = function (NAME) {
        return (intersections[NAME]);
    }
    return [City, Road, getCity, getCities, Intersection, getIntersection, create];
})({})

let dodSetMany = (...args) => args['forEach'](arg => {console.log(arg); arg[0][arg[1]] = ((arg[0][arg[1]] === undefined || arg[0][arg[1]] === null) ? arg[2] : arg[0][arg[1]])});
let GLOBAL_PROMISE = ASQ({});
GLOBAL_PROMISE
    ['all'](
    (done, MSG) =>
        Road(
            (loc) => loc['NAME'] = 'Group',
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD BEGIN', loc),
            (loc) =>
                (Road(
                    (HELP) =>
                        City(
                            loc['NAME'],
                            Road(
                                (w) => w['group'] = create(THREE.Group, {}),
                                (w) => w['return'] = (w) => w['group']
                            )
                        )
                )['EVALUATE']({...GLOBAL, ...DEBUG})),
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD END', loc),
            (loc) => done(MSG)
        )['EVALUATE']({}),
    (done, MSG) =>
        Road(
            (loc) => loc['NAME'] = 'Entry Left Down Intersection',
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD BEGIN', loc),
            (loc) =>
                ((HELP) =>
                    (Road(
                        (w) => dodSetMany(
                            [w, 'Closure',
                                Road(
                                    (w) => dodSetMany(
                                        [w, 'entries', []],
                                        [w, 'intermediate', create(getCity('Group'), w)['EVALUATE'](w)],
                                        [w, 'handler',
                                            Road(
                                                (w) => dodSetMany(
                                                    [w, 'getValue', (w) => w['array'][w['index']]['distance']],
                                                    [w, 'array', w['insect']],
                                                    [w, 'max', getCity('Find Max Array Special')(w)],
                                                    [w['max'], 'entry', w['max']['object']['entry']],
                                                    [w, 'if cond', (w) => w['max']['entry']['De-Selected'] === u],
                                                    [w, 'Handler Name', 'De-Selected'],
                                                    [w, 'type', 'left down listener'],
                                                    [w, 'Handler', ()=>{}],
                                                    [w, 'no interaction',
                                                        Road(
                                                            (w) => w['max']['entry']['De-Selected']['remove'](),
                                                            (w) => delete w['max']['entry']['De-Selected'],
                                                            (w) => getCity('Entry De-Selected Handler')(w['max']['entry'])(w)
                                                        )],
                                                    [w, 'if body', (w) => getCity('Entry Add Listener')(w['max']['entry'])(w)],
                                                ),
                                                (w) => getCity('Entry Selected Handler')(w['max']['entry'])(w),
                                            )['EVALUATE']
                                        ],
                                        [w, 'recursive', true],
                                        [w, 'type', 'left down listener'],
                                        [w, 'before',
                                            Road(
                                                (w) => w['intermediate']['children']['forEach'](e =>
                                                    Road(
                                                        (o) => dodSetMany(
                                                            [o,'x',0],
                                                            [o,'y',0],
                                                            [o,'z',0],
                                                            [o,'vector',getCity('THREE.Vector3')(o)],
                                                        ),
                                                        (o) => o['entry']['left down positioner']['position']['getWorldPosition'](o['vector']),
                                                        (o) => o['worldToLocal'](o['vector']),
                                                        (o) => o['position']['set'](o['vector']['x'],o['vector']['y'],o['vector']['z'])
                                                    )(e))
                                            )['EVALUATE']],
                                    ),
                                    (w) => w['object'] = w['intermediate'],
                                    (w) => dodSetMany(
                                        [w, 'Interaction Listener', create(ge('Object Interaction Listener'), (w))]
                                    ),
                                    (w) => w['Interaction Listener']['add']()
                                )],
                            [w, 'Inner',
                                (o) =>
                                    Road(
                                        (w) => dodSetMany(
                                            [w['Interaction Object'],'entry', w['entry']],
                                            [w,'child', w['Interaction Object']],
                                            [w,'parent', o['intermediate']]
                                        ),
                                        (w) => getCity('Parent Jump')(w),
                                        (w) => o['entries']['push'](w['entry'])
                                    )
                            ]),
                        (w) => Intersection(loc['NAME'], w)
                )['EVALUATE']({})))({...GLOBAL, ...DEBUG}),
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD END', loc),
            (loc) => done(MSG)
        )['EVALUATE']({}),
    (done, MSG) =>
        Road(
            (loc) => loc['NAME'] = 'THREE.Vector3',
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD BEGIN', loc),
            (loc) =>
                (Road(
                    (HELP) =>
                        City(
                            loc['NAME'],
                            Road(
                                (w) => dodSetMany(
                                    [w,'x',0],
                                    [w,'y',0],
                                    [w,'z',0]
                                ),
                                (w) => w['vector'] = new THREE.Vector3(w['x'],w['y'],w['z']),
                                (w) => w['return'] = (w) => w['vector']
                            )
                        )
                )['EVALUATE']({...GLOBAL, ...DEBUG})),
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD END', loc),
            (loc) => done(MSG)
        )['EVALUATE']({}),
    (done, MSG) =>
        Road(
            (loc) => loc['NAME'] = 'Parent Jump',
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD BEGIN', loc),
            (loc) =>
                (Road(
                    (HELP) =>
                        City(
                            loc['NAME'],
                            Road(
                                (w) => w['parent']['add'](w['child']),
                                (w) => dodSetMany(
                                    [w,'x',0],
                                    [w,'y',0],
                                    [w,'z',0],
                                    [w,'vector',getCity('THREE.Vector3')['EVALUATE'](w)
                                    ]),
                                (w) => w['child']['worldToLocal'](w['world position']),
                                (w) => w['child']['position']['set'](w['world position']['x'],w['world position']['y'],w['world position']['z'])
                            )
                        )
                )['EVALUATE']({...GLOBAL, ...DEBUG})),
            (loc) => MSG[loc['NAME']] = MAKE_STATE('LOAD END', loc),
            (loc) => done(MSG)
        )['EVALUATE']({})
)['then'](
    (done, MSG) =>
        Road(
            (loc) => Object.entries(MSG)['forEach'](console.log),
            (loc) => done()
        )['EVALUATE']({})
)









/*
*
                            (w) => w['intersected'] = [],
                            (w) => w['for each collection'] = w['entries'],
                            (w) => w['for each name'] = 'entry',
                            (w) => w['for each body'] =
                                Road(
                                    (w) => w['object'] = w['entry'],
                                    (w) => w['insect'] = getCity('Get Interaction')(w),
                                    (w) => w['if cond'] = (w) => w['insect'][0] !== u,
                                    (w) => w['o'] = {insect : w['insect'], entry : w['entry']},
                                    (w) => w['if body'] = (w) => w['intersected']['push'](w['o']),
                                    (w) => getCity('if')(w),
                                ),
                            (w) => getCity('for each')(w),
                            (w) => w['array'] = w['intersected'],
                            (w) => w['getValue'] = (w) => w['array'][[w['index']]]['insect'][0]['distance'],
                            (w) => w['max'] = getCity('Find Max Array Special')(w),
* */




// let ss = new (ge('Object Interaction Listener'))({
//     object : scene,
//     recursive : true,
//     handler : (w) => {
//         let insect = w['insect'];
//         let find = (o) => {
//             if(o['MARKED'] !== undefined) {
//                 if(o['MARKED']['De-Selected'] === undefined){
//                     ge('Entry Add Listener')(o['MARKED'])({
//                         'Handler Name' : 'De-Selected',
//                         'type' : 'left down listener',
//                         'Handler' : (w) => {},
//                         'no interaction' : (r) => {
//                             o['MARKED']['De-Selected']['remove']();
//                             delete o['MARKED']['De-Selected'];
//                             ge('Entry De-Selected Handler')(o['MARKED'])(r);
//                         }
//                     })
//                 }
//                 ge('Entry Selected Handler')(o['MARKED'])(w);
//                 return true;
//             }else if(o['parent'] === null || o['parent'] === undefined)
//                 return false;
//             else return find(o['parent']);
//         }
//         for(let ins of insect) {
//             if (find(ins['object']))
//                 break;
//         }
//     },
//     type : 'left down listener',
// });
// ss.add();

/*
* // entries are roads


addEntry(
    en(
        'Intersection',
        [],
        ps(
            [],
            []
        )
    ),(w) => {
        w['Closure Road']['Evaluate'](w);
        function Intersection(o) {
            w['Intersection Road']['Evaluate'](this)(w)(o);
        }
        return Intersection;
    }
)




addCity('name','function');
addSlot('name', 'parameter');
getCity('name');


// City can :
City['Add Road'];       // name or index
City['Remove Road'];    // "           "
City['Get Road'];       // "           "
City['Get Roads'];      //
// ... replace road

City['Add Intersection'];
City['Remove Intersection'];
City['Get Intersection']
// ... replace intersection

// Road can :
Road['Add Step']    // name or index
Road['Remove Step'] // "           "
Road['Get Step']    // "           "
Road['Get Steps']   // "           "
Road['Replace Step']//

// same for intersections

Step['Evaluate'];
* */

//
// addCity(
//     'Left Drag Find',
//     Road(
//         (w) => w['if cond'] = (w) => w['object']['MARKED'] !== undefined,
//         (w) => w['if body'] =
//             (w) =>
//                 Road(
//                     (w) => w['if cond'] = (w) => w['object']['MARKED']['De-Selected'] === undefined,
//                     (w) => w['if body'] = (w) => getCity('Entry Add Listener')(w['object']['MARKED'])['Evaluate']({
//                         'Handler Name' : 'De-Selected',
//                         'type' : 'left down listener',
//                         'Handler' : (w) => {},
//                         'no interaction' :
//                             Road(
//                                 (w) => w['object']['MARKED']['De-Selected']['remove'](),
//                                 (w) => delete w['object']['MARKED']['De-Selected'],
//                                 (w) => getCity('Entry De-Selected Handler')(w['object']['MARKED'])(w)
//                             )['Evaluate']
//                     }),
//                     (w) => ge('if')(w),
//                     (w) => getCity('Entry Selected Handler')(w['object']['MARKED'])['Evaluate'](w),
//                     (w) => (w) => w['return'] = true
//                 )['Evaluate'](w),
//         (w) => w['else'] = (w) =>
//             Road(
//                 (w) => w['if cond'] = (w) => w['object']['parent'] === null || w['object']['parent'] === undefined,
//                 (w) => w['if body'] = (w) => w['return'] = false,
//                 (w) => w['else'] = (w) =>
//                     Road(
//                         (w) => w['object'] = w['object']['parent'],
//                         (w) => w['return'] = getCity('Find')['Evaluate'](w)
//                     )['Evaluate'](w)
//             )['Evaluate'](w),
//         (w) => getCity('if')['Evaluate'](w)
//     )
// );
// addCity(
//     'Left Drag Handler',
//     Road(
//         (w) => w['for each collection'] = w['insect'],
//         (w) => w['for each name'] = 'ins',
//         (w) => w['for each body'] =
//             (w) => Road(
//                 (w) => w['object'] = w['ins']['object'],
//                 (w) => w['if cond'] = (w) => getCity('Left Drag Find')(w),
//                 (w) => w['if body'] = (w) => w['for loop break'] = true,
//                 (w) => getCity('if')['Evaluate'](w)
//             )['Evaluate'](w),
//         (w) => getCity('for each')['Evaluate'](w)
//     )
// )
//
//
// addCity(
//     'Left Drag Entries',
//     Road(
//         (w) => w['object'] = scene,
//         (w) => w['recursive'] = true,
//         (w) => w['handler'] = getCity('Left Drag Handler'),
//         (w) => w['type'] = 'left down listener',
//         (w) => w['return'] = new (getCity('Object Interaction Listener'))(w)
//     )
// )
//
//
//
//
//
// let entries = [];
//
// let ev = (w) => {
//     for(let e of entries)
//     {
//         //
//     }
// }
//
// function In(w){
//     entries.push[w['entry']]
// }
/*
*
addCity(
    'Left Drag Find',
    Road(
        (w) => w['if cond'] = (w) => w['object']['MARKED'] !== undefined,
        (w) => w['if body'] =
            (w) =>
                Road(
                    (w) => w['if cond'] = (w) => w['object']['MARKED']['De-Selected'] === undefined,
                    (w) => w['if body'] = (w) => getCity('Entry Add Listener')(w['object']['MARKED'])['Evaluate']({
                        'Handler Name' : 'De-Selected',
                        'type' : 'left down listener',
                        'Handler' : (w) => {},
                        'no interaction' :
                            Road(
                                (w) => w['object']['MARKED']['De-Selected']['remove'](),
                                (w) => delete w['object']['MARKED']['De-Selected'],
                                (w) => getCity('Entry De-Selected Handler')(w['object']['MARKED'])(w)
                            )['Evaluate']
                    }),
                    (w) => ge('if')(w),
                    (w) => getCity('Entry Selected Handler')(w['object']['MARKED'])['Evaluate'](w),
                    (w) => (w) => w['return'] = true
                )['Evaluate'](w),
        (w) => w['else'] = (w) =>
            Road(
                (w) => w['if cond'] = (w) => w['object']['parent'] === null || w['object']['parent'] === undefined,
                (w) => w['if body'] = (w) => w['return'] = false,
                (w) => w['else'] = (w) =>
                    Road(
                        (w) => w['object'] = w['object']['parent'],
                        (w) => w['return'] = getCity('Find')['Evaluate'](w)
                    )['Evaluate'](w)
            )['Evaluate'](w),
        (w) => getCity('if')['Evaluate'](w)
    )
);
addCity(
    'Left Drag Handler',
    Road(
        (w) => w['for each collection'] = w['insect'],
        (w) => w['for each name'] = 'ins',
        (w) => w['for each body'] =
            (w) => Road(
                (w) => w['object'] = w['ins']['object'],
                (w) => w['if cond'] = (w) => getCity('Left Drag Find')(w),
                (w) => w['if body'] = (w) => w['for loop break'] = true,
                (w) => getCity('if')['Evaluate'](w)
            )['Evaluate'](w),
        (w) => getCity('for each')['Evaluate'](w)
    )
)


addCity(
    'Left Drag Entries',
    Road(
        (w) => w['object'] = scene,
        (w) => w['recursive'] = true,
        (w) => w['handler'] = getCity('Left Drag Handler'),
        (w) => w['type'] = 'left down listener',
        (w) => w['return'] = new (getCity('Object Interaction Listener'))(w)
    )
)
* */