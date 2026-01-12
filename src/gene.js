// Importing utility functions
import utils from './utils.js';
import customElem from './customElem.js';
import { createYell } from './yell.js';

'use strict';

let gene = {
    debug: 0,
    tags: [],
    evts: {},
    funcs: {},
    scriptName: 'gee',
    subFolder: 'scripts/plugins',
    taClass: 'gee',
    apiUri: '/',

    exe: function(func, args) {
        gene.clog('exe::' + func);
        let lvl4 = func.split('|');
        let fun = null;

        for (let i4 = 0; i4 < lvl4.length; i4++) {
            fun = (!gene.check(func)) ? gene.funcs['notfound'] : gene.funcs[func];
            
            fun.call(this, args);
        }

        return 1;
    },

    load: function(functionName) {
        if (!functionName) return null;
        const base = (() => {
            if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
                return document.currentScript.src;
            }
            if (typeof window !== 'undefined' && window.location && window.location.href) {
                return window.location.href;
            }
            return '';
        })();

        const uri = new URL(gene.subFolder + '/' + functionName + '.js', base);
        gene.clog(uri.pathname || uri.href);

        return import(/* @vite-ignore */ uri.pathname).catch(err => {
            gene.err('load fail::' + functionName + ' :: ' + (err && err.message ? err.message : err));
            return null;
        });
    },

    err: function(txt) {
        if (txt !== '')
            this.clog('Error::' + txt);
        else
            this.clog('Error::unknown error!!');
    },

    check: function(functionName) {
        return gene.isset(gene.funcs[functionName]);
    },

    clog: function(txt) {
        utils.logDebug(txt, gene.debug);
    },

    hookTag: function(newTagName, func, opts = {}) {
        // Register a custom element handler; opts.overwrite to replace existing
        return customElem.register(newTagName, func, opts);
    },

    unhookTag: function(tagName) {
        return customElem.unregister(tagName);
    },

    hook: function(functionName, fun, evt) {
        if (!gene.check(functionName)) {
            gene.funcs[functionName] = fun;
            gene.evts[functionName] = (evt != 'undefined') ? evt : 'click';
        } else {
            gene.clog(functionName + ' overwrite?');
        }
    },

    unhook: function(functionName, fun) {
        if (gene.check(functionName)) {
            delete gene.funcs[functionName];
        } else {
            gene.clog(functionName + ' exist?');
        }
    },

    isset: function(obj) {
        if (obj === void 0 || obj === null) {
            return false;
        } else {
            return true;
        }
    },

    promoter: function(evt) {
        let me = this;

        if (me.dataset.nopde !== '1' || me.dataset.bubble !== '1') {
            evt.preventDefault();
            gene.clog('enable bubble');
        }

        me.event = evt;
        gene.clog('start::' + evt.type);
        gene.exe(me.dna[evt.type], me);
    },

    init: function(element = 'body') {
        const root = typeof element === 'string' ? document.querySelector(element) || document : (element || document);

        // Apply registered custom element handlers once per element
        customElem.apply(root, { logger: gene.clog, debug: gene.debug });

        document.querySelectorAll(`${element} .${gene.taClass}`).forEach(me => {
            let evt = me.dataset.event || gene.evts[me.dataset.behavior] || 'click';
            let promoterMapping = {};

            if (me.dataset.gene) {
                me.dataset.gene.split(',').forEach(pair => {
                    const trimmed = pair.trim();
                    const hasColon = trimmed.includes(':');
                    if (hasColon) {
                        let [event, behavior] = trimmed.split(':');
                        promoterMapping[event || 'click'] = behavior || event || 'notfound';
                    } else {
                        // No explicit event specified; fall back to detected/default evt (usually click)
                        promoterMapping[evt] = trimmed || 'notfound';
                    }
                });
            } else {
                promoterMapping[evt] = me.dataset.behavior || 'notfound';
            }

            // Expand semantic hover to mouseenter + mouseleave
            if (promoterMapping.hover) {
                const beh = promoterMapping.hover;
                promoterMapping.mouseenter = beh;
                promoterMapping.mouseleave = beh;
                delete promoterMapping.hover;
            }

            utils.logDebug(promoterMapping, gene.debug);
            const clone = me.cloneNode(true);
            clone.dna = promoterMapping;
            me.replaceWith(clone);
            me = clone;

            Object.entries(promoterMapping).forEach(([event, behavior]) => {
                if (!gene.check(behavior)) {
                    gene.load(behavior);
                }

                if (!gene.check(behavior)) {
                    utils.logDebug('load fail:::' + behavior, gene.debug);
                }

                if (event === 'init') {
                    gene.exe(behavior, me);
                } else if (event === 'scroll') {
                    let target = me.dataset.target;
                    let margin = me.dataset.margin || '0px';
                    me.watchdog = new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) {
                            gene.exe(me.dataset.dna['scroll'], me);
                        }
                    }, {
                        root: me,
                        rootMargin: margin
                    });

                    me.watchdog.observe(me.querySelector(target));
                } else {
                    me.addEventListener(event, gene.promoter);
                }
            });
        });

        document.querySelectorAll(`.${gene.taClass}`).forEach(el => el.classList.remove(gene.taClass));
    }
};

// Expose customElem via gene for external use when needed
gene.customElem = customElem;
gene.yell = createYell(gene);

export default gene;
