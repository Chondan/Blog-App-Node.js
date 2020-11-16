window.onload = function() {

	function getNode(name) {
		return document.querySelector(`[name=${name}]`);
	}

	const blogsList = Array.from(document.querySelectorAll('.blogList'));
	const blogTitle = document.getElementById("blog-title");
	const blogContent = document.getElementById("blog-content");
	const inputTitle = getNode("title");
	const inputContent = getNode("content");
	const submit = getNode("submit");
	const deleteBlogBtn = document.getElementById("delete-blog");
	const editBlogBtn = document.getElementById("edit-blog");

	let currentlyBlogId;

	blogsList.forEach(blogList => {
		blogList.onclick = function() {
			currentlyBlogId = blogList.dataset.id;
			fetch(`/blog/${currentlyBlogId}`)
			.then(res => res.json())
			.then(data => {
				const { title, body } = data;
				blogTitle.innerHTML = title;
				blogContent.innerHTML = body;
			});
		}
	});

	submit.onclick = function(e) {
		e.preventDefault();
		const canAdd = Boolean(inputTitle.value) && Boolean(inputContent.value);
		if(!canAdd) {
			return inputTitle.focus();
		}
		fetch('/blog', {
			method: "post",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `title=${inputTitle.value}&content=${inputContent.value}`
		})
		.then(res => res.text())
		.then(data => {
			if(data === "done") {
				location.href = '/blog';
			}
		});
	}

	deleteBlogBtn.onclick = function() {
		if(currentlyBlogId) {
			fetch(`/blog/${currentlyBlogId}`, {
				method: "delete",
			})
			.then(res => res.text())
			.then(data => {
				if(data === "done") {
					location.href = '/blog';
				}
			});
		}
	}

	let editMode = false;
	editBlogBtn.onclick = function() {
		editMode = this.innerHTML === "EDIT" ? true : false;
		if(editMode) {
			this.innerHTML = "SAVE";
			blogTitle.setAttribute('contenteditable', true);
			blogContent.setAttribute('contenteditable', true);
			blogTitle.focus();
		} else {
			this.innerHTML = "EDIT";
			blogTitle.setAttribute('contenteditable', false);
			blogContent.setAttribute('contenteditable', false);
			fetch(`/blog/${currentlyBlogId}`, {
				method: "put",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `title=${blogTitle.innerHTML}&content=${blogContent.innerHTML}`
			})
			.then(res => res.text())
			.then(data => {
				console.log(data);
				if(data === "done") {
					location.href = '/blog';
				}
			});
		}
	}
}