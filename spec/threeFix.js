import * as THREE_BASE from 'three';

/**
 * This file avoids a spurious warning about importing multiple copies of THREE
 * when mocking the OrbitControls object.
 * Usage:
 *      import {THREE} from './threeFix';
 *      import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
 *      jest.mock('three/examples/jsm/controls/OrbitControls');
 */
window.__THREE__ = undefined;

export const THREE = THREE_BASE;
