let ps = (function(req, opt) {return{parameters : {required : req, optional : opt}}});
let p = (function(name, type, def, desc, param) {return{name : name, type : type, default : def, description : desc, parameters : param}});
let en = (function (name, tags, parameters, desc) {return {name : name, tags: tags, parameters : parameters, description: desc}});

// let u = undefined;
let segment_multiplier = 1;

let Entry_Promises = [];

let [addEntry, getEntries ] =
    ((entries = {}) =>
        [(meta, entr) => entries[meta['name']] = [meta, entr],
         () => entries
        ]
    )();

let getEntry = (name) =>
    !isNaN(name)
        ? Number.parseInt(name)
            : getEntries()[name]
                ? getEntries()[name][1]
                : getEntries()[nicknames[name]][1]

let getMeta = (name) =>
    !isNaN(name)
        ? en(Number.parseInt(name), [], ps([],[]))
        : getEntries()[name]
            ? getEntries()[name][0]
            : getEntries()[nicknames[name]][0];



let removeEntry = (name) => delete getEntries()[name];


let nicknames = {};
let nick = (name, nickname) => nicknames[nickname] = name;
let non_instantiate = new Set();
let data_conversion = {};

let ge = getEntry;
let ae = addEntry;
let gm = getMeta;



let tests = [];
let addTest = function (test) {
    tests['push'](test);
}

let runTests = function (optionalArgs) {
    return ASQ()
            .all(
                ...tests['map'](test => (done) => {test(optionalArgs); done()})
            )
}




