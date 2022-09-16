// noinspection ES6PreferShortImport

// TODO Impl. helpers unit tests
import {canonicalizeConfig, cleanCopy} from '../src/helpers';

describe('canonicalizeConfig', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        canonicalizeConfig({}, [], [], [], [], [])
        expect(true).toBeTruthy();
    });
});

describe('cleanCopy', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('copies a data object', () => {
        const data = {
            id: 1,
            name: 'test',
            arr: [1, 'a', null],
            obj: {id: 2},
            func: function tester() { return true; },
        };
        expect(cleanCopy(data)).not.toBe(data);
        expect(cleanCopy(data)).toEqual(data);
    });
});
