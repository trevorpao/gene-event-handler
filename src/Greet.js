class App {
    constructor() {
        this.plugins = {};
    }

    use(plugin) {
        if (!plugin || typeof plugin.install !== 'function') {
            throw new Error('Invalid plugin. Plugin should have an install method.');
        }

        if (this.plugins[plugin.name]) {
            throw new Error(`Plugin with name "${plugin.name}" already exists.`);
        }

        this.plugins[plugin.name] = plugin.install();
    }

    getPlugin(name) {
        const plugin = this.plugins[name];
        if (!plugin) {
            throw new Error(`Plugin with name "${name}" does not exist.`);
        }
        return plugin;
    }

    get $greet() {
        return this.getPlugin('greet');
    }
}

let app = new App();

class GreetPlugin {
    constructor() {
        this.name = "greet";
    }

    install() {
        return {
            hello: this.hello,
            goodbye: this.goodbye,
        };
    }

    hello() {
        console.log("Hello, World!");
    }

    goodbye() {
        console.log("Goodbye, World!");
    }
}

app.use(new GreetPlugin());

app.$greet.hello(); // Hello, World!
app.$greet.goodbye(); // Goodbye, World!