// noinspection ES6PreferShortImport

import {JSDOM} from 'jsdom';
import {renderThree} from '../src/renderThree';
import {threejsGraphic} from '../src/threejsGraphic';

jest.mock('../src/renderThree');

describe('threejsGraphic', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        // noinspection JSValidateTypes
        /** @type {Node} */
        const output = {children:[
                {contentWindow: {
                        camera: {position: [0, 0, 0]},
                        xMid: 0, yMid: 0, zMid: 0,
                        dispatchEvent: jest.fn(),
                    }}
            ]};
        threejsGraphic(output, [], {});

        expect(renderThree).toHaveBeenCalledTimes(1);
    });

    it('dummy test 2', () => {
        global.getComputedStyle = jest.fn().mockImplementation(
            () => ({width: 100, height: 100})
        );
        // noinspection JSValidateTypes
        /** @type {Node} */
        const output = {id: 'test', children:[{style: {}}]};
        navigator.userAgent = 'iPhone';
        threejsGraphic(output, [], {});

        expect(getComputedStyle).toHaveBeenCalled();
    });

    describe('global startOutput', () => {
        it('dummy test', () => {
            window.startOutput('test');
            expect(renderThree).toHaveBeenCalledTimes(1);
        });
    });
});
