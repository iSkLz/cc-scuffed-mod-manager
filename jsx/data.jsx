export default function FetchData() {
	return new Promise((resolve, reject) => {
		$.ajax({
			method: "GET",
			url: "data.json",
			success: (data) => {
				resolve(data);
			},
			error: (jqXHR, status, err) => {
				reject(new Error(err));
			}
		});
	});
};