/* eslint-disable @endo/no-optional-chaining */
/* eslint-disable @endo/no-nullish-coalescing */
/* global document */

import { createRoot } from 'react-dom/client';
import { h } from './util.js';
import { App } from './app.js';

/**
 * Convenience function to log actions.
 * 
 * @template {object} T
 * @param {T} object
 * @param {Partial<{[k in key of T]: 'trace' | 'log' | 'error' | 'warn' | undefined}>} overloads
 * @returns {T}
 */
const loggedProxyFrom = (object, overloads) => {
  const wrappers = {};
  return new Proxy(object, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return typeof value === 'function'
        ? (wrappers[key] ??= (...args) => {
          const method = overloads?.[key] ?? 'log';
          switch (method) {
            case 'trace':
            case 'log':
            case 'warn':
            case 'error':
              console[method](
                `actions.%s(${Array.from(args, () => '%o').join(', ')})`,
                key,
                ...args,
              );
              break;
            default:
          }
          return target[key](...args);
        })
        : value;
    },
  });
};

export const make = async ({ actions, routines }) => {
  document.body.innerHTML = '';

  const style = document.createElement('style');
  style.innerHTML = `
    html, body {
      box-sizing: border-box;
      margin: 0;
      height: 100%;
    }
    body {
      padding: 12px;
      font-family: sans-serif;
      background: #e3e3e3;
    }
  `;
  document.body.appendChild(style);

  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    h(App, {
      actions: loggedProxyFrom(actions),
      // Convenience routine to prepare a new game with a new deck and players.
      //   Comment out the following line to use the default implementation.
      initialState: routines?.prepareNewGame?.(),
    }),
  );
};
