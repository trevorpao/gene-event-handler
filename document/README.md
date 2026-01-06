geneEH
======

Behavior can be controlled by genes.


## Documentation

### Links

* Home page - [https://github.com/trevorpao/geneEH](https://github.com/trevorpao/geneEH)
* Demo page - [https://trevorpao.github.io/geneEH/](https://trevorpao.github.io/geneEH/)

### Dependencies
- [validatr](https://github.com/macek/jquery-validate) or equivalent form validator used by the project (ES module port bundled here)

### Installation

- npm（開發推薦）

```bash
npm install       # 安裝依賴
npm run watch     # 啟動 parcel dev server（app/index.html），預設 http://localhost:1234
npm run build     # 產出 dist/
```

- Bower（v1）

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

### Basic usage (v1 build)

If you are using the prebuilt script output from this repository’s `app/scripts` bundle, include it directly:

```html
<script src="scripts/gene.min.js"></script>

<script>
  var gee = window.gee;
  gee.init();
  // 若仍需 `$`，請自行引入（v1 bundle 不再附帶 jQuery/cash）。
</script>
```

## Contribute

You're more than welcome to contribute to this project. 

* Run `gulp serve` to preview and watch for changes
* Run `bower install --save <package>` to install frontend dependencies
* Run `gulp serve:test` to run the tests in the browser
* Run `gulp` to build your webapp for production
* Run `gulp serve:dist` to preview the production build

Enjoy!

## Bug tracker

If you find a bug, please report it [here on Github](https://github.com/trevorpao/geneEH/issues)!
