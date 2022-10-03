// noinspection ES6PreferShortImport

import {MathModel} from '../src/MathModel';

describe('MathModel', () => {
    let subject;

    beforeEach(() => {
        subject = new MathModel();
        jest.spyOn(document, 'getElementById').mockImplementation(() => ({
            appendChild: () => null
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('has a "config" member', () => {
        expect(subject.config).toStrictEqual({});
    });

    it('has an "inputs" member', () => {
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
            delete window.checkLimits;
        });
        it('uses global window if doc has none', () => {
            const doc = {getElementsByClassName: () => []};
            expect(window.checkLimits).toBe(undefined);
            MathModel.loadMathCells({}, doc);
            expect(window.checkLimits).not.toBe(undefined);
            delete window.checkLimits;
        });
        it('accepts document arg', () => {
            const doc = {defaultView: {addEventListener: () => null}};
            // noinspection JSCheckFunctionSignatures
            MathModel.loadMathCells({}, doc);
            expect(doc.defaultView.checkLimits).not.toBe(undefined);
        });
        it('sets up window onload handler', () => {
            const doc = {
                defaultView: {
                    addEventListener: jest.fn().mockImplementation((id, onload) => onload())
                },
                getElementsByClassName: jest.fn().mockImplementation(() => [{id: 'test'}]),
            };
            // noinspection JSCheckFunctionSignatures
            MathModel.loadMathCells({test: () => ({run: jest.fn()})}, doc);
            expect(doc.getElementsByClassName).toHaveBeenCalledTimes(1);
        });
        it('runs appropriate model', () => {
            const doc = {
                defaultView: {
                    addEventListener: jest.fn().mockImplementation((id, onload) => onload())
                },
                getElementsByClassName: jest.fn().mockImplementation(() => [{id: 'test'}]),
            };
            const model = {run: jest.fn()};
            // noinspection JSCheckFunctionSignatures
            MathModel.loadMathCells({test: () => model}, doc);
            expect(model.run).toHaveBeenCalledTimes(1);
        });
        it('warns about missing models', () => {
            jest.spyOn(console, "warn").mockImplementation(() => undefined);
            const doc = {
                defaultView: {
                    addEventListener: jest.fn().mockImplementation((id, onload) => onload())
                },
                getElementsByClassName: jest.fn().mockImplementation(() => [{id: 'test'}]),
            };
            // noinspection JSCheckFunctionSignatures
            MathModel.loadMathCells({}, doc);
            expect(console.warn).toHaveBeenCalledTimes(1);
        });
    });

    describe('beforeUpdate method', () => {
        it('does nothing', () => {
            expect(subject.beforeUpdate({})).toBe(undefined);
        });
    });

    describe('update method', () => {
        it('does nothing', () => {
            // noinspection JSCheckFunctionSignatures
            expect(subject.update({})).toBe(undefined);
        });
    });

    describe('run method', () => {
        it('accepts string', () => {
            expect(subject.run('test')).toBe(undefined);
        });
        it('accepts node object', () => {
            expect(subject.run({id: 'test'})).toBe(undefined);
        });
        it('generates id for node if needed', () => {
            const node = {};
            subject.run(node);
            expect(node.id).toMatch(/^id[0-9]+$/);
        });
        it('calls beforeUpdate method', done => {
            subject.inputs = [
                {name: 'test'},
                [{name: 'a'}, {name: 'b'}],
            ];
            subject.beforeUpdate = jest.fn().mockImplementation(() => true);
            subject.update = jest.fn().mockImplementation(() => done());
            subject.run({id: 'test'});
            expect(subject.beforeUpdate).toHaveBeenCalledTimes(1);
            expect(subject.beforeUpdate).toHaveBeenCalledWith(
                {test: undefined, a: undefined, b: undefined}
            );
        });
        it('subsequent node updates do synchronous canvas.show()', () => {
            const node = {id: 'test'};
            subject.beforeUpdate = jest.fn().mockImplementation(() => true);
            subject.run(node);
            jest.spyOn(subject.canvas, 'show').mockImplementation(() => subject.canvas);
            expect(subject.canvas.show).not.toHaveBeenCalled();
            node.update();
            expect(subject.canvas.show).toHaveBeenCalledTimes(1);
        });
        it('catches beforeUpdate errors', () => {
            subject.beforeUpdate = jest.fn().mockImplementation(() => { throw new Error('test'); });
            expect(() => subject.run({id: 'test'})).toThrowError('test');
            expect(document.getElementById).toHaveBeenCalledTimes(2);
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
        it('passes arg to Canvas.configure', () => {
            const opts = {animate: true};
            jest.spyOn(subject.canvas, 'configure');
            subject.configure(opts);
            expect(subject.canvas.configure).toHaveBeenCalledWith(opts);
        });
    });
});
