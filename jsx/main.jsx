import Loader from "./components/loader.js";
import App from "./components/app.js";
import Dialog from "./components/dialog/message.js";
import FetchData from "./data.js";

// Initialize the menubar asynchronously
// Please fix this, my brain stopped working
(async function() {
    let menubar = new nw.Menu({ type: 'menubar' });

    let changeViewFactory = (view) => {
        return () => {
            ReactDOM.render(<App activeView={view} />, document.querySelector("#app"));
        }
    }

    let viewmenu = new nw.Menu();

    viewmenu.append(new nw.MenuItem({
        label: "Mods Manager",
        click: changeViewFactory("installed")
    }));
    viewmenu.append(new nw.MenuItem({
        label: "Mods Browser",
        click: changeViewFactory("browse")
    }));
    viewmenu.append(new nw.MenuItem({
        label: "Activity View",
        click: changeViewFactory("activity")
    }));

    menubar.append(new nw.MenuItem({
        label: "View",
        submenu: viewmenu
    }));


    let toolsmenu = new nw.Menu();

    toolsmenu.append(new nw.MenuItem({
        label: "Reload",
        click: () => window.location.reload()
    }));
    toolsmenu.append(new nw.MenuItem({
        label: "Back To CrossCode",
        click: () => {
            // Remove the menu before dying
            nw.Window.get().menu = null;
            window.location = "/ccloader/main.html";
        }
    }));

    menubar.append(new nw.MenuItem({
        label: "Tools",
        submenu: toolsmenu
    }));

    nw.Window.get().menu = menubar;
})();

// Remove Materialize's auto-sliding feature completely
M.Slider.prototype.start = () => {}

$('.tooltipped').tooltip();

ReactDOM.render((
        <div className="preloader-wrapper-wrapper-wrapper">
            <Loader />
        </div>
    ), document.querySelector("#loader")
);

function hasCircularDependencies(modID, checkedModIDs = []) {
	let mod = window.modsData[modID];
	checkedModIDs.push(modID);
	
	for (const depID in mod.dependencies) {
		// The check is done here, and to optimize performance it only returns true
		// Not passing the list also implicates returning true if a mod depends on itself
		if (checkedModIDs.includes(depID)) return true;
	
		// Lazy way to do a deep copy, fix it if you know a better way
		let checkedModIDsCopy = checkedModIDs.map(elem => elem);
		
        if (hasCircularDependencies(window.modsData.find((item) => item.id == depID).index, checkedModIDs))
            return checkedModIDs;
        
        checkedModIDs = checkedModIDsCopy;
	}
	
	return false;
}

FetchData().then(mods => {
    // Store the data globally so that it can be accessed anywhere
    // Sending them through React props would mean passing them down through each component in the hierchary
    // Using a context is only useful if the components are in a single ES6 module
    // Otherwise the context object has to be passed to the componenets which is like the original problem
    // As of writing this, I can't think of a better way to do it
    window.modsTags = [];

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

        if (mod.tags == undefined)
            mod.tags = [];

        return mod;
    }).sort((modA, modB) => {
        // Sort by name (JavaScript compares strings by comparing their characters' Unicode code-points)
        // Lowercase is required since capital-case letters have a different code-point than lower-case ones
        // F.e. "a" > "E" returns true which means "E" should come in first which doesn't make sense
        return modA.name.toLowerCase() > modB.name.toLowerCase() ? 1 : -1;
    });
    
    window.modsData = window.modsData.map((oldMod, index) => {
        // After sorting, store the indices and check for circular dependencies
        var mod = oldMod;

        mod.index = index;
        mod.circularDependencies = hasCircularDependencies(index); 

        // Also store all tags
        for (const tag of mod.tags) {
            if (window.modsTags.find(item => item.toLowerCase() == tag.toLowerCase()) === undefined)
                window.modsTags.push(tag);
        }

        return mod;
    });

    ReactDOM.render(<App activeView="installed" />, document.querySelector("#app"));

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
            {err.stack}
        </Dialog>,
        document.querySelector("#dialogs")
    );
});