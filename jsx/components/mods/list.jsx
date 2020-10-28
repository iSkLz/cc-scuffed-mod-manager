export default class ModsList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            sortBy: "none",
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
            let state = e.target.type == "radio"
                ? e.target.name
                : e.target.getAttribute("state").toString();
            let value = e.target.type == "checkbox"
                ? e.target.checked
                : e.target.value;

            // [state] is an ES6 computed property index, in case you don't know it
            this.setState({
                [state]: value
            });
        };
        
        this.reverseOrderIfNeeded = (order) => {
            return this.state.reverseSort ? (order == 1 ? -1 : 1) : order;
        }

        this.reverseSorterIfNeeded = (sorter) => {
            return (itemA, itemB) => {
                return this.reverseOrderIfNeeded(sorter(itemA, itemB));
            }
        };

        this.sortByName = (itemA, itemB) => {
            return itemA.name.toLowerCase() > itemB.name.toLowerCase() ? 1 : -1;
        };

        this.sortByEnabled = (itemA, itemB) => {
            return itemA.enabled && itemB.enabled
                // If both are enabled sort by name
                ? this.sortByName(itemA, itemB)
                // If only one is enabled, we only need to check one
                : itemA.enabled ? -1 : 1;
        }

        this.isUpdated = (item) => {
            return item.installed && item.latestVersion.compare(item.installedVersion) == 1;
        }

        this.sortByUpdated = (itemA, itemB) => {
            if (!this.isUpdated(itemA)) return 1;
            if (!this.isUpdated(itemB)) return -1;
            return this.sortByName(itemA, itemB);
        };

        this.sortByInstalled = (itemA, itemB) => {
            if (!itemA.installed) return 1;
            if (!itemB.installed) return -1;
            return this.sortByName(itemA, itemB);
        };
    }

    render() {        
        let items;

        // Filter out uninstalled mods if needed
        if (this.props.type === "installed")
            items = window.modsData.filter((item) => item.installed);
        else items = window.modsData.map(item => item);

        // Sort if needed
        let sorter = null;
        if (this.state.sortBy === "enabled")
            sorter = this.reverseSorterIfNeeded(this.sortByEnabled);
        else if (this.state.sortBy === "updated")
            sorter = this.reverseSorterIfNeeded(this.sortByUpdated);
        else if (this.state.sortBy === "installed")
            sorter = this.reverseSorterIfNeeded(this.sortByInstalled);

        if (sorter !== null) items = items.sort(sorter);

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
            let icon = this.isUpdated(mod) ? "file_download" : "";
            if (mod.installed && this.props.type !== "installed") icon += "check";

            const updateIcon = (
                icon !== ""
                    ? <><i className="material-icons left">{icon}</i></>
                    : <></>
            );

            return (
                <a href="#!" key={mod.id} index={mod.index} className={
                        mod.index == this.props.selected ? "collection-item active" : "collection-item"
                    } onClick={e => this.handleModChange(e.target)}>
                    <span>
                        {
                            this.props.type !== "installed" ? <></> : (
                                <label onClick={e => e.stopPropagation()}>
                                    {
                                        this.makeCheckbox(mod.enabled, mod.permanent)
                                    }
                                    <span>&nbsp;</span>
                                </label>
                            )
                        }

                        <span style={{left: "25px"}} index={mod.index}
                            onClick={e => this.handleModChange(e.target)}>
                            {mod.name}
                        </span>
                    </span>
                    
                    {
                        this.props.type === "installed" ? (
                            <span className="secondary-content" index={mod.index}
                                onClick={e => this.handleModChange(e.target)}>
                                v{mod.installedVersion.toString()}
                                {updateIcon}
                            </span>
                        ) : (
                            <span className="secondary-content" index={mod.index}
                                onClick={e => this.handleModChange(e.target)}>
                                v{mod.latestVersion.toString()}
                                {updateIcon}
                            </span>
                        )
                    }
                </a>
            );
        });

        const log = (thing) => {
            console.log(thing);
            return thing;
        }

        const brIfBig = this.props.small ? <>&nbsp;</> : <br />;

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
                                    Sort by: <br />
                                    <label>
                                        <input className="with-gap" name="sortBy" type="radio" value="none"
                                            checked={this.state.sortBy === "none"}
                                            onChange={this.handleOptionChange} />
                                        <span>Name &nbsp; &nbsp; &nbsp; </span>
                                    </label>
                                    {
                                        this.props.type !== "installed" ? (<>
                                            <label>
                                                <input className="with-gap" name="sortBy" type="radio" value="installed"
                                                    checked={this.state.sortBy === "installed"}
                                                    onChange={this.handleOptionChange} />
                                                <span>Installed</span>
                                            </label>{brIfBig}
                                        </>) : (<>
                                            <label>
                                                <input className="with-gap" name="sortBy" type="radio" value="enabled"
                                                    checked={this.state.sortBy === "enabled"}
                                                    onChange={this.handleOptionChange} />
                                                <span>Enabled</span>
                                            </label>{brIfBig}
                                        </>)
                                    }
                                    <label>
                                        <input className="with-gap" name="sortBy" type="radio" value="updated"
                                            checked={this.state.sortBy === "updated"}
                                            onChange={this.handleOptionChange} />
                                        <span>Updated</span>
                                    </label>
                                    <br /><br />
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

    componentDidUpdate() {
        if (this.state.sortBy == "enabled" && this.props.type !== "installed")
            this.setState({sortBy: "none"});
        if (this.state.sortBy == "installed" && this.props.type === "installed")
            this.setState({sortBy: "none"});
    }
}