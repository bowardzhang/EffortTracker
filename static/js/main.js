console.log("Your main.js is working");
// Settings
var showButton=document.getElementById('show');
var showAllButton=document.getElementById('show-all');
var header=document.getElementById('usercontainer');
var recordSubmit=document.getElementById('record-submit');
var fromdate=document.getElementById('fromdate');
var todate=document.getElementById('todate');
var password=document.getElementById('id_password');
var confirmpassword=document.getElementById('confirm-pass');
var register=document.getElementById('Register');
var delete_id='';


//Initializing Plug-ins
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
      delay: { "show": 100, "hide": 100 }
    }
    );
    $('[data-toggle="popover"]').popover({
      html: true,
      delay: { "show": 100, "hide": 100 },
      animation:true
    });

});


//Function to enable showbutton
if(fromdate && todate){
  fromdate.addEventListener("input",function(){
    todate.addEventListener("input",function(){
      showButton.disabled=false;
      showButton.removeAttribute('style');
      $('#show-span').tooltip('disable');
    });
  });

}
//Function to enable Generate Report
if($("#fromperiod") && $("#toperiod")){
  $("#fromperiod").on("input",function(){
        $("#downloadBtn").fadeOut(500);
    $("#toperiod").on("input",function(){
          $("#downloadBtn").fadeOut(500);
          $("#generateBtn").fadeIn(500);
    })
  });
}



// Function to generate report
$("#generateBtn").click(function(){
  $("#awindow").fadeOut();
  $("#downloadBtn").fadeIn(500);
  var iframe=document.getElementById("awindow");
  var e_table=iframe.contentDocument.getElementById("effort-table");
  var reporting =iframe.contentDocument.getElementById("reporting-period");
  reporting.innerText=$("#fromperiod").val() +" To "+$("#toperiod").val();
  // Check if already data is present in report and clear the records
    if(e_table.children[1].children){
      effort_rows=e_table.children[1].children.length
      for (var i = 0; i <effort_rows ; i++) {
        e_table.children[1].children[0].remove();
      }
    }
  $.post('/tracker_app/reporttemplateinfo/',{'fromdate':$("#fromperiod").val(),'todate':$("#toperiod").val()},function(data,success){
    //
    // console.log(Object.values(data[0]));
    // console.log(data[0]);
    // console.log(data[1]);

  // Check if table is present nd populate the report
    if(e_table){
      for (var i = 0; i < data[1].length; i++) {
        e_table.children[1].insertAdjacentHTML("beforeEnd",'<tr><td style="border: 1px solid black;padding:2px 5px;">'+data[1][i].project_name+'</td><td style="border: 1px solid black;padding:2px 5px;">'+data[1][i].work_package+'</td><td style="border: 1px solid black;padding:2px 5px;">'+data[1][i].work_date+'</td><td style="border: 1px solid black;padding:2px 5px;">'+data[1][i].work_hours+'</td></tr>');
        }

        temp=0;
        for (var k = 0; k < Object.values(data[0]).length; k++) {
           e_table.children[1].children[temp].insertAdjacentHTML("afterbegin",'<td style="border: 1px solid black;padding:2px 5px;" rowspan='+Object.values(data[0])[k]+'>'+Object.keys(data[0])[k]+'</td>');
           temp+=Object.values(data[0])[k];
        }

      }
      $("#awindow").fadeIn(500);



  });
  });





if(confirmpassword){
  //Start of password check
// Listener for confirm password
    confirmpassword.addEventListener("input",function() {
        // var passwordAlert =document.getElementById("confirm-password-alert")
        if(confirmpassword.value===password.value)
        {
          // alert="Passwords Match!!"
          // passwordAlert.innerHTML=alert
          // passwordAlert.style.color = "green";
          $("#confirm-pass").css("border-bottom", "2px solid #191f33");
          register.disabled=false;
        }
        else
        {
                if(confirmpassword.value !="")
                {
                  // alert="Passwords do not match!!"
                  // passwordAlert.innerHTML=alert
                  // passwordAlert.style.color = "red";
                  register.disabled=true;
                  $("#confirm-pass").css("border-bottom", "2px solid red");
                }
                else
                {
                  // passwordAlert.innerHTML=""
                  register.disabled=true;

                }
          }
});

  //Listener for password field
  password.addEventListener("input",function(){
    if(confirmpassword.value!=""){
      // var passwordAlert =document.getElementById("confirm-password-alert")
      if(confirmpassword.value===password.value){
        // alert="Passwords Match!!"
        // passwordAlert.innerHTML=alert
        // passwordAlert.style.color = "green";
        $("#confirm-pass").css("border-bottom", "2px solid #191f33");
        register.disabled=false;
      }
      else{
        if(password.value !=""){
          // alert="Passwords do not match!!"
          // passwordAlert.innerHTML=alert
          // passwordAlert.style.color = "red";
          $("#confirm-pass").css("border-bottom", "2px solid red");

        }
      }
    }
});
//End of password check
}



if(showButton){
  showButton.addEventListener('click',function(){
    console.log("Show button click is working");
    if(document.getElementById('usertable')){
      document.getElementById('usertable').remove()
    }
    if(document.getElementById('usertable_wrapper')){
      document.getElementById('usertable_wrapper').remove()
    }
    if(document.getElementById('id_user_name')){
      $.post('/tracker_app/listeffort/',{'fromdate':fromdate.value,'todate':todate.value,'user_id':$("#id_user_name").val()},function(effort,success){
        console.log(effort);
		console.log("test1");
        if (effort.length>0){
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');
          for(i=0;i<effort.length;i++){

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td><span onClick="deleterow(this.id)" id="'+effort[i].id+'" class="badge badge-dark">Delete</span></td><td>'+effort[i].project_name+'</td><td>'+effort[i].work_package+'</td><td>'+effort[i].work_date+'</td><td>'+effort[i].work_hours+'</td><td>'+effort[i].work_issue+'</td></tr>');

          }
        }
        else{
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td colspan=7 style="text-align:center;"><strong>No search records found</strong></td></tr>');


        }


        if(subheader){
           $('#usertable').DataTable();
        }



      });
    }
    else{
      $.post('/tracker_app/listeffort/',{'fromdate':fromdate.value,'todate':todate.value},function(effort,success){
        console.log(effort);
        if (effort.length>0){
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');
          for(i=0;i<effort.length;i++){

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td><span onClick="deleterow(this.id)" id="'+effort[i].id+'" class="badge badge-dark">Delete</span></td><td>'+effort[i].project_name+'</td><td>'+effort[i].work_package+'</td><td>'+effort[i].work_date+'</td><td>'+effort[i].work_hours+'</td><td>'+effort[i].work_issue+'</td></tr>');

          }
        }
        else{
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td colspan=7 style="text-align:center;"><strong>No search records found</strong></td></tr>');


        }


        if(subheader){
           $('#usertable').DataTable();
        }



      });

    }
  });
}


$("#confirm-yes").click(function(){
  // console.log("Delete Record " + delete_id);
  var selected_cell=document.getElementById(delete_id).parentElement;
  var selected_row=selected_cell.parentElement;
  selected_row.remove();
  $.post('/tracker_app/deleteeffort/',{'delete_id':delete_id},function(data,success){

  });
});


function deleterow(param) {
    $("#exampleModal").modal();
    delete_id=param //Store the event for delete
}


if(showAllButton){
  showAllButton.addEventListener('click',function(){
    console.log("Show All button click is working");
    if(document.getElementById('usertable')){
      document.getElementById('usertable').remove()
    }
    if(document.getElementById('usertable_wrapper')){
      document.getElementById('usertable_wrapper').remove()
    }
    var fromdate="";
    var todate="";
    // Super user check
    if(document.getElementById('id_user_name')){
      $.post('/tracker_app/listeffort/',{'fromdate':fromdate,'todate':todate,"user_id":$("#id_user_name").val()},function(effort,success){
        console.log(effort);
        if (effort.length>0){
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Pacakage</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

          for(i=0;i<effort.length;i++){
            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td><span onClick="deleterow(this.id)" id="'+effort[i].id+'" class="badge badge-dark">Delete</span></td><td>'+effort[i].project_name+'</td><td>'+effort[i].work_package+'</td><td>'+effort[i].work_date+'</td><td>'+effort[i].work_hours+'</td><td>'+effort[i].work_issue+'</td></tr>');

          }
        }
        else{
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td colspan=7 style="text-align:center;"><strong>No search records found</strong></td></tr>');


        }



    if(subheader){
       $('#usertable').DataTable();

    }
      });
    }
    else{
      $.post('/tracker_app/listeffort/',{'fromdate':fromdate,'todate':todate},function(effort,success){
        console.log(effort);
        if (effort.length>0){
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

          for(i=0;i<effort.length;i++){

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td><span onClick="deleterow(this.id)" id="'+effort[i].id+'" class="badge badge-dark">Delete</span></td><td>'+effort[i].project_name+'</td><td>'+effort[i].work_package+'</td><td>'+effort[i].work_date+'</td><td>'+effort[i].work_hours+'</td><td>'+effort[i].work_issue+'</td></tr>');

          }
        }
        else{
          header.insertAdjacentHTML("beforeend",'<table id="usertable" class="table table-striped"><thead class="thead-dark"><th scope="col">Action</th><th scope="col">Project</th><th scope="col">Work Package</th><th scope="col">Date</th><th scope="col">Effort (hour)</th><th scope="col">Issues</th></thead><tbody></tbody></table>');
          var subheader=document.getElementById('usertable');

            subheader.children[1].insertAdjacentHTML("beforeend",'<tr scope="row"><td colspan=7 style="text-align:center;"><strong>No search records found</strong></td></tr>');


        }



    if(subheader){
       $('#usertable').DataTable();

    }
      });

    }

  });
};

if($("#cancelEntry")){
  $("#cancelEntry").click(function(){
    var c= document.getElementById("effort-form");
    var effort_object={};
    for (i = 0; i < c.children.length; i++) {
        var pchild=c.children[i];
        if (pchild.children.length>0){
          pchild.children[1].value="";

        }
    }
  })
}

if (recordSubmit) {
  recordSubmit.addEventListener('click',function(){
  var c= document.getElementById("effort-form");
  var effort_object={};
  for (i = 0; i < c.children.length; i++) {
      var pchild=c.children[i];
      if (pchild.children.length>0){
        effort_object[pchild.children[1].name]=pchild.children[1].value;
        // console.log(pchild.children[1].name+ " " +pchild.children[1].value);
      }
  }
  $.post('/tracker_app/recordeffort/',effort_object,function(data,success){
  if (data["IND"]==0){
    var alert=document.getElementById('alert');
    alert.setAttribute("style", "color:black;");
    alert.innerHTML=data["Message"];
    $("#alert").fadeIn(200);
    $("#alert").fadeOut(3000);
  }
  else{
    var alert=document.getElementById('alert');
    alert.setAttribute("style", "color:red;");
    alert.innerHTML=data["Message"];
    $("#alert").fadeIn(200);
  }
  });
  });
}


//Javascript fn to Export to Word
function Export2Doc(element, filename = ''){
    var preHtml = "<html><head><meta charset='utf-8'><title>Export HTML To Doc</title><link rel='stylesheet' href='/static/css/style.css'></head><body>";
    var postHtml = "</body></html>";
    var iframe=document.getElementById("awindow");
    var report_template=iframe.contentDocument.getElementsByClassName(element);
    var reporting =iframe.contentDocument.getElementById("reporting-period");
    var html = preHtml+report_template[0].innerHTML+postHtml;

    var blob = new Blob(['\ufeff',html], {
        type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    filename="Weekly_progress_report_"+reporting.innerText
    filename = filename.split('-').join('').replace(' To ','_')
    filename = filename?filename+'.doc':'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}

//Javascript fn to Export to PDF
function Export2PDF(content, filename = ''){
// backup
// var printWindow = window.open('', '', 'height=400,width=800');
// printWindow.document.write('<html><head><title>DIV Contents</title>');
// printWindow.document.write('</head><body >');
// printWindow.document.write(html);
// printWindow.document.write('</body></html>');
// printWindow.document.close();
// printWindow.print();

    var iframe=document.getElementById("awindow");
    var reporting =iframe.contentDocument.getElementById("reporting-period");
    var pdf = new jsPDF('p', 'pt', 'letter')

 // source can be HTML-formatted string, or a reference
 // to an actual DOM element from which the text will be scraped.
  source = iframe.contentDocument.getElementsByClassName(content)[0]
  console.log(source);

 // we support special element handlers. Register them with jQuery-style
 // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
 // There is no support for any other type of selectors
 // (class, of compound) at this time.
  specialElementHandlers = {
     // element with id of "bypass" - jQuery style selector
     '#bypassme': function(element, renderer){
         // true = "handled elsewhere, bypass text extraction"
         return true
     },
     '.hide': function(element, renderer){
         // true = "handled elsewhere, bypass text extraction"
         return true
     }
 }

 margins = {
     top: 30,
     bottom: 60,
     left: 50,
     width: 800
   };
   // all coords and widths are in jsPDF instance's declared units
   // 'inches' in this case
 pdf.fromHTML(
     source.innerHTML // HTML string or DOM elem ref.
     , margins.left // x coord
     , margins.top // y coord
     , {
         'width': margins.width // max width of content on PDF
         , 'elementHandlers': specialElementHandlers
     },
     function (dispose) {
       // dispose: object with X, Y of the last line add to the PDF
       //          this allow the insertion of new lines after html
       // Specify file name
       filename="Weekly_progress_report_"+reporting.innerText
       filename = filename.split('-').join('').replace(' To ','_')
       filename = filename?filename+'.pdf':'document.doc';
       // pdf.setFontSize(22);
        pdf.save(filename);
       },
     margins
   )

}
