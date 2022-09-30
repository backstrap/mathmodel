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

    describe('static method loadMathCells', () => {
        it('defines checkLimits', () => {
            expect(window.checkLimits).toBe(undefined);
            MathModel.loadMathCells({});
            expect(window.checkLimits).not.toBe(undefined);
        });
        it('accepts document arg', () => {
            const doc = {defaultView: {addEventListener: () => null}};
            // noinspection JSCheckFunctionSignatures
            MathModel.loadMathCells({}, doc);
            expect(doc.defaultView.checkLimits).not.toBe(undefined);
        });
    });

    describe('beforeUpdate method', () => {
        it('does nothing', () => {
            expect(subject.beforeUpdate({})).toBe(undefined);
        });
    });

    describe('update method', () => {
        it('does nothing', () => {
            expect(subject.update({})).toBe(undefined);
        });
    });

    describe('run method', () => {
        it('accepts string', () => {
            jest.spyOn(document, 'getElementById').mockImplementation(() => ({
                appendChild: () => null
            }));
            expect(subject.run('test')).toBe(undefined);
        });
        it('accepts node object', () => {
            jest.spyOn(document, 'getElementById').mockImplementation(() => ({
                appendChild: () => null
            }));
            expect(subject.run({id: 'test'})).toBe(undefined);
        });
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

    describe('configure method', () => {
        it('returns this', () => {
            expect(subject.configure({})).toBe(subject);
        });
    });
});
