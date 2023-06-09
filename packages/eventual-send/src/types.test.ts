/* eslint-disable @endo/no-polymorphic-call, import/no-extraneous-dependencies, no-restricted-globals */
import { E } from '../test/get-hp.js';
import { ERef, FarRef } from './index.d';

// Check the legacy ERef type
const foo = async (a: ERef<{ bar(): string; baz: number }>) => {
  const { baz } = await a;

  E(a).bar() satisfies Promise<string>;

  // Should be type error, but isn't.
  (await a).bar();

  E.get(a).baz satisfies Promise<number>;

  // Should be type error, but isn't.
  E.get(a).bar satisfies Promise<() => string>;

  // @ts-expect-error - calling a directly is not typed, but works.
  a.bar();
};

// FarRef<T>
const foo2 = async (a: FarRef<{ bar(): string; baz: number }>) => {
  const { baz } = await a;

  baz satisfies number;

  E(a).bar() satisfies Promise<string>;

  // @ts-expect-error - awaiting remotes cannot get functions
  (await a).bar;

  E.get(a).baz satisfies Promise<number>;

  // @ts-expect-error - E.get cannot obtain remote functions
  E.get(a).bar;

  (await a).baz satisfies number;

  // @ts-expect-error 2339 - calling directly is valid but not yet in the typedef
  a.bar;
};

// when
const aPromise = Promise.resolve('a');
const onePromise = Promise.resolve(1);
const remoteString: ERef<string> = Promise.resolve('remote');
E.when(Promise.all([aPromise, onePromise, remoteString])).then(
  ([str, num, remote]) => {
    str satisfies string;
    num satisfies number;
    remote satisfies string;
  },
);
E.when(
  Promise.all([aPromise, onePromise, remoteString]),
  ([str, num, remote]) => {
    str satisfies string;
    num satisfies number;
    remote satisfies string;
    return { something: 'new' };
  },
).then(result => {
  result satisfies { something: string };
});
