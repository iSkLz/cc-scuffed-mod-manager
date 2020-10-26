export default function MarkdownRenderer(props) {
	let ref = (elem) => {
		// Sanitize HTML so that it doesn't catch COVID-19
		$(elem).html(DOMPurify.sanitize(marked(props.children)));
	};
    return <span ref={ref}></span>
}