// Importing utility functions
import utils from './utils.js';
import validatr from './validatr.js';

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

    yell: async function(uri, postData, successCB, errorCB, type = 'POST', hideLoadAnim = false, opts = {}) {
        // Allow passing an options object as the 5th arg for flexibility
        const options = (typeof type === 'object' && type !== null) ? type : opts;
        const method = (typeof type === 'string') ? type : (options.method || 'POST');
        const fullUri = uri.includes('://') ? uri : gene.apiUri + uri;

        const mergedHeaders = { ...(options.headers || {}) };
        let body = postData;

        // Auto JSON-encode plain objects; leave FormData/Blob untouched
        const isPlainObject = postData && typeof postData === 'object' && !(postData instanceof FormData) && !(postData instanceof Blob);
        if (isPlainObject) {
            body = JSON.stringify(postData);
            if (!mergedHeaders['Content-Type']) mergedHeaders['Content-Type'] = 'application/json';
        }

        const showLoading = options.hideLoadAnim !== undefined ? !options.hideLoadAnim : !hideLoadAnim;
        if (showLoading) {
            gene.loadAnim('show');
        }

        const fetchOptions = {
            method,
            body,
            headers: mergedHeaders,
            credentials: options.credentials || 'same-origin',
            mode: options.mode || 'cors'
        };

        if (options.signal) fetchOptions.signal = options.signal;

        let normalized = { ok: false, code: 0, data: null, error: null, status: 0 };

        try {
            const res = await fetch(fullUri, fetchOptions);
            let data = null;
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }

            const payload = data || {};
            const code = utils.isDefined(payload.code) ? payload.code : (res.ok ? 1 : res.status);
            const msg = payload.msg || payload.error || res.statusText || 'Server Error';
            const isErrorPayload = utils.isDefined(payload.errorCode) || (!res.ok);

            normalized = {
                ok: res.ok && !isErrorPayload,
                code,
                data: payload.data !== undefined ? payload.data : payload,
                error: isErrorPayload ? msg : null,
                status: res.status
            };

            if (!normalized.ok) {
                if (typeof errorCB === 'function') {
                    errorCB.call(normalized);
                } else {
                    gene.alert({ title: 'Error!', txt: msg + '(' + code + ')' });
                }
                return normalized;
            }

            if (typeof successCB === 'function') {
                successCB.call(normalized);
            }
            return normalized;
        } catch (error) {
            normalized = { ok: false, code: 0, data: null, error: error.message, status: 0 };
            gene.err('ajax fail(' + error.message + ')!!');
            if (typeof errorCB === 'function') {
                errorCB.call(normalized);
            }
            return normalized;
        } finally {
            utils.logDebug('ajax complete', gene.debug);
            if (showLoading) {
                gene.loadAnim('hide');
            }
        }
    },

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
        let uri = new URL(gene.subFolder + '/' + functionName + '.js', import.meta.url);

        gene.clog(uri);
        import(uri.pathname);
    },

    notfound: function(me) {
        gene.err('command not found!!');
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
        if (typeof console != 'undefined' && gene.debug == 1) {
            if (typeof txt == 'string' || typeof txt == 'number') {
                console.log('gene::' + txt);
            } else {
                console.log('gene::' + typeof(txt));
                console.log(txt);
            }
        }
    },

    hookTag: function(newTagName, func) {
        if (!gene.check(newTagName)) {
            gene.tags.push(newTagName);
            gene.hook(newTagName, func);
        } else {
            gene.clog(newTagName + ' overwrite?');
        }
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
        gene.exe(me.dna[evt.type], $(me));
    },

    init: function(element = 'body') {
        gene.tags.forEach(tag => {
            gene.exe(tag, document.querySelectorAll(tag));
        });

        document.querySelectorAll(`${element} .${gene.taClass}`).forEach(me => {
            let evt = me.dataset.event || gene.evts[me.dataset.behavior] || 'click';
            let promoterMapping = {};

            if (me.dataset.gene) {
                me.dataset.gene.split(',').forEach(pair => {
                    let [event, behavior] = pair.split(':');
                    promoterMapping[event || 'click'] = behavior || event;
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
            me.dna = promoterMapping;
            me.replaceWith(me.cloneNode(true));

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

export default gene;
