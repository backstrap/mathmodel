// noinspection ES6PreferShortImport

import {Canvas} from '../src/Canvas';

describe('Canvas', () => {
    let subject;

    beforeEach(() => {
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
        it('returns this when called for a single canvas', () => {
            jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [
                {id: 'test', children: []}
            ]);
            expect(subject.show()).toBe(subject);
        });
        it('returns this when called for multiple canvases', () => {
            jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [
                {id: 'testA', children: []},
                {id: 'testB', children: []},
            ]);
            subject.add([[], []]);
            // Not valid, actually:
            //subject.configure([{}, {}]);
            expect(subject.show()).toBe(subject);
        });
        it('returns this even with null document', () => {
            document = undefined;
            expect(subject.show()).toBe(subject);
        });
    });
});
