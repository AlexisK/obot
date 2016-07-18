var FormData = require('form-data');
var XMLHttpRequest = require('xhr2');

function ajaxRequest(method, path, data, todo) {
    if ( typeof(data) == 'function' ) {
        todo = data;
        data = {};
    }
	data = data || {};
	todo = todo || function(data) {
		console.log(data);
	}
	
	var r = new XMLHttpRequest();
	r.onreadystatechange = (ev) => {
		if ( r.readyState == 4 ) {
			var reqData;
			try {
				reqData = JSON.parse(r.responseText);
			} catch(err) {
				reqData = r.responseText;
			}
			todo(reqData, r, ev);
		}
	}
	
// 	console.log(method, path, data);
	if ( Object.keys(data).length == 0 ) {
	    if ( method == 'AUTO' ) { method = 'GET'; }
	    r.open(method, path);
	    r.send();
	} else {
	    if ( method == 'AUTO' ) { method = 'POST'; }
	    r.open(method, path);
	    var formData = new FormData();
	    for ( var k in data ) {
	        formData.append(k, data[k]);
	    }
	    r.send(formData);
	}
	
	
}
