
    gee.hook('autoNext', function(me) {
        const selector = me.dataset.ta;
        const max = me.getAttribute('maxlength');
        const value = me.value || '';

        if (!max) return;

        let target = selector ? document.querySelector(selector) : null;
        if (!target && selector && me.form) {
            target = me.form.querySelector(selector);
        }
        if (!target) {
            let cursor = me.nextElementSibling;
            while (cursor && !(cursor instanceof HTMLInputElement || cursor instanceof HTMLTextAreaElement)) {
                cursor = cursor.nextElementSibling;
            }
            target = cursor;
        }

        if (value.length === Number(max) && target) {
            target.focus();
            if (typeof target.select === 'function') {
                target.select();
            }
        }
    }, 'keyup');

export default null;
