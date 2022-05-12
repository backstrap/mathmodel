// noinspection ES6PreferShortImport

import {GroupedShape} from '../src/GroupedShape';

describe('GroupedShape', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('sets its group name', () => {
        expect(new GroupedShape().options().group).toMatch(/^GroupedShape-id\d+$/);
    });

    it('sets its group name using its classname', () => {
        class Tester extends GroupedShape {};
        expect(new Tester().options().group).toMatch(/^Tester-id\d+$/);
    });
});
