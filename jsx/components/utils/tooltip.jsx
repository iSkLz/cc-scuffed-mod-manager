export default class Tooltip extends React.Component {
    render() {
        // Merging custom props with provided props into a deep-copied object
        let elementProps = Object.assign({
            className: `tooltipped ${this.props.classes || ""}`,
            "data-position": this.props.position,
            "data-tooltip": this.props.text,
            ref: (
                (elem) => {
                    this.instance = M.Tooltip.init(elem);
                }
            )
        }, this.props);
        delete elementProps.children;
        delete elementProps.element;
        delete elementProps.classes;

        return (
            React.createElement(this.props.element || "span", elementProps, this.props.children)
        );
    }

    componentWillUnmount() {
        // Destroy tooltip instance
        this.instance.destroy();
    }
}