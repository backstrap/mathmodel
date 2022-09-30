// noinspection ES6PreferShortImport

import {GeometryOptions} from '../src/GeometryOptions';

describe('GeometryOptions', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('acquires properties from passed constructor arg', () => {
        const subject = new GeometryOptions({size: 1});
        expect(Object.keys(subject)).toStrictEqual(['size']);
        // noinspection JSUnresolvedVariable
        expect(subject.size).toStrictEqual(1);
    });
});
