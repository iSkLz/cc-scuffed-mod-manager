export default class ModsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ""
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
    }

    render() {
        // Deep copy
        let items = window.modsData.map((item) => item);

        // Filter out uninstalled mods
        if (this.props.type === "installed") {
            items = items.filter((mod) => {
                return mod.installed;
            });
        }

        // Do searching
        items = items.filter((mod) => {
            return mod.name.toString().toLowerCase().indexOf(this.state.search) != -1;
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

                        <span style={{left: "25px"}} index={mod.index} onClick={e => this.handleModChange(e.target)}>
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
                                Search Settings
                            </div>
                            <div className="collapsible-body">
                                <span>
                                    Lorem ipsum dolor sit amet.<br />
                                    Since when are search settings ciphered in Lorem Ipsum?
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