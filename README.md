geneEH
======

Behavior can be controlled by genes.


## Documentation

### Links

* Home page - [https://github.com/trevorpao/gene-event-handler](https://github.com/trevorpao/gene-event-handler)
* Demo page - [https://trevorpao.github.io/gene-event-handler/](https://trevorpao.github.io/gene-event-handler/)

### Dependencies
- [jquery](https://jquery.com/)

### Installation

- Bower

```bash
    bower install gene-event-handler
```

### Basic usage

In order to hide all elements when they are supposed to be hidden. (Anti Flickering)

- CSS

```
    .gee {
        display: none;
    }
```

- HTML

```html
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" crossorigin="anonymous"></script>
    <script src="scripts/jquery.gene.min.js"></script>


    <!-- submit a form -->
    <form class="form-inline">
      <div class="form-group">
        <label for="exampleInputName2">Name</label>
        <input type="text" class="form-control" id="exampleInputName2" placeholder="Jane Doe">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail2">Email</label>
        <input type="email" class="form-control" id="exampleInputEmail2" placeholder="jane.doe@example.com">
      </div>

      <button type="button" class="btn btn-default gee" data-uri="/invitation/add_new" data-gene="stdSubmit">Send invitation</button>
    </form>

```

- JavaScript

```javascript
    var gee = gee || $.fn.gene;

    $(document).ready(function() {
        gee.init();
    });
```

## Contribute

You're more than welcome to contribute to this project. 

* Run `gulp serve` to preview and watch for changes
* Run `bower install` --save <package> to install frontend dependencies
* Run `gulp serve:test` to run the tests in the browser
* Run `gulp` to build your webapp for production
* Run `gulp serve:dist` to preview the production build

Enjoy!

## Bug tracker

If you find a bug, please report it [here on Github](https://github.com/trevorpao/geneEH/issues)!
