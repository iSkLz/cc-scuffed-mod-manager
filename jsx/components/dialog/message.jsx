export default class MessageDialog extends React.Component {
    constructor(props) {
        super(props);
        
        // Default values
        this.config = {
            title: this.props.title || "Message",
            // Either the attribute "message", or the children, or an empty string, whichever is present
            message: this.props.message || this.props.children || "",
            buttons: this.props.buttons || [{
                label: "Close",
                close: true
            }],
            // Too lazy to write if statements in an IIFE
            // If you're not as lazy maybe be so kind and do it?

            // If its null, default to false
            important: this.props.important == null ? false :
                // If its a boolean use it
                (typeof(this.props.important) === "boolean" ? this.props.important :
                    // If its a string, use true if its yes or false if its not
                    (typeof(this.props.important) === "string" ?
                        (this.props.important == "yes" ? true : false)
                        // If its nothing of the previous, default to true
                        // Because the attribute might specified like <Dialog important />
                        // In that case, it probably means true
                        : true)),
            onClose: this.props.onClose || function() {}
        };

        this.modalRef = React.createRef();
    }

    render() {
        // Generate a button element for each button provided
        const buttons = this.config.buttons.map((button, index) => {
            return (
                <a href="#!" key={index} className="waves-effect waves-blue btn-flat" onClick={
                    (e) => {
                        // Pass the modal instance, the DOM element and the event object
                        button.click(this.modalInstance, this.modalRef.current, e);
                        if (button.close) this.modalInstance.close();
                        e.preventDefault();
                    }
                }>{button.label}</a>
            );
        });

        return (
            <div className="modal" ref={this.modalRef}>
                <div className="modal-content">
                    <h4>{this.config.title}</h4>
                    <p>{this.config.message}</p>
                </div>

                <div className="modal-footer">
                    {buttons}
                </div>
            </div>
        );
    }

    componentDidMount() {
        // Initialize and open the modal and store its Materialize instance
        this.modalInstance = M.Modal.init(this.modalRef.current, {
            dismissible: !this.config.important,
            onCloseEnd: () => {
                this.config.onClose(this.modalInstance, this.modalRef.current);
            }
        });
        this.modalInstance.open();
    }
}