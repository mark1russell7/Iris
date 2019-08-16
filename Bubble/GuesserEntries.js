
addEntry(
    en(
        'Binary Guesser',
        ['Guesser', 'Approximate Search', 'Binary'],
        ps([
        ], [
            p(
                'Small Checker',
                'function',
                () => {},
                'returns whether a \'result\' value is smaller than the correct value',
                ps(
                    [
                        p(
                            'result',
                            'number',
                            0,
                            'the resulting value of a binary guesser attempt',
                            undefined
                        )
                    ],
                    [
                    ])
            ),
            p(
                'Guesser',
                'function',
                () => {},
                'a function that logarithmically approaches a desired value using an attempt algorithm insprired by Daedekind Cuts, and similar to Binary Search',
                ps(
                    [
                        p('start', 'number',0,'the lower bound of the current iteration in the guesser algorithm', undefined),
                        p('end', 'number',0,'the upper bound of the current iteration in the guesser algorithm', undefined),
                    ],
                    [

                    ]
                )
            ),
            p('start', 'number',0,'the lower bound of the current iteration in the guesser algorithm', undefined),
            p('end', 'number',0,'the upper bound of the current iteration in the guesser algorithm', undefined),

        ])
    ), // pass in guessing function
    ((w) => getEntry('Binary Search')({
        Valid : ge('Binary Guesser Valid Function')(w),
        Small : ge('Binary Guesser Small Function')(w),
        end : w['end'],
        start : w['start']
    }))
)
non_instantiate.add('Binary Guesser')

addEntry(
    en(
        'Binary Guesser Valid Function',
        [],
        ps(
            [
                p('Guesser', 'function', ()=>{}, 'guesser function', undefined)
            ],
            [
                p('Binary Guesser Valid Function Body', 'function', ()=>{}, 'body function', undefined)
            ]
        )
    ), (w) =>
        (o) =>
            ge('dod')({
                value : w['Binary Guesser Valid Function Body'],
                default :
                    (w) =>
                        ge('many')({
                            w : w,
                            each : [
                                (w) => o['if cond'] = (r) => ge('equals')({left : r['start'], right : r['end']}),
                                (w) => o['if body'] = (r) => true,
                                (w) => o['else'] = (r) => w['Guesser'](r)
                            ],
                            return : (w) => ge('if')(o)
                        })
            })(w)
)

non_instantiate.add('Binary Guesser Valid Function')



addEntry(
    en(
        'Binary Guesser Small Function',
        [],
        ps([],[]
        )
    ),((w) => (o) => w['Small Checker'](o))
)
non_instantiate.add('Binary Guesser Small Function')

addEntry(
    en(
        'Binary Search',
        ['Search', 'Binary'],
        ps([
            p('start', 'number',0,'the lower bound of the current iteration in the binary search algorithm', undefined),
            p('end', 'number',0,'the upper bound of the current iteration in the binary search algorithm', undefined),
            p('Valid', 'function', ()=>{}, 'the function that determines if the currently visited value is valid as a solution in the Binary Search Algorithm',
                ps([
                        p('start', 'number',0,'the lower bound of the current iteration in the guesser algorithm', undefined),
                        p('end', 'number',0,'the upper bound of the current iteration in the guesser algorithm', undefined),
                    ],
                    [

                    ])
            ),
            p('Small', 'function', ()=>{}, 'the function that determines if the currently visited value is too small as compared to a valid solution for this Binary Search Algorithm',
                ps([
                    p('result', 'number', 0, 'the current solution in the Binary Search Algorithm', undefined)
                ],[

                ])
            ),
            p('mid', 'number', 0, 'the currently visited value in this Binary Search Algorithm', undefined)
        ], [

        ])
    ),
    ((w) => {
        let mid = ge('+')({left : ge('/')({left : ge('-')({left : w['end'], right : w['start']}), right : 2}), right : w['start']});
        w['mid'] = mid;
        if(w['Valid'](w))
            return mid;
        else if(ge('>')({left : w['start'], right : w['end']}))
            return -1;
        else {
            w[w['Small'](w) ? 'start' : 'end'] = mid
            return ge('Binary Search')(w);
        }
    })
)

non_instantiate.add('Binary Search')



addEntry(
    en(
        'Spiral Guesser',
        [

        ],
        ps([
            p('t_1', 'number', undefined, 'angle of previous object'),
            p('r_1', 'number', undefined, 'bounding radius of previous object'),
            p('r_2', 'number', undefined, 'bounding radius of new object'),
        ],[
            p('Center Radius', 'number', undefined, 'radius of center sphere / intial radius of rotation'),
            p('n', 'number', undefined, 'special case, specify a value n such that the spiral will have an increasing ' +
                'radius : 2 * r (amount) / 2 PI (per period of angle), where r is the radius of the largest circle such ' +
                'that n of such size could fit most tightly around the inner sphere'),
            p('Radius Increase', 'number', undefined, '1/2 the speed of increasing radius of the spiral on a per 2 pi period, also the ' +
                'radius of the largest ~possible (desired) circle in the spiral'),
            p('diff', 'number', undefined, 'optional optimization parameter, the difference in angles between the 2 most recent calculations'),
        ])
    ),
     (w) => {
        let R = w['Center Radius'] || 2;
        let n = w['n'] || 8;
        let r = w['n'] ? (R / (1/Math.tan(Math.PI/n) - 1)):R/1.414;
        let precision = w['precision'] || .1;
        let q_save = R + r;
        let q_save2 = 2*r/(2*Math.PI);
        q_save += q_save2 * Math.PI;
        let q = (t) => q_save + q_save2*t;
        let correct = Math.pow(w['r_1']+w['r_2'],2);
        w['q_1'] = q(w['t_1']);
        correct -= w['q_1']**2;
        let mult_save = 2 * w['q_1'];
        let timess = 0, times_g = 0;
        let ret = getEntry('Binary Guesser')({
            start : w['t_1'] + (w['diff'] ? (w['diff']*w['r_2']/w['r_1']) : 0)/2,
            end : w['t_1'] + (w['diff'] || 2*Math.PI/n),
            'Small Checker' : (o) => (o['result'] < correct),
            'Guesser' : (o) => {
                let t_guess = (o['end']-o['start'])/2.0 + o['start'];
                w['q_2'] = q(t_guess);
                let result = w['q_2']**2.0 - mult_save * w['q_2'] * Math.cos(w['t_1']-t_guess);
                o['result'] = result;
                return Math.abs(result - correct) <= (precision);
            }
        });
        return ret;
    })

