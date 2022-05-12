// noinspection ES6PreferShortImport

import {GeometryOptions} from '../src/GeometryOptions';

describe('GeometryOptions', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('acquires properties from passed constructor arg', () => {
        const subject = new GeometryOptions({test: 1});
        expect(Object.keys(subject)).toStrictEqual(['test']);
        expect(subject.test).toStrictEqual(1);
    });
});
