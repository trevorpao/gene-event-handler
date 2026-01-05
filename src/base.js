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

gee.hook('notfound', function (me) {
    gee.err('command not found!!');
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


gee.hook('stdSubmit', async function(me) {
    const form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
    if (!form) return;

    const finish = () => {
      me.removeAttribute('disabled');
      const icon = me.querySelector('i');
      if (icon) icon.remove();
    };

    const handleResult = res => {
      finish();
      const result = res || {};

      if (result.code !== 1 || result.ok === false) {
        if (isDefined(result.data) && isDefined(result.data.msg)) {
          gee.alert && gee.alert({ title: 'Alert!', txt: result.data.msg });
        } else {
          gee.alert && gee.alert({ title: 'Error!', txt: 'Server Error, Please Try Later(' + (result.code || 0) + ')' });
        }
        return;
      }

      if (me.getAttribute('reset') === '1' || isDefined(result.data?.reset)) {
        form.reset();
      }

      if (isDefined(result.data?.msg)) {
        gee.alert && gee.alert({ title: 'Alert!', txt: result.data.msg });
      }

      if (isDefined(result.data?.uri)) {
        location.href = result.data.uri === '' ? gee.apiUri : result.data.uri;
      }

      if (isDefined(result.data?.goback)) {
        history.go(-1);
      }

      if (gee.check(result.data?.func)) {
        gee.logDebug(result.data.func, gee.debug);
        gee.exe(result.data.func, me);
      }
    };

    // Clear placeholder values from inputs
    form.querySelectorAll('input').forEach(input => {
      if (input.value === input.placeholder) {
        input.value = '';
      }
    });

    if (validatr && !validatr.validateForm(form)) {
        return false;
    }

    me.setAttribute('disabled', 'disabled');
    const spinner = document.createElement('i');
    spinner.className = 'fa fa-spinner fa-pulse fa-fw';
    me.appendChild(spinner);

    const result = await gee.yell(me.dataset.uri, new FormData(form));
    handleResult(result);
});