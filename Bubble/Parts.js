let u    =    undefined
let d    = (w   ) => w !== u
let nan  = (w   ) => isNaN(w)
let not  = (w   ) => !w
let and  = (a,b ) => (a&&b)
let or   = (a,b ) => a || b
let nor  = (a,b ) => not(or (a,b))
let xor  = (a,b ) => and(or (a,b), not(and(a,b)))
let nand = (a,b ) => not(and(a,b))
let dod  = (v,de) => d(v) ? v : de

let to = (x   ) =>       typeof x
let io = (x, y) => x instanceof y

function LOADER(){
    this.UNLOADED    = - 1
    this.IN_PROGRESS =   0
    this.DONE        =   1
    this.FAIL        =   Number.NaN
    this.LOADS       = { }
}
let LOAD        = new LOADER()
let LOADS       = LOAD.LOADS
let IN_PROGRESS = LOAD.IN_PROGRESS
let FAIL        = LOAD.FAIL
let UNLOADED    = LOAD.UNLOADED
let DONE        = LOAD.DONE
let load        = (name) => LOADS[name] = IN_PROGRESS
let fail        = (name) => LOADS[name] = FAIL
let unload      = (name) => LOADS[name] = UNLOADED
let finish      = (name) => LOADS[name] = DONE


let IS_NUM      = (v) => to(v) === 'number'
let NUM = (d) =>  (v) => IS_NUM     (v) ? v : dod(d,0)
let IS_FUNCTION = (v) => to(v) === 'function'
let FXN = (d) =>  (v) => IS_FUNCTION(v) ? v : dod(d,()=>{})
let IS_ARRAY    = (v) => io(v,  Array)
let ARR = (d) =>  (v) => IS_ARRAY   (v) ? v : dod(d,[])

let GLOBAL   = {}
let bubble   = new Bubble(GLOBAL)
let ego      = bubble.Brain.Ego
let brain    = bubble.Brain
let subbrain = bubble.Brain.SubBrain
let make = (p,o) => ego.Make(p, o)
let slot = (p,n) => p.Slots.Get(n).Catch



//
function Brain(w)
{
    load  ('Brain')
    w   .Brain    = this
    this.Ego      = new Ego     (w)
    this.SubBrain = new SubBrain(w)
    finish('Brain')
}
//

//
function Bubble(w)
{
    load  ('Bubble')
    this.Brain = new Brain(w)
    finish('Bubble')
}
//

//
function Parts(w)
{
    load  ('Parts')
    this.Parts  = {            }
    this.Add    = (name,   part) =>
        this.Parts[name] = part
    this.Get    = (name        ) =>
        this.Parts[name]
    finish('Parts')
}
//

//
function Ego(w)
{
    load  ('Ego')
    this.Parts = new Parts(w)
    this.Add = (name, o) =>
        this.Parts.Add(name, new Part({...o, Kit: {name: name, Ego: this}}))
    this.Brain = w.Brain
    this.Make = (name, o) =>
        ((Part) => {
            Part.Sift(o, Part.Slots.Contents)
            return this.Brain.SubBrain.GetType(Part.GetType()).Create(Part)
        })(this.Get(name))
    this.Get = (name) =>
        this.Parts.Get(name)
    finish('Ego')
}
//

//
function SubBrain(w)
{
    load  ('SubBrain')
    function Type(name, create) {
        load  ('Type')
        this.Name = name
        this.Create = or(create, ((part) => {}));
        finish('Type')
    }
    this.Types = {}
    this.AddType = (name, create) =>
         this.Types[name] = new Type(name, create)
    this.GetType = (name) =>
         this.Types[name]
    finish('SubBrain')
}
//

//
function Filter(inspector, none)
{
    load  ('Filter')
    this.None    = dod(none, u)
    this.Inspect = dod(inspector, (o) => none)
    this.Sift = (caught, o) =>
        this.Catch = this.Inspect(caught, o)
    this.Sift(this.None)
    finish('Filter')
}
//

//
function Strainer(w)
{
    load  ('Strainer')
    this.Contents = {}
    this.Add = (name, inspector, none ) =>
        this.Contents[name] = new Filter(inspector, none)
    this.Set = (name, value           ) =>
        this.Contents[name].Sift(value)
    this.Get = (name                  ) =>
        this.Contents[name]
    this.Sift = (o, r) => {
        for (let i = 0,
                 c = this.Contents ,
                 k = Object.keys(c),
                 l = k.length;
             i < l;
             ++i    )
            c[k[i]].Sift(o[k[i]], r)
    };
    finish('Strainer')
}
//

//
/*
* This is a Part ( aka. Entry )
*       A Part is a fundamental Atomic Building Block of the Bubble System.  A Part automatically has many static meta
*       and psuedo meta capabilites, as well as pseudo-automatically and full-manually has many dynamic capabilities
*
*
*       // The Slots of a Part constitute its parametric description, and kit-sifting is performed by the corresponding
*       // Filters residing in its Strainer
*
*       // The Channel of a Part defines its graphical conversion process, and is often dynamically affected by
*       // changes to slot filter Catches
*
*Biblo
*
* Add/Get Slot      : Adds / Gets a Filter as / from a Slot of this Part
* Sift Slots        : Sifts a kit through the Filters Slotted into this Part
* Set/Get Channel   : Sets / Gets a Channel for / of this Part
* Set/Get Type      : Sets / Gets a Type for / of this Part
* Set/Get Kit       : Sets / Gets a Dynamic Fields Map ( aka. Kit )  for / of this Part
*
* */
//
function Part(load_kit)
{
    load  ('Part')
    this.Slots        =  new Strainer(load_kit)
    this.AddSlot      = (name, inspector, none) =>
         this.Slots.Add (name, inspector, none)
    this.GetSlot      = (name  ) =>
         this.Slots.Get (name  )
    this.Sift         = (o, kit) =>
         this.Slots.Sift(o, or(kit, o))
    this.SetChannel   = (name  ) =>
         this.Channel =  name
    this.SetChannel     (load_kit.Channel)
    this.GetChannel   = (      ) =>
         this.Channel
    this.SetPieces    = (pieces) =>
    {
         this.Pieces  =  pieces

        if (    this.Kit
            && !this.Kit.Ego.Pieces.Get(this.Kit.name)){

            this.Kit.Ego.Pieces.Add(this.Kit.name, this)
        }}
    this.SetPieces   (load_kit.Pieces)
    this.GetPieces = (    ) =>
        this.Pieces
    this.SetType   = (name) =>
        this.Type  =  name
    this.SetType     (load_kit.Type)
    this.GetType   = (    ) =>
        this.Type
    this.SetKit    = (Kit ) =>
        this.Kit   =  Kit
    this.SetKit      (load_kit.Kit)
    this.GetKit    = (    ) =>
        this.Kit
    finish('Part')
}
//