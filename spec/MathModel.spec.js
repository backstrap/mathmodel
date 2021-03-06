// noinspection ES6PreferShortImport

import {MathModel} from '../src/MathModel';

describe('MathModel', () => {
    let subject;

    beforeEach(() => {
        subject = new MathModel();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('has a "config" member', () => {
        expect(subject.config).toStrictEqual({});
    });

    it('has a "inputs" member', () => {
        expect(subject.inputs).toStrictEqual([]);
    });

    it('has a "canvas" member of type Canvas', () => {
        expect(subject.canvas.constructor.name).toStrictEqual('Canvas');
    });

    describe('add method', () => {
        it('returns this', () => {
            expect(subject.add([])).toBe(subject);
        });
        it('passes args to Canvas.add', () => {
            jest.spyOn(subject.canvas, 'add');
            subject.add(['a'], ['b']);
            expect(subject.canvas.add).toHaveBeenCalledWith(['a']);
            expect(subject.canvas.add).toHaveBeenCalledWith(['b']);
        });
    });
});
