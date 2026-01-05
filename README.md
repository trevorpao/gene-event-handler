geneEH
======

Behavior can be controlled by genes.


## Documentation

### Links

* Home page - [https://github.com/trevorpao/geneEH](https://github.com/trevorpao/geneEH)
* Demo page - [https://trevorpao.github.io/geneEH/](https://trevorpao.github.io/geneEH/)

### View docs locally

```bash
npm install    # first time only
npm run readme # serves ./document at http://localhost:3000
```

### Dependencies
- [validatr](https://github.com/macek/jquery-validate) or equivalent form validator used by the project (ES module port bundled here)

### Installation

#### Via npm (recommended for development)

```bash
npm install       # install dependencies
npm run watch     # start parcel dev server at http://localhost:1234
npm run build     # build production assets into dist/
```

#### Via Bower (legacy)

```bash
bower install gene-event-handler
```

### Basic usage (ES modules)

In order to hide all elements when they are supposed to be hidden. (Anti Flickering)

- CSS

```
.gee {
  display: none;
}
```

- HTML + JavaScript (bundled/module workflow)

```html
<script type="module">
  import gee from './scripts/gene.js';

  // Optional configuration
  gee.apiUri = 'https://your.api/endpoint';
  gee.debug = 1;

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    gee.init();
  });
    
  // Example: submit a form
  // <button type="button" class="gee" data-uri="/invitation/add_new" data-gene="stdSubmit">Send invitation</button>
</script>
```

### Basic usage (legacy build)

If you are using the prebuilt script output from this repository’s `app/scripts` bundle, include it directly:

```html
<script src="scripts/gene.min.js"></script>

<script>
  var gee = window.gee;
  gee.init();
  // Note: legacy bundle no longer ships a jQuery/cash shim; if you relied on `$`, add your own.
</script>
```

Enjoy!

## Bug tracker

If you find a bug, please report it [here on Github](https://github.com/trevorpao/geneEH/issues)!
