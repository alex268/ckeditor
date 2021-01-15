CKEDITOR.plugins.add( 'simpleImageUpload', {
	init: function (editor) {
		var fileDialog = document.createElement('input');
		fileDialog.type='file'; //other than file, type can be any valid html input type
		fileDialog.addEventListener("change", handleFiles, false);
		function handleFiles() {
			var fileList = this.files; /* now you can work with the file list */

			var uploadUrl = editor.config.uploadUrl;
			var file      = fileList[0];
			var imageData = new FormData();
			imageData.append("file", file);

			var xhr = new XMLHttpRequest();

			xhr.open("POST", uploadUrl);
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
			xhr.setRequestHeader("X-File-Size", file.size);

			xhr.onload = function() {
				var response = JSON.parse(xhr.responseText);
				var img = new CKEDITOR.dom.element( 'img' );
				img.setAttribute( 'src', "/api/file/get/" + response.id );
				editor.insertElement(img);
				fileDialog.value = "";
			};
			xhr.send(imageData);
		}

		editor.ui.addButton('ImageUpload', {
			label: 'Вставить изображение',
			command: 'openDialog',
			toolbar: 'insert'
		});
		editor.addCommand('openDialog', {
			exec: function (editor) {
				fileDialog.click();
			}
		})
	}
});
