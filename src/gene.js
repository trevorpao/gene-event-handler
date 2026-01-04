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

    // Standard form submission handler
    stdSubmit: function(me) {
        let form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
        if (!form) return;

        let dAction = function() {
            me.removeAttribute('disabled');
            let icon = me.querySelector('i');
            if (icon) icon.remove();

            if (this.code == '1') {
                if (me.getAttribute('reset') === '1') {
                    form.reset();
                }
                if (utils.isDefined(this.data.msg)) {
                    gene.alert({
                        title: 'Alert!',
                        txt: this.data.msg
                    });
                }
                if (utils.isDefined(this.data.uri)) {
                    location.href = (this.data.uri === '') ? gene.apiUri : this.data.uri;
                }
                if (utils.isDefined(this.data.goback)) {
                    history.go(-1);
                }
                if (utils.isDefined(this.data.reset)) {
                    form.reset();
                }
                if (gene.check(this.data.func)) {
                    utils.logDebug(this.data.func, gene.debug);
                    gene.exe(this.data.func, me);
                }
            } else {
                if (utils.isDefined(this.data) && utils.isDefined(this.data.msg)) {
                    gene.alert({
                        title: 'Alert!',
                        txt: this.data.msg
                    });
                } else {
                    gene.alert({
                        title: 'Error!',
                        txt: 'Server Error, Please Try Later(' + this.code + ')'
                    });
                }
            }
        };

        let inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value == input.placeholder) {
                input.value = '';
            }
        });

        if (!validatr.validateForm(form)) {
            return false;
        } else {
            me.disabled = true;
            let spinner = document.createElement('i');
            spinner.className = 'fa fa-spinner fa-pulse fa-fw';
            me.appendChild(spinner);
            gene.yell(me.dataset.uri, new FormData(form), dAction, dAction);
        }
    },

    yell: function(uri, postData, successCB, errorCB, type = 'POST', hideLoadAnim = false) {
        let json = uri.includes('://') ? 'jsonp' : 'json';
        uri = uri.includes('://') ? uri : gene.apiUri + uri;

        if (!hideLoadAnim) {
            gene.loadAnim('show');
        }

        fetch(uri, {
            method: type,
            body: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(j => {
            if (j) {
                utils.logDebug(j, gene.debug);
                if (utils.isDefined(j.errorCode)) {
                    if (typeof errorCB === 'function') {
                        errorCB.call(j);
                    } else {
                        gene.alert({
                            title: 'Error!',
                            txt: 'Server Error, Please Try Later(' + j.errorCode + ')'
                        });
                    }
                } else {
                    if (typeof successCB === 'function') {
                        successCB.call(j);
                    }
                }
            } else {
                gene.alert({
                    title: 'Error!',
                    txt: 'Server Error, Please Try Later(2)'
                });
            }

        }).catch(error => {
            gene.err('ajax fail(' + error.message + ')!!');
        }).finally(() => {
            utils.logDebug('ajax complete', gene.debug);
            if (!hideLoadAnim) {
                gene.loadAnim('hide');
            }
        });
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
