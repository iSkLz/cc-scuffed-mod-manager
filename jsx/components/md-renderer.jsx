export default class MarkdownRenderer extends React.Component {
    render() {
        return React.createElement(this.props.element, this.props.attributes, marked(this.props.content))
    }
}