export default class ModsList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            fuzzySearch: false,
            reverseSort: false
        };

        this.handleSearchChange = (e) => {
            this.setState({
                search: e.target.value.toString().toLowerCase()
            });
        };

        this.handleModChange = (elem) => {
            let index = Number(elem.getAttribute("index"));
            this.props.onSelectMod(index);
        };

        this.initCollapsible = (elem) => {
            M.Collapsible.init(elem, {});
        };

        this.doNothing = () => {};

        this.makeChecked = (elem) => {
            $(elem).attr("checked", "checked");
        }

        this.makeCheckbox = (checked, disabled) => {
            if (checked) {
                if (disabled)
                    return <input type="checkbox" className="filled-in" ref={this.makeChecked} disabled />;
                return <input type="checkbox" className="filled-in" ref={this.makeChecked} />;
            } else if (disabled)
                return <input type="checkbox" className="filled-in" disabled />;
            return <input type="checkbox" className="filled-in" />;
        }

        this.handleOptionChange = (e) => {
            let state = e.target.getAttribute("state").toString();
            let value = e.target.type == "checkbox" ? e.target.checked : e.target.value;

            // [state] is an ES6 computed property index, in case you don't know it
            this.setState({
                [state]: value
            });
        }
    }

    render() {
        let items;

        // Deep copy & reverse order
        if (this.state.reverseSort) {
            items = [];
            let count = window.modsData.length;

            // Filter out uninstalled mods
            if (this.props.type === "installed") {
                window.modsData.forEach((item, index) => {
                    if (item.installed) items[count - index] = item;
                });
                
                // Remove the empty spaces that might be left
                items = items.filter(item => item);
            } else
                window.modsData.forEach((item, index) => items[count - index] = item);
        
        // Only deep copy
        } else {
            // Filter out uninstalled mods
            if (this.props.type === "installed")
                items = window.modsData.filter((item) => item.installed);
            else
                items = window.modsData.map((item) => item);
        }

        // Do searching
        items = items.filter((mod) => {
            let modName = mod.name.toLowerCase();
            let search = this.state.search.toLowerCase();
    
            // Fuzzy matching
            if (this.state.fuzzySearch)
            {
                let chars = search.split("");

                for (const char of modName.split("")) {
                    if (char == chars[0])
                        chars.shift();
                }

                // No characters left = match
                return chars.length == 0;
            }

            // Normal matching
            return mod.name.toString().toLowerCase().indexOf(search) != -1;
        });

        // Create a collection item element for each mod
        items = items.map((mod) => {
            return (
                <a href="#!" key={mod.id} index={mod.index} className={
                        mod.index == this.props.selected ? "collection-item active" : "collection-item"
                    } onClick={e => this.handleModChange(e.target)}>
                    <span>
                        <label onClick={e => e.stopPropagation()}>
                            {
                                this.makeCheckbox(mod.enabled, mod.permanent)
                            }
                            <span>&nbsp;</span>
                        </label>

                        <span style={{left: "25px"}} index={mod.index}
                            onClick={e => this.handleModChange(e.target)}>
                            {mod.name}
                        </span>
                    </span>

                    <span className="secondary-content" index={mod.index} onClick={e => this.handleModChange(e.target)}>
                        v{mod.installedVersion.toString()}
                    </span>
                </a>
            );
        });

        return (
            <div className="collection">
                <div className="row">
                    <ul className="collapsible no-shadow" ref={this.initCollapsible}>
                        <li>
                            <div className="collapsible-header">
                                <i className="material-icons">settings</i>
                                Search Options
                            </div>
                            <div className="collapsible-body">
                                <span>
                                    <label>
                                        <input type="checkbox" className="filled-in" state="fuzzySearch" ref={
                                                this.state.fuzzySearch ? this.makeChecked : this.doNothing
                                            }
                                            onChange={this.handleOptionChange} />
                                        <span>Fuzzy Matching</span>
                                    </label><br /><br />
                                    <label>
                                        <input type="checkbox" className="filled-in" state="reverseSort" ref={
                                                this.state.reverseSort ? this.makeChecked : this.doNothing
                                            }
                                            onChange={this.handleOptionChange} />
                                        <span>Reverse Sort</span>
                                    </label>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <div className="col s1" />
                    <div className="input-field col s10">
                        <input id="search-input" type="text" onChange={this.handleSearchChange} />
                        <label htmlFor="search-input">Search</label>
                    </div>
                    <div className="col s1" />
                </div>

                {items}
            </div>
        );
    }
}