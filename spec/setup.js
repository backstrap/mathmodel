
import { JSDOM } from "jsdom";

/**
 * Use this file by specifying it in jest config with:
 *     "setupFiles": [ "./src/setup.js" ]
 */

const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {userAgent: 'Jest'};

