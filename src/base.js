"use strict";

// Hook for handling 'react' events
gee.hook('react', function (me) {
    let target = me.event.target;

    // Traverse up to find the element with 'func' attribute
    while (target && !target.getAttribute('func')) {
        target = target.parentElement;
    }

    if (!target) return;

    let func = target.getAttribute('func');
    let type = target.dataset.event || 'click';

    gee.logDebug(func, gee.debug);

    // Execute the function if the event type matches and the function is valid
    if (type === me.event.type && gee.check(func)) {
        target.event = me.event;
        gee.exe(func, target);
    }
});

// Hook for displaying alerts
gee.hook('alert', function (me) {
    let title = me.title || me.dataset.title;
    let content = me.txt || me.dataset.txt;

    // Display the alert content
    alert(content);
});

// Hook for resetting forms
gee.hook('resetForm', function (me) {
    let form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
    if (form) form.reset();
});

// Hook for standard form submission
gee.hook('stdSubmit', function (me) {
    let form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
    if (!form) return;

    let dAction = function () {
        // Re-enable the button and remove the spinner icon
        me.removeAttribute('disabled');
        let icon = me.querySelector('i');
        if (icon) icon.remove();

        if (this.code !== 1) {
            if (gee.isDefined(this.data) && gee.isDefined(this.data.msg)) {
                gee.alert({
                    title: 'Alert!',
                    txt: this.data.msg
                });
            } else {
                gee.alert({
                    title: 'Error!',
                    txt: 'Server Error, Please Try Later(' + this.code + ')'
                });
            }
        } else {
            if (me.getAttribute('reset') === '1') {
                form.reset();
            }

            if (gee.isDefined(this.data.msg)) {
                gee.alert({
                    title: 'Alert!',
                    txt: this.data.msg
                });
            }

            if (gee.isDefined(this.data.uri)) {
                location.href = (this.data.uri === '') ? gee.apiUri : this.data.uri;
            }

            if (gee.isDefined(this.data.goback)) {
                history.go(-1);
            }

            if (gee.isDefined(this.data.reset)) {
                form.reset();
            }

            if (gee.check(this.data.func)) {
                gee.logDebug(this.data.func, gee.debug);
                gee.exe(this.data.func, me);
            }
        }
    };

    // Clear placeholder values from inputs
    form.querySelectorAll('input').forEach(input => {
        if (input.value === input.placeholder) {
            input.value = '';
        }
    });

    if (!$.validatr.validateForm(form)) {
        return false;
    } else {
        me.setAttribute('disabled', 'disabled');
        let spinner = document.createElement('i');
        spinner.className = 'fa fa-spinner fa-pulse fa-fw';
        me.appendChild(spinner);

        gee.yell(me.dataset.uri, new FormData(form), dAction, dAction);
    }
});

/**
 * Automatically move to the next input field when the current field is filled
 */
gee.hook('autoNext', function (me) {
    let target = document.getElementById(me.dataset.ta) || me.nextElementSibling;
    let value = me.value;

    if (value.length === me.getAttribute('maxlength')) {
        if (target) {
            target.focus();
            target.select();
        }
    }
}, 'keyup');

/**
 * Synchronize all input fields with a specific prefix
 */
gee.hook('syncAll', function (me) {
    let form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
    let source = me.dataset.source ? document.getElementById(me.dataset.source) : me.closest('form');
    let prefix = me.dataset.prefix;

    if (!form || !source || !prefix) return;

    form.querySelectorAll(`input[name|='${prefix}']`).forEach(input => {
        let name = input.getAttribute('name').replace(`${prefix}-`, '');
        let value = source.querySelector(`input[name='${name}']`)?.value || '';
        input.value = value;
    });
});
