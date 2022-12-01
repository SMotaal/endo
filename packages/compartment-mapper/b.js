'use strict';
(() => {
  const functors = [
// === functors[0] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const        c=  'sea';$h‍_once.c(c);
const        i=  'eye';$h‍_once.i(i);
const        k=  'que';$h‍_once.k(k);
const        q=  'cue';$h‍_once.q(q);
const        u=  'you';$h‍_once.u(u);
const        y=  'why';$h‍_once.y(y);
})
,
// === functors[1] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const{default:$c‍_default}={default:'foo'};$h‍_once.default($c‍_default);
})
,
// === functors[2] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const        color=  'blue';$h‍_once.color(color);
})
,
// === functors[3] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const fizz=  'fizz';$h‍_once.fizz(fizz);
const bizz=  'bizz';$h‍_once.bizz(bizz);
const buzz=  'buzz';$h‍_once.buzz(buzz);
})
,
// === functors[4] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const        red=  '#f00';$h‍_once.red(red);
const        green=  '#0f0';$h‍_once.green(green);
const        blue=  '#00f';$h‍_once.blue(blue);
})
,
// === functors[5] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([["./import-and-export-all.js", []]]);   
})
,
// === functors[6] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const        gray=  '#777';$h‍_once.gray(gray);
})
,
// === functors[7] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   const        qux=  'qux';$h‍_once.qux(qux);
})
,
// === functors[8] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([["./import-and-reexport-name-from-me.js", []],["./import-and-reexport-name-as-from-me.js", []]]);   
})
,
// === functors[9] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   $h‍_imports([]);   print('dependency');
})
,
// === functors[10] ===
(({   imports: $h‍_imports,   liveVar: $h‍_live,   onceVar: $h‍_once,   importMeta: $h‍____meta,  }) => {   let foo,bar,baz,fizz,buzz,colour,qux,grey,colors;$h‍_imports([["./import-default-export-from-me.js", [["default", [$h‍_a => (foo = $h‍_a)]]]],["./import-all-from-me.js", [["*", [$h‍_a => (bar = $h‍_a),$h‍_a => (baz = $h‍_a)]]]],["./import-named-exports-from-me.js", [["fizz", [$h‍_a => (fizz = $h‍_a)]],["buzz", [$h‍_a => (buzz = $h‍_a)]]]],["./import-named-export-and-rename.js", [["color", [$h‍_a => (colour = $h‍_a)]]]],["./reexport-name.js", [["qux", [$h‍_a => (qux = $h‍_a)]],["grey", [$h‍_a => (grey = $h‍_a)]]]],["./reexport-all.js", [["*", [$h‍_a => (colors = $h‍_a)]]]],["bundle-dep", []]]);   


print(foo);


print(bar);
// Once more with feeling.

print(baz);


print(fizz);
print(buzz);


print(colour);


print(qux);
print(grey);


print(colors);
})
,
]; // functors end

  function cell(name, value = undefined) {
    const observers = [];
    function set(newValue) {
      value = newValue;
      for (const observe of observers) {
        observe(value);
      }
    }
    function get() {
      return value;
    }
    function observe(observe) {
      observers.push(observe);
      observe(value);
    }
    return { get, set, observe, enumerable: true };
  }

  const cells = [
    {
      c: cell("c"),
      i: cell("i"),
      k: cell("k"),
      q: cell("q"),
      u: cell("u"),
      y: cell("y"),
    },
    {
      default: cell("default"),
    },
    {
      color: cell("color"),
    },
    {
      fizz: cell("fizz"),
      bizz: cell("bizz"),
      buzz: cell("buzz"),
    },
    {
      red: cell("red"),
      green: cell("green"),
      blue: cell("blue"),
    },
    {
    },
    {
      gray: cell("gray"),
    },
    {
      qux: cell("qux"),
    },
    {
      qux: cell("qux"),
      grey: cell("grey"),
    },
    {
    },
    {
    },
  ];

  Object.defineProperties(cells[5], Object.getOwnPropertyDescriptors(cells[4]));

  Object.defineProperties(cells[8], {"qux": { value: cells[7]["qux"] },"grey": { value: cells[6]["gray"] } });
          
  const namespaces = cells.map(cells => Object.create(null, cells));

  for (let index = 0; index < namespaces.length; index += 1) {
    cells[index]['*'] = cell('*', namespaces[index]);
  }

  function observeImports(map, importName, importIndex) {
    for (const [name, observers] of map.get(importName)) {
      const cell = cells[importIndex][name];
      if (cell === undefined) {
        throw new ReferenceError(`Cannot import name ${name}`);
      }
      for (const observer of observers) {
        cell.observe(observer);
      }
    }
  }

  functors[0]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      c: cells[0].c.set,
      i: cells[0].i.set,
      k: cells[0].k.set,
      q: cells[0].q.set,
      u: cells[0].u.set,
      y: cells[0].y.set,
    },
    importMeta: {},
  });
  functors[1]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[1].default.set,
    },
    importMeta: {},
  });
  functors[2]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      color: cells[2].color.set,
    },
    importMeta: {},
  });
  functors[3]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      fizz: cells[3].fizz.set,
      bizz: cells[3].bizz.set,
      buzz: cells[3].buzz.set,
    },
    importMeta: {},
  });
  functors[4]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      red: cells[4].red.set,
      green: cells[4].green.set,
      blue: cells[4].blue.set,
    },
    importMeta: {},
  });
  functors[5]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./import-and-export-all.js", 4);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[6]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      gray: cells[6].gray.set,
    },
    importMeta: {},
  });
  functors[7]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      qux: cells[7].qux.set,
    },
    importMeta: {},
  });
  functors[8]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./import-and-reexport-name-as-from-me.js", 6);
      observeImports(map, "./import-and-reexport-name-from-me.js", 7);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[9]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[10]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./import-all-from-me.js", 0);
      observeImports(map, "./import-default-export-from-me.js", 1);
      observeImports(map, "./import-named-export-and-rename.js", 2);
      observeImports(map, "./import-named-exports-from-me.js", 3);
      observeImports(map, "./reexport-all.js", 5);
      observeImports(map, "./reexport-name.js", 8);
      observeImports(map, "bundle-dep", 9);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });

  return cells[cells.length - 1]['*'].get();
})();
