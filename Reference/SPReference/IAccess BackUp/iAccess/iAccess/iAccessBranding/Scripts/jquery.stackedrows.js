(function ($) {
    $.fn.stackedRows = function(options) {
    	  
    	var settings = $.extend({
            classPrefix: "sr",
            firstRowHeader : true,       
            showLabels : true,
            altRowStyle : true                     
        }, options);

    	   
	    var obj = {
		 	colNames : Array(),
	   		numRows : 0,
	    	tableTypes : Array('withTbody', 'noTbody'),
	    	tableType : '',
	    	cols : '',
	    	body : '',
	    	findCols : function(curTable){
				var tableType = 1;		
				if(curTable.find('thead > tr > th').length > 0){
					obj.cols = curTable.find('thead > tr > th');
					curTable.find('thead > tr').addClass(settings.classPrefix +'-header');
					tableType = obj.tableTypes[0];
				}else if(curTable.find('thead > tr > td').length > 0){
					obj.cols = curTable.find('thead > tr > td');
					curTable.find('thead > tr').addClass(settings.classPrefix +'-header');
					tableType = obj.tableTypes[0];
				}else if(curTable.find('tbody > tr > th').length > 0){
					obj.cols = curTable.find('tbody > tr > th');
					curTable.find('tbody > tr:first-child').addClass(settings.classPrefix +'-header');
					tableType = obj.tableTypes[1];
				}else{
					obj.cols = curTable.find('tr:first-child > td');
					curTable.find('tr:first-child').addClass(settings.classPrefix +'-header');
					tableType = obj.tableTypes[1];
				}
				obj.tableType = tableType;
	    	},
	     	findBody : function(curTable){
		    	var body = '';
				switch(obj.tableType){
					case 'withTbody': 
						body = curTable.find('tbody tr');
						break;
					case 'noTbody':
						if(settings.firstRowHeader == true){
							body = curTable.find('tr:not(:first-child)');
						}else{
							body = curTable.find('tr');
						}	
					break;
				} 
				obj.body = body;
		    	}
	    };
 

		this.each(function(x){ //selector passed to plugin
			
			var curTable = $(this);		
		 	curTable.css({"width":"100%"});

			obj.findCols(curTable);
			obj.findBody(curTable);
			obj.cols.each(function(){
				obj.colNames.push($(this).html());
			});
			obj.body.each(function(q){
			  	var curRow = 'row-'+q;
	            obj.numRows++;
	            obj[curRow] = Array();
	            $(this).addClass(settings.classPrefix + '-' + curRow + ' '+ settings.classPrefix +'-hide');
	            $(this).find('td').each(function(){
	                var contents = $(this).html();
	                obj[curRow].push(contents.trim());
	            });
			});

		    //build output from array

		    for(var y = 0; y < obj.numRows; y++){
		        var html = '';
		        var curRow = 'row-'+y;
		        var outRow = obj[curRow];       
		        if(typeof outRow !== 'undefined'){
		            var altRowClass = (y%2 != 0) && settings.altRowStyle == true ? 'even' : '';
		            var lastRowClass = ((y+1) == obj.numRows) ? settings.classPrefix + '-tr-last' : '';
		            html += '<tr class="'+ settings.classPrefix +'-table-tr '; 
		            html += altRowClass +' '+ settings.classPrefix + '-table-tr-'+ curRow + ' '; 
		            html += lastRowClass +'">'
		            html += '<td colspan="'+obj.colNames.length+'">';
		            html += '<div class="' + settings.classPrefix + '-table-div">';
		            for(var k=0;k<outRow.length;k++){
		                var blankValueClass = outRow[k] == '' || outRow[k] == '&nbsp;' ? 'blankValue' : ''; 
		                var blankLabelClass = obj.colNames[k] == '' || obj.colNames[k] == '&nbsp;' ? 'blankLabel' : '' 
		                html += '<div class="' + settings.classPrefix + '-table-record-div '+ blankValueClass + ' ' + blankLabelClass +'">';
		                /*label*/
		                var label = obj.colNames[k];
		                var labelClass = settings.showLabels == false ? 'hidden' : '';
		                if(settings.firstRowHeader == true) {
		                	 html += '<label class="'+labelClass+'">'+label+'</label>';
		                }		               
		                /*end label*/
		                html += '<p>'+outRow[k]+'</p>';
		                html += '</div>';
		            }
		            html += '</div></td></tr>';
		            curTable.find('tr.'+ settings.classPrefix + '-' +curRow).after(html);
		        }
		    }
			obj.colNames = Array();
			obj.numRows = 0;
		});

    };
}( jQuery ));