// noinspection ES6PreferShortImport

import {Canvas} from '../src/Canvas';
import {threejsGraphic} from '../src/threejsGraphic';

jest.mock('../src/threejsGraphic');

describe('Canvas', () => {
    let subject;

    beforeEach(() => {
        jest.clearAllMocks();
        subject = new Canvas('test');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('configure method', () => {
        it('returns this', () => {
            expect(subject.configure()).toBe(subject);
        });
        it('can be called with params arg', () => {
            expect(subject.configure({})).toBe(subject);
        });
    });

    describe('add method', () => {
        it('returns this', () => {
            expect(subject.add([])).toBe(subject);
        });
    });

    describe('clear method', () => {
        it('returns this', () => {
            expect(subject.clear()).toBe(subject);
        });
    });

    describe('show method', () => {
        it('returns this', () => {
            expect(subject.show()).toBe(subject);
        });
        it('calls threejsGraphic for a single canvas', () => {
            const output = {id: 'test-output', children: []};
            jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [
                output
            ]);
            expect(subject.show()).toBe(subject);
            expect(threejsGraphic).toHaveBeenCalledTimes(1);
            expect(threejsGraphic).toHaveBeenCalledWith(
                output, [], {
                    frame: false,
                    viewpoint: [1, 0, 0],
                    equalAspect: true,
                }
            );
        });
        it('calls threejsGraphic for multiple canvases', () => {
            const output2 = {id: 'test-output2', children: []};
            jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [
                {id: 'test-output1', children: []},
                output2,
            ]);
            subject.configure({frame: true});
            subject.add([[], []]);
            // Not valid, actually:
            //subject.configure([{}, {}]);
            expect(subject.show()).toBe(subject);
            expect(threejsGraphic).toHaveBeenCalledTimes(2);
            expect(threejsGraphic).toHaveBeenCalledWith(
                output2, [], {
                    frame: true,
                    viewpoint: [1, 0, 0],
                    equalAspect: true,
                    output: "2",
                    no3DBorder: true,
                }
            );
        });
        it('is no-op if document is null', () => {
            document = undefined;
            expect(subject.show()).toBe(subject);
            expect(threejsGraphic).not.toHaveBeenCalled();
        });
    });
});
