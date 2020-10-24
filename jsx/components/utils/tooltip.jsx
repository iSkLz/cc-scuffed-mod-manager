export default function Tooltip(props) {
    return (
        <span className="tooltipped" data-position={props.position} data-tooltip={props.text}>
            {props.children};
        </span>
    );
}