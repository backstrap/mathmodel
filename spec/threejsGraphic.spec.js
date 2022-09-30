// noinspection ES6PreferShortImport

import {threejsGraphic} from '../src/threejsGraphic';
import {renderThree} from '../src/renderThree';

jest.mock('../src/renderThree');

describe('threejsGraphic', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        const output = {children:[
            {contentWindow: {
                camera: {position: [0, 0, 0]},
                xMid: 0, yMid: 0, zMid: 0,
                dispatchEvent: jest.fn(),
            }}
        ]};
        threejsGraphic(output, [], {});

        expect(true).toBeTruthy();
    });
});
