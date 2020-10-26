import Loader from "../loader.js";
import MarkdownRenderer from "../md-renderer.js";

export default class ModDetails extends React.Component {
    constructor(props) {
        super(props);

        // Object refs have to be used intead of callback refs in combination with didComponentUpdate due
        // to React DOM caching, which could lead to the callback refs not being executed and therefore
        // the components not being initialized
        this.tabsRef = React.createRef();
        this.sliderRef = React.createRef();

        this.titleRef = React.createRef();
        this.loaderRef = React.createRef();

        this.onElementLoad = () => {
            $(this.loaderRef.current).fadeOut(100, () => {
                // This triggers some errors apparently
                //$(this.loaderRef.current).remove();
            });
        };

        // Remove the picture and force a render
        this.onElementLoadError = () => {
            delete window.modsData[this.props.modIndex].header.picture;
            this.forceUpdate();
        };

        this.initDOM = () => {
            let title = $(this.titleRef.current);
            title.css("color", this.headColor);
            title.find(".description").css("color", this.descColor);

            // Destroy (if possible) & initiate the slider
            // TODO: Implement a better way to check if it exists
            try {
                M.Slider.getInstance(this.sliderRef.current).destroy();
            } catch {}

            M.Slider.init(this.sliderRef.current, {
                height: 360
            });

            // Do the same for tabs
            try {
                M.Tabs.getInstance(this.tabsRef.current).destroy();
            } catch {}

            M.Tabs.init(this.tabsRef.current, {});
        };

        this.canUpdate = () => {
            const mod = window.modsData[this.props.modIndex];
            return (mod.latestVersion.compare(mod.installedVersion) == 1);
        };

        this.canRemove = () => {
            const mod = window.modsData[this.props.modIndex];
            if (mod.permanent) return false; return true;
        };

        this.getDependencies = () => {
            const displayedMod = window.modsData[this.props.modIndex];
            let deps = [];
            
            for (const mod of window.modsData) {
                // If the current mod is a dependency
                if (displayedMod.dependencies[mod.id] != undefined)
                    deps.push({
                        name: mod.name,
                        index: mod.index,
                        id: mod.id,
                        fulfilled: mod.installed &&
                            mod.installedVersion.compare(SemVer(displayedMod.dependencies[mod.id])) != -1
                    });
            }
            
            return deps;
        };

        this.navigate = (e) => {
            e.preventDefault();
            // If retrieving the index attribute fails, fallback to the current mod
            // In other words, silently do not navigate
            this.props.onNavigate(Number(e.target.getAttribute("index") || this.props.modIndex));
        };
    }

    render() {
        if (this.props.modIndex == undefined)
            return <></>;

        const details = window.modsData[this.props.modIndex];

        let headDetails = details.header != undefined ? details.header : {};
        this.headColor = headDetails.color || (headDetails.picture == undefined ? "#2196F3" : "white");
        this.descColor = headDetails.picture == undefined ? "black" : headDetails.color || "white";

        const headTitle = (
            <>
                <div className="card-title" ref={this.titleRef}>
                    <span className="title">{details.name}</span>
                    {
                        details.description == undefined ? <></> : (<>
                            <br />
                            <span className="description">{details.description}</span>
                        </>)
                    }
                </div>
            </>
        );

        // We listen for onLoad to fade-out the loader
        // If an error occured while loading the image, a re-render is triggered but this time without the picture
        const head = headDetails.picture == undefined ? headTitle : (
            <div className="card-image">
                <img src={headDetails.picture} onLoad={this.onElementLoad} onError={this.onElementLoadError} />
                {headTitle}
            </div>
        );

        const tabs = (
            <div className="card-tabs">
                <ul className="tabs tabs-fixed-width" ref={this.tabsRef}>
                    <li className="tab" key="main"><a className="active" href="#details">Details</a></li>
                    {
                        details.overview == undefined ?
                        <li className="tab disabled" key="desc"><a href="#overview">Overview</a></li> :
                        <li className="tab"><a href="#overview">Overview</a></li>
                    }
                    {
                        details.pictures == undefined || details.pictures.length == 0 ?
                        <li className="tab disabled" key="pics"><a href="#screenshots">Screenshots</a></li> :
                        <li className="tab"><a href="#screenshots">Screenshots</a></li>
                    }
                </ul>
            </div>
        );

        const tags = details.tags == undefined ? <></> : (<>
            <br />
            <b>Tags: </b>
            {
                details.tags.map((tag, index) => {
                    return (<>
                        <div className="chip" key={index}>
                            {tag}
                        </div>
                    </>);
                })
            }
            <br />
        </>);

        const actionButtonClass = "waves-effect waves-light btn-large blue no-shadow";
        let updatePostfix = "", removePostfix = "";
        if (!this.canUpdate()) updatePostfix = " disabled";
        if (!this.canRemove()) removePostfix = " disabled";

        const actions = (<>
            <a className={`${actionButtonClass}${updatePostfix}`} key="updateBtn" href="#!">
                <i className="material-icons left">sync</i>Update
            </a>
            <a className={`${actionButtonClass}${removePostfix}`} key="removeBtn" href="#!">
                <i className="material-icons left">delete</i>Uninstall
            </a>
        </>);

        let depsItems = this.getDependencies().map((dep) => {
            dep.mark = dep.fulfilled ? " (✔)" : "";
            let item = (
                <li key={dep.id}>
                    <a href="#!" index={dep.index} onClick={this.navigate}>
                        {dep.name}
                    </a>
                    {dep.mark}
                </li>
            );
            return item;
        });

        const deps = depsItems.length == 0 ? undefined : (<>
            <br />
            <b>Dependencies:</b>
            <ol>
                {depsItems}
            </ol>
        </>);

        // Regex to remove the "GMT+0310 (Central European Standard Time)"-like thing
        // TODO: Implement proper date parsing
        const dateRegex = / \D*\+\d{4} \(.*\)/gi;

        const contentDetails = (
            <div id="details" className="keep-padding">
                <b>Name:</b> {details.name}<br />
                {details.description == undefined ? <></> : (<>
                    <b>Description:</b> {details.description}<br />
                </>)}
                {details.author == undefined ? <></> : (<>
                    <b>Author:</b> {details.authorPage == undefined ? <>{details.author}<br /></> : (
                        <><a href={details.authorPage}>{details.author}</a><br /></>
                    )}
                </>)}
                
                <br />
                <b>Version (Installed):</b> {details.installedVersion.toString()}<br />
                <b>Version (Newest):</b> {details.latestVersion.toString()}<br />
                <br />

                {details.addedOn == undefined ? <></> : (<>
                    <b>Published On:</b> {new Date(Number(details.addedOn)).toString().replace(dateRegex, "")}<br />
                </>)}
                {details.updatedOn == undefined ? <></> : (<>
                    <b>Updated On:</b> {new Date(Number(details.updatedOn)).toString().replace(dateRegex, "")}
                    <br />
                </>)}

                {deps}

                {tags}

                <br />
                <div className="full-width flex-equal-box marginated">
                    {actions}
                </div>
            </div>
        );

        const contentOverview = details.overview == undefined ? <></> : (
            <div id="overview" className="keep-padding">
                <MarkdownRenderer>{details.overview}</MarkdownRenderer>
            </div>
        );

        const contentScreenshots = details.pictures == undefined || details.pictures.length == 0 ? <></> : (
            <div id="screenshots" className="keep-padding center">
                <div className="slider preloader-wrapper-wrapper-hor" style={{width: "640px"}} ref={this.sliderRef}>
                    <ul className="slides">
                        {details.pictures.map((picURL) => <li><img src={picURL} /></li>)}
                    </ul>
                </div>
            </div>
        );

        const content = (
            <div className="card-content keep-padding">
                {contentDetails}
                {contentOverview}
                {contentScreenshots}
            </div>
        );

        const pages = details.downloads.map((link, index) => {
            switch (link.type) {
                case "github":
                    return <a href={`https://github.com/${link.repo}`} key={index}>GitHub</a>;
                case "gamebanana":
                    return <a href={`https://gamebanana.com/${link.category}/${link.id}`} key={index}>GameBanana</a>;
                default:
                    return <a href={`${link.URL}`} key={index}>{link.label || "Link"}</a>;
            }
        });

        const footer = pages.length == 0 ? <></> : (
            <div className="card-action center">
                {pages}
            </div>
        );

        const loader = (
            headDetails.picture == undefined ? <></> :
                <div ref={this.loaderRef} className="preloader-wrapper-wrapper-wrapper">
                    <Loader />
                </div>
        );

        return (
            <>
                {loader}

                <div className="card no-shadow infinite">
                    {head}
                    {tabs}
                    {content}
                    {footer}
                </div>
            </>
        );
    }

    componentDidMount() {
        this.initDOM();
    }

    componentDidUpdate() {
        this.initDOM();
    }
}