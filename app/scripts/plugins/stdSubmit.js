'use strict';

// Standard form submission handler (plugin form)
// Relies on global gee + validatr shim.
;(function(gee) {
  if (!gee || typeof gee.hook !== 'function') return;

  gee.hook('stdSubmit', function(me) {
    const form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
    if (!form) return;

    const dAction = function() {
      me.removeAttribute('disabled');
      const icon = me.querySelector('i');
      if (icon) icon.remove();

      if (this.code !== 1) {
        if (gee.isDefined(this.data) && gee.isDefined(this.data.msg)) {
          gee.alert({ title: 'Alert!', txt: this.data.msg });
        } else {
          gee.alert({ title: 'Error!', txt: 'Server Error, Please Try Later(' + this.code + ')' });
        }
      } else {
        if (me.getAttribute('reset') === '1') {
          form.reset();
        }

        if (gee.isDefined(this.data.msg)) {
          gee.alert({ title: 'Alert!', txt: this.data.msg });
        }

        if (gee.isDefined(this.data.uri)) {
          location.href = this.data.uri === '' ? gee.apiUri : this.data.uri;
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

    const validator = typeof validatr !== 'undefined' ? validatr : (typeof window !== 'undefined' ? window.validatr : null);
    if (validator && !validator.validateForm(form)) {
      return false;
    }

    me.setAttribute('disabled', 'disabled');
    const spinner = document.createElement('i');
    spinner.className = 'fa fa-spinner fa-pulse fa-fw';
    me.appendChild(spinner);

    gee.yell(me.dataset.uri, new FormData(form), dAction, dAction);
  });
})(window.gee);
