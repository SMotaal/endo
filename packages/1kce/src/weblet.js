/* eslint-disable @endo/no-optional-chaining */
/* eslint-disable @endo/no-nullish-coalescing */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
import { E } from '@endo/far';
import { makeRefIterator } from '@endo/daemon/ref-reader.js';
import { makeReaderRef } from '@endo/daemon/reader-ref.js';
import { make as makeApp } from './ui/index.js';
import deckBundleJson from '../bundles/bundle-deck.json';
import gameBundleJson from '../bundles/bundle-game.json';

const textEncoder = new TextEncoder();

const deckName = 'deck';
const deckHostAgentName = 'host-deck';
const deckHostHandleName = 'handle-deck';
const gameHostAgentName = 'host-game';
const gameHostHandleName = 'handle-game';

const makeBundle = async (powers, bundleJson, resultName, hostAgentName, hostHandleName) => {
  const workerName = 'MAIN';
  // prep powers
  const isBuiltinPowers = hostAgentName.toUpperCase() === hostAgentName
  if (isBuiltinPowers === false) {
    // make new host
    await E(powers).provideHost(hostHandleName, {
      introducedNames: {
        SELF: 'parent',
      },
      agentName: hostAgentName,
    })
    console.log('made host', hostAgentName)
  }
  // submit bundle
  const temporaryBundleName = `tmp-bundle-${Math.floor(Math.random() * 1000000)}`;
  const bundleText = JSON.stringify(bundleJson);
  const bundleBytes = textEncoder.encode(bundleText);
  const readerRef = makeReaderRef([bundleBytes]);
  await E(powers).storeBlob(readerRef, temporaryBundleName);
  console.log('stored bundle', temporaryBundleName)
  // make
  await E(powers).makeBundle(workerName, temporaryBundleName, hostAgentName, resultName);
  console.log('made bundle', resultName)
  // clean
  await E(powers).remove(temporaryBundleName);
  console.log('cleaned up', temporaryBundleName)
  // get result
  const result = await E(powers).lookup(resultName);
  console.log('got result', resultName, result)
  return result;
}

export const make = (agent) => {
  const followRequests = async () => {
    const requestIterator = makeRefIterator(await E(agent).followMessages())
    for await (const request of requestIterator) {
      if (request.type !== 'request') continue
      // date: "2024-05-16T01:03:07.004Z"
      // description: "game/deck"
      // dismissed: Promise {<pending>}
      // dismisser: Alleged: Dismisser {}
      // from: "ecb641f203ad4f91183adfe272ad3bcad44c6cb4f1ee4b8e29b84765dd8558f97e7676710c9c5ae0f097d5f6a9eb336e68c0c3533e9abb97dbfd489d3374984d:9eaaede4c68ff48208cd2a9a9a2ff0050a3c081c6b7dda0c00aef631cc7ecca188a47829a18cf8274eddf41c3bec5e8dda58c71f1a857b1a34f9c5f474e560ac"
      // number: 11
      // responder: Alleged: EndoResponder {}
      // settled: Promise {<pending>}
      // to: "20f44fabae954fca2220c77be32d7608f77e4b33cb99fa434aa49d91e441f2adce46b688fb8997b90224dd92eab5452904159b65a525224ba227ded448c24048:9eaaede4c68ff48208cd2a9a9a2ff0050a3c081c6b7dda0c00aef631cc7ecca188a47829a18cf8274eddf41c3bec5e8dda58c71f1a857b1a34f9c5f474e560ac"
      // type: "request"
      switch (request.description) {
        // TODO: Change to push
        // case 'game/deck':
        //   // if (request.from !== gameHostAgentId) continue
        //   await E(agent).resolve(
        //     request.number,
        //     deckName,
        //   );
        //   break;
        default:
          console.log('unhandled request', request)
          continue;
      }
    }
  }

  followRequests()

  // form inventory from powers
  const actions = {
    followNameChanges () {
      return E(agent).followNameChanges()
    },
    async has (...names) {
      return E(agent).has(...names)
    },
    async lookup (...names) {
      return E(agent).lookup(...names)
    },
    // TODO: not a reduction of security (the purpose of actions)
    async identify (...names) {
      return E(agent).identify(...names)
    },
    async evaluate (source, endowments, resultName) {
      console.log(
        source,
        Object.keys(endowments),
        Object.values(endowments).map(path => path.split('.')),
        resultName,
      )
      return E(agent).evaluate(
        'MAIN',
        source,
        Object.keys(endowments),
        Object.values(endowments).map(path => path.split('.')),
        resultName,
      )
    },

    
    async addCardToDeckByName (cardName) {
      await E(agent).send(
        // destination agent
        deckHostHandleName,
        // description
        [`add card to deck: "${cardName}"`],
        // name inside send envelope
        ['card'],
        // my petname for the obj
        [cardName],
      );
    },
    
    async makeNewDeck () {
      const resultName = deckName;
      const hostAgentName = deckHostAgentName
      const hostHandleName = deckHostHandleName
      return makeBundle(agent, deckBundleJson, resultName, hostAgentName, hostHandleName)
    },

    async makeGame () {
      const resultName = 'game';
      const hostAgentName = gameHostAgentName
      const hostHandleName = gameHostHandleName
      return makeBundle(agent, gameBundleJson, resultName, hostAgentName, hostHandleName)
    },

    async getGameAgent({ gameAgentName = 'agent-game' }) {
      return actions.lookup(gameAgentName);
    },

    async getGame({ agent, gameAgentName = 'agent-game' }) {
      return E(agent ?? actions.getGameAgent({ gameAgentName })).lookup('game');
    },

    async getDeck({ game, agent, gameAgentName }) {
      return E((game ??= await actions.getGame({ agent, gameAgentName }))).getDeck();
    },

    async getPlayerAtIndex({ game, agent, gameAgentName, playerIndex }) {
      try {
        return E((game ??= await actions.getGame({ agent, gameAgentName }))).playerAtIndex(playerIndex);
      } catch (error) {
        console.error('getPlayerAtIndex error:', error);
        return undefined;
      }
    },

    async getPlayerCount({ game, agent, gameAgentName }) {
      return E((game ??= await actions.getGame({ agent, gameAgentName }))).playerCount();
    },

    async makePlayer({ playerName, agent, gameAgentName = 'agent-game', game }) {
      const newPlayerIndex = await E((game ??= actions.getGame({ agent, gameAgentName }))).newPlayer();
      return actions.evaluate(
        `E(game).playerAtIndex(${Number(newPlayerIndex)})`,
        { game: `${gameAgentName}.game` },
        playerName,
      );
    },

    async setDeckByName({
      newDeckName = 'deck-new',
      agent,
      gameAgentName = 'agent-game',
      game,
    }) {
      const deckId = await actions.identify(newDeckName);
      await E((game ??= actions.getGame({ game, agent, gameAgentName }))).setDeck(deckId);
      return deckId;
    },
  };

  return makeApp({
    actions,
    routines: {

      /**
       * Convenience routine to prepare a new game with a new deck and players.
       * @param {object} options
       * @param {string} [options.newDeckName='deck-new'] - The name of the new deck.
       * @param {string[]} [options.playerNames=['player-0', 'player-1']] - The names of the players.
       * @param {string[]} [options.cardNames=['card-firmament', 'card-lost', 'card-firmament', 'card-lost', 'card-firmament', 'card-lost', 'card-firmament']] - The names of the cards to add to the deck.
       * @param {string} [options.gameAgentName='agent-game'] - The name of the game agent.
       * @param {object} [options.game] - The game object.
       * @param {boolean} [options.autoStartGame=true] - Whether to automatically start the game.
       */
      async prepareNewGame({
        newDeckName = 'deck-new',
        playerNames = ['player-0', 'player-1'],
        cardNames = [
          'card-firmament', 'card-lost',
          'card-firmament', 'card-lost',
          'card-firmament', 'card-lost',
          'card-firmament',
        ],
        gameAgentName = 'agent-game',
        game,
        autoStartGame = true,
      } = {}) {

        const agent = await actions.getGameAgent({ gameAgentName });

        // Ensure we have a reference to the Game
        game ??= await actions.getGame({ agent });

        // Set the deck to the newDeckName
        const deckId = await actions.setDeckByName({ newDeckName, agent, game });

        const deck = await actions.getDeck({ game, agent, gameAgentName });
        const deckCards = await E(deck).getCards();
        const initialDeckCardCount = deckCards?.length;

        if (!initialDeckCardCount) {
          // Add 5 cards of each type to the deck
          for (const cardName of cardNames)
            await actions.addCardToDeckByName(cardName);
        }

        const initialPlayerCount = Number(await actions.getPlayerCount({ game, agent, gameAgentName }));

        for (let playerIndex = initialPlayerCount; playerIndex < playerNames.length; playerIndex++)
          await actions.makePlayer({ playerName: playerNames[playerIndex], agent, gameAgentName, game });

        const players = new Array(Math.max(initialPlayerCount, playerNames.length));

        for (let playerIndex = 0; playerIndex < players.length; playerIndex++)
          players[playerIndex] = await E(game).playerAtIndex(playerIndex);

        return { game, agent, gameAgentName, deckName: newDeckName, deckId, players, initialPlayerCount, initialDeckCardCount, autoStartGame };
      },

    },
  });
};
