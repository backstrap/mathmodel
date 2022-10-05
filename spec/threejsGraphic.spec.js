// noinspection ES6PreferShortImport

import {renderThree} from '../src/renderThree';
import {threejsGraphic} from '../src/threejsGraphic';

jest.mock('../src/renderThree');

describe('threejsGraphic', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('calls renderThree', () => {
        const output = {
            children: [{
                contentWindow: {dispatchEvent: jest.fn()}
            }]
        };
        // noinspection JSCheckFunctionSignatures
        threejsGraphic(output, [], {});
        expect(renderThree).toHaveBeenCalledTimes(1);
    });

    it('resets viewpoint from camera position', () => {
        const output = {
            children: [{
                contentWindow: {
                    camera: {position: {x: 0, y: 0, z: 1}},
                    xMid: 1, yMid: 0, zMid: 0,
                    dispatchEvent: jest.fn(),
                }
            }]
        };
        const config = {viewpoint: 'auto'};
        // noinspection JSCheckFunctionSignatures
        threejsGraphic(output, [], config);
        expect(config.viewpoint).toEqual([-1, 0, 1]);
    });

    it('builds child content window', () => {
        const output = {id: 'test-id', children: [{}]};
        const expected = expect.stringMatching(
            /<iframe (.|\n)* srcdoc=(.|\n)*startOutput\(&quot;test-id&quot;(.|\n)*<\/iframe>/m
        );
        // noinspection JSCheckFunctionSignatures
        threejsGraphic(output, [], {});
        expect(output.innerHTML).toEqual(expected);
    });

    it('sets up auto viewpoint', () => {
        const output = {
            id: 'test',
            children:[{
                contentWindow: {dispatchEvent: jest.fn()},
            }],
        };
        const config = {};
        // noinspection JSCheckFunctionSignatures
        threejsGraphic(output, [], config);
        expect(config.viewpoint).toEqual('auto');
    });

    it('can set borderless style', () => {
        const output = {id: 'test', children:[{}]};
        const config = {no3DBorder: true};
        // noinspection JSCheckFunctionSignatures
        threejsGraphic(output, [], config);
        expect(output.innerHTML).toEqual(expect.stringContaining('border: none'));
    });

    it('runs in windowless environment', () => {
        // noinspection JSValidateTypes
        /** @type {HTMLElement} */
        const output = {id: 'test', children:[{}]};
        const win = window;
        delete global.window;
        threejsGraphic(output, [], {});
        global.window = win;
    });

    it('calls getComputedStyle for Apple devices', () => {
        // noinspection JSValidateTypes
        /** @type {HTMLElement} */
        const output = {id: 'test', children:[{style: {}}]};
        global.getComputedStyle = jest.fn().mockImplementation(
            () => ({width: 100, height: 100})
        );
        navigator.userAgent = 'iPhone';
        threejsGraphic(output, [], {});
        expect(getComputedStyle).toHaveBeenCalled();
        navigator.userAgent = 'Jest';
    });

    it('does not call getComputedStyle for non-Apple devices', () => {
        // noinspection JSValidateTypes
        /** @type {HTMLElement} */
        const output = {id: 'test', children:[{style: {}}]};
        global.getComputedStyle = jest.fn();
        threejsGraphic(output, [], {});
        expect(getComputedStyle).not.toHaveBeenCalled();
    });

    describe('global startOutput function', () => {
        it('calls renderThree', () => {
            expect(renderThree).not.toHaveBeenCalled();
            window.startOutput('test', window);
            expect(renderThree).toHaveBeenCalledTimes(1);
        });

        it('is a no-op for unknown ids', () => {
            window.startOutput('noSuchTest', window);
            expect(renderThree).not.toHaveBeenCalled();
        });
    });
});
