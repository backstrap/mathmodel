// noinspection ES6PreferShortImport

// TODO Impl. Canvas unit tests (three/examples/jsm/ import issue)
describe('Canvas', () => {
    it('dummy test', () => {
        expect(true).toBeTruthy();
    });
});
/*
import {Canvas} from '../src/Canvas';

describe('Canvas', () => {
    let subject;

    beforeEach(() => {
        subject = new Canvas();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('configure method', () => {
        it('returns this', () => {
            expect(subject.configure({})).toBe(subject);
        });
    });

    describe('setScriptUrl method', () => {
        it('returns this', () => {
            expect(subject.setScriptUrl('test.js')).toBe(subject);
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
    });

    describe('export method', () => {
        it('returns STL data string', () => {
            expect(subject.export()).toBe('');
        });
    });
});
*/
