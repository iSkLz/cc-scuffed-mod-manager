export function Spinner(props) {
    return (
        <div className={`spinner-layer spinner-${props.color}`}>
            <div className="circle-clipper left">
                <div className="circle"></div>
            </div>
            <div className="gap-patch">
                <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
                <div className="circle"></div>
            </div>
        </div>
    );
}

export default function Loader(props) {
    // Believe me, the wrappers are necessary
    return (
        <div className="preloader-wrapper-wrapper">
            <div className="preloader-wrapper big active">
                <Spinner color="blue" />
                <Spinner color="red" />
                <Spinner color="yellow" />
                <Spinner color="green" />
            </div>
        </div>
    );
}