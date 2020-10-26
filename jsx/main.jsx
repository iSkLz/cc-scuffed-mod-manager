import Loader from "./components/loader.js";
import App from "./components/app.js";
import Dialog from "./components/dialog/message.js";

// Remove Materialize's auto-sliding feature completely
M.Slider.prototype.start = () => {}

ReactDOM.render((
        <div className="preloader-wrapper-wrapper-wrapper">
            <Loader />
        </div>
    ), document.querySelector("#loader")
);

window.retrieveMods().then(mods => {
    // Store the data globally so that they can be accessed anywhere
    // Sending them through React props would mean passing them down through each component in the hierchary
    // Using a context is only useful if the components are in a single ES6 module
    // Otherwise the context object has to be passed to the componenets which is like the original problem
    // As of writing this, I can't think of a better way to do it    
    window.modsData = mods.filter(mod => {
        // Filter out mods with no ID
        if (mod.id == undefined) return false;

        return true;
    }).map(oldMod => {
        var mod = oldMod;

        // Default values
        if (typeof(mod.name) !== "string")
            mod.name = mod.id;
        
        if (mod.installedVersion == undefined)
            mod.installed = false;
        else {
            mod.installed = true;
            mod.installedVersion = SemVer(mod.installedVersion);
        }

        if (mod.latestVersion != undefined)
            mod.latestVersion = SemVer(mod.latestVersion)
        else if (mod.installed)
            mod.latestVersion = mod.installedVersion;
        else
            mod.latestVersion = SemVer("1.0.0");

        if (mod.dependencies == undefined)
            mod.dependencies = {};

        if (mod.downloads == undefined)
            mod.downloads = [];

        if (mod.enabled == undefined)
            mod.enabled = true;

        return mod;
    }).sort((modA, modB) => {
        // Sort by name (JavaScript compares strings by comparing their characters' Unicode code-points)
        // Lowercase is required since capital-case letters have a different code-point than lower-case ones
        // F.e. "a" > "E" returns true which means "E" should come in first which doesn't make sense
        return modA.name.toLowerCase() > modB.name.toLowerCase() ? 1 : 0;
    }).map((oldMod, index) => {
        // After sorting, store the indices
        var mod = oldMod;
        mod.index = index;
        return mod;
    });

    ReactDOM.render(<App />, document.querySelector("#app"));
	
	$("#menu-fab").animate({opacity: 1.0}, 400);
    $("#loader").fadeOut(500, () => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#loader"));
    });
}).catch(err => {
    const msg = "An error occured while loading the app:";
    console.error(`${msg}\n${err.stack}`);

    const buttons = [
        {
            label: "Reload",
            click() {
                window.location.reload();
            }
        },
        {
            label: "Return To CrossCode",
            click() {
                window.location = "/ccloader/main.html";
            }
        }
    ];

    ReactDOM.render(
        <Dialog title="Error" buttons={buttons} important>
            {err.message}
        </Dialog>,
        document.querySelector("#dialogs")
    );
});