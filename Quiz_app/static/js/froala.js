$(document).ready(function(){
      
      $(function() {
            $('textarea#froala-editor').froalaEditor({
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertTable', '|', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'],
      quickInsertButtons: ['table', 'ol', 'ul'],
  	  htmlAllowedAttrs: ['title', 'href', 'alt', 'src', 'style','onclick', 'class', 'id', 'data-target', 'data-toggle'],
      heightMin: 200,
      heightMax: 1000,
      codeBeautifierOptions: {
		  end_with_newline: true,
		  indent_inner_html: true,
		  extra_liners: "['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'table', 'dl']",
		  brace_style: 'expand',
		  indent_char: ' ',
		  indent_size: 4,
		  wrap_line_length: 0
	  }
    })
      });
           
    
});

 
