export default class ModsList extends React.Component {
    constructor(props) {
        super(props);

        this.handleModChange = (e) => {
            let index = Number(e.target.getAttribute("index"));
            this.props.onSelectMod(index);
        };
    }

    render() {
        let items = window.modsData;

        // Filter out uninstalled mods
        if (this.props.type === "installed") {
            items = items.filter((mod) => {
                return mod.installed;
            });
        }

        // Create a collection item element for each mod
        items = items.map((mod) => {
            return (
                <a href="#!" key={mod.id} index={mod.index} className={
                        mod.index == this.props.selected ? "collection-item active" : "collection-item"
                    } onClick={this.handleModChange}>
                    {mod.name}

                    <span className="secondary-content">
                        v{mod.installedVersion.toString()}
                    </span>
                </a>
            );
        });

        return (
            <div className="collection">
                {items}
            </div>
        );
    }
}