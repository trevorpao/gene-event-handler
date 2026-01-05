
    gee.hook('syncAll', function(me) {
        const form = me.dataset.ta ? document.getElementById(me.dataset.ta) : me.closest('form');
        const source = me.dataset.source ? document.getElementById(me.dataset.source) : me.closest('form');
        const prefix = me.dataset.prefix;

        gee.clog('syncAll invoked');

        if (!form || !source || !prefix) return;

        gee.clog('syncAll from ' + source.id + ' to inputs with prefix ' + prefix);

        form.querySelectorAll(`input[name|='${prefix}']`).forEach(input => {
            const name = input.getAttribute('name').replace(`${prefix}-`, '');
            const value = source.querySelector(`input[name='${name}']`)?.value || '';
            input.value = value;
        });
    });


export default null;
