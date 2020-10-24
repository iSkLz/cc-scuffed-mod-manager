export default function MarkdownRenderer(props) {
	let ref = (elem) => {
		elem.innerHTML = marked(props.children);
	};
    return <span ref={ref}></span>
}