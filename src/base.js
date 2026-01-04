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
