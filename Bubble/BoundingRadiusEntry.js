

addEntry(
    en(
        'Compute Bounding Radius',
        [],
        ps(
            [
                p('item', 'object', undefined, 'the root object', undefined)
            ],
            []
        )
    ), (w) =>
        ge('many')({
            w : w,
            each : [
                (w) => w['radii'] = [],
                (w) => w['vector'] = ge('THREE.Vector3')({'x':0,'y':0,'z':0}),
                (w) => w['item']['getWorldPosition'](w['vector']),
                (w) =>
                    ge('Bounding Radius Helper')({
                        'scale' : ge('THREE.Vector3')({'x':1,'y':1,'z':1}),
                        'position' : w['vector'],
                        'radii' : w['radii'],
                        'object' : w['item']
                    }),
                // (w) => ge('QuickSort')({
                //     'array' : w['radii'],
                //     'value' : (w) => w['array'][w['index']]
                // }),
                (w) => w['radii'] = ge('Find Max Array')({array : w['radii']})
            ],
            return : (w) => w['radii']
                //[ge('-')({left : w['radii']['length'], right : 1})]
        })
)

non_instantiate.add('Compute Bounding Radius')
addEntry(
    en(
        'Bounding Radius Helper',
        [],
        ps(
            [
                p('radii', 'Array', [], 'array in which radii attempts shall be placed', undefined),
                p('scale', 'THREE.Vector3', ge('THREE.Vector3')({x:1,y:1,z:1}), 'current scale with respect to root object', undefined),
                p('position', 'THREE.Vector3', ge('THREE.Vector3')({x:0,y:0,z:0}), 'position of the root object in world space', undefined),
                p('object', 'object', undefined, 'the current object', undefined),

            ],
            []
        )
    ), (w) => {
        ge('many')({
            w : w,
            each : [
                (w) =>
                    w['scale'] = ge('THREE.Vector3')({
                        x : ge('*')({left : w['scale']['x'] , right : w['object']['scale']['x']}),
                        y : ge('*')({left : w['scale']['y'] , right : w['object']['scale']['y']}),
                        z : ge('*')({left : w['scale']['z'] , right : w['object']['scale']['z']}),
                    }),
                (w) => w['local position'] = new THREE.Vector3(0,0,0),
                (w) => w['object'].getWorldPosition(w['local position']),
                (w) => w['if cond'] =
                    (w) =>
                        ge('not undefined')({
                            object : w['object']['geometry']
                        }),
                (w) => w['if body'] =
                    (w) =>
                        ge('many')({
                            w : w,
                            each : [
                                (w) => w['if cond'] =
                                    (w) =>
                                        ge('or')({
                                            left :
                                                ge('undefined')({
                                                    object : w['object']['geometry']['boundingSphere']
                                                }),
                                            right :
                                                ge('equals')({
                                                    left : null,
                                                    right : w['object']['geometry']['boundingSphere']
                                                })
                                }),
                                (w) => w['if body'] = (w) => w['object']['geometry']['computeBoundingSphere'](),
                                (w) => ge('if')(w),
                                (w) => w['radius'] = w['object']['geometry']['boundingSphere']['radius'],
                                (w) => w['radius'] =
                                    ge('*')({
                                        left : w['radius'],
                                        right :
                                            ge('Max all')({
                                                values : [
                                                    w['scale']['x'],
                                                    w['scale']['y'],
                                                    w['scale']['z']
                                                ]})}),
                                (w) => w['cond'] =
                                    (w) =>
                                        ge('<')({
                                            left : w['index'],
                                            right : w['object']['geometry']['attributes']['position']['array']['length']
                                        }),
                                (w) => w['var'] = 'index',
                                (w) => w['start'] = 0,
                                (w) => w['next'] =
                                    (w) => w['index'] =
                                        ge('+')({
                                            left : w['index'],
                                            right : 3
                                        }),
                                (w) => w['body'] =
                                    (w) =>
                                        w['radius'] =
                                            ge('Max')({
                                                left : w['radius'],
                                                right :
                                                    ge('sqrt')({
                                                        value :
                                                            ge('Plus All')({
                                                                values : [
                                                                    ge('**')({
                                                                        right : 2,
                                                                        left :
                                                                            ge('*')({
                                                                                left : w['scale']['x'],
                                                                                right : w['object']['geometry']['attributes']['position']['array'][
                                                                                    ge('+')({
                                                                                        left : 0,
                                                                                        right : w['index']
                                                                                    })] || 0})}),
                                                                    ge('**')({
                                                                        right : 2,
                                                                        left :
                                                                            ge('*')({
                                                                                left : w['scale']['y'],
                                                                                right : w['object']['geometry']['attributes']['position']['array'][
                                                                                    ge('+')({
                                                                                        left : 1,
                                                                                        right : w['index']
                                                                                    })] || 0})}),
                                                                    ge('**')({
                                                                        right : 2,
                                                                        left :
                                                                            ge('*')({
                                                                                left : w['scale']['z'],
                                                                                right : w['object']['geometry']['attributes']['position']['array'][
                                                                                    ge('+')({
                                                                                        left : 2,
                                                                                        right : w['index']
                                                                                    })] || 0})})]})})}),
                                (w) => ge('for loop')(w),
                                (w) => w['radii'].push(
                                    w['radius'] +
                                    ge('sqrt')({
                                        value :
                                            ge('Plus All')({
                                                values :
                                                    ['x','y','z']
                                                        .map(e =>
                                                            ge('**')({
                                                                left :
                                                                    ge('-')({
                                                                        left : w['position'][e],
                                                                        right : w['local position'][e]
                                                                    }),
                                                                right : 2
                                                            }))})}))]}),
                (w) =>
                    w['else'] =
                        (w) =>
                            w['radii'].push(
                                ge('sqrt')({
                                    value :
                                        ge('Plus All')({
                                            values :
                                                ['x','y','z']
                                                    .map(e =>
                                                        ge('**')({
                                                            left :
                                                                ge('-')({
                                                                    left : w['position'][e],
                                                                    right : w['local position'][e]
                                                                }),
                                                            right : 2
                                                        }))})})),
                (w) => ge('if')(w),
                (w) => w['if cond'] =
                    (w) =>
                        ge('and')({
                            left :
                                ge('not undefined')({
                                    object : w['object']['children']
                                }),
                            right :
                                ge('>')({
                                    left : w['object']['children']['length'],
                                    right : 0
                                })}),
                (w) =>
                    w['if body'] = (w) =>
                        ge('many')({
                            w : w,
                            each : [
                                (w) => w['var'] = 'child',
                                (w) => w['body'] = (w) =>
                                    ge('Bounding Radius Helper')({
                                        object : w['child'],
                                        radii : w['radii'],
                                        position : w['position'].clone(),
                                        scale : w['scale']
                                    }),
                                (w) => w['iterable'] = w['object']['children'],
                                (w) => ge('For Each')(w)
                            ]
                        }),
                (w) => ge('if')(w)
            ]
        })
    }
)
non_instantiate.add('Bounding Radius Helper')