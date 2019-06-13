$(document).on('change','.up', function(){
        var names = [];
        var length = $(this).get(0).files.length;
          for (var i = 0; i < $(this).get(0).files.length; ++i) {
              names.push($(this).get(0).files[i].name);
          }
          // $("input[name=file]").val(names);
        if(length>2){
          var fileName = names.join(', ');
          $(this).closest('.form-group').find('.form-control').attr("value",length+" files selected");
        }
        else{
          $(this).closest('.form-group').find('.form-control').attr("value",names);
        }
     });





function showme(ID){
   
   $('#' + ID).slideToggle('slow');
  
}

function showme_list(ID, ID_list){
   
   document.getElementById(ID).style.display="block";
   var arrayLength = ID_list.length;
   for (var i = 0; i < arrayLength; i++){
       document.getElementById(ID_list[i]).style.display="none"; 
   }

  
}

function display(ID){
  document.getElementById(ID).style.display = "inline";
}
 

function side_view(img_url){
    var img = document.getElementById("selected_img");
    img.src=img_url;
    var width = img.naturalWidth;
    var height = img.naturalHeight;
    document.getElementById("open_img").href=img_url;
    document.getElementById("small_url").innerHTML =  ' <hr/>  Width: ' + width + 'px' + ' Height: ' + height + 'px' + '<hr/> <b>URL:</b> ' + img_url;
    document.getElementById("large_url").innerHTML =  ' <hr/> <b>Link:</b>  https://www.naturallysplendid.com' + img_url;

}



function close_userprompt(){
    document.getElementById("userprompt").style.display="none";

}

function userprompt(url){
   document.getElementById("userprompt").style.display = "block";
   document.getElementById("del").href= url;
}



function image_prompt(url){
   document.getElementById("img").src= url;
}

function close_imageprompt(){
    document.getElementById("image_prompt").style.display="none";

}



function closebilling() {
   x = document.getElementById("billing");
   if (x.style.display == "none"){
	x.style.display = "block";
   }
   else{
	x.style.display = "none";
   }
}




function goback(){
     document.getElementById('countrieslist').style.display = "block";
     document.getElementById('taxrates').style.display = "none";
     document.getElementById('shippingrates').style.display = "none";
     document.getElementById('provinces').style.display = "none";
      
}







function opentab(ID, styleme, active_class, inactive_class, activenav_class){
   x = document.getElementById(ID);
   y = document.getElementsByClassName(active_class)[0].id;
   z = document.getElementsByClassName(activenav_class)[0]
   z.classList.remove(activenav_class);
   styleme.classList.add(activenav_class);
   element = document.getElementById(y);
   element.classList.remove(active_class);
   element.classList.add(inactive_class);
   x.classList.remove(inactive_class);
   x.classList.add(active_class);
 
}







var data = [
    [0, 48], [2, 38], [4, 36], [6, 42]
];

var data2 = [
    [0, 48], [2, 38], [4, 37], [6, 38]
];

var data1_1 = [
    [0, 7], [2, 5], [4, 4.75], [6, 3.5]
];

var data1_2 = [
    [0, 7], [2, 5], [4, 5.25], [6, 6]
];
 
var dataset1 = [
    {
        label: "HempOmega",
        data: data
    },
    {
      label:"Hemp Oil",
      data:data2
    }
];

var dataset2 = [
    {
        label: "HempOmega",
        data: data1_1
    },
    {
      label:"Hemp Oil",
      data:data1_2
    }
];

var options = {
    series: {  
        lines: { show: true,
                 lineWidth: 5,
                 fill: true,
                 fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1}] }
        },      
        points: {
            radius: 5,
            show: true
        },
        shadowSize: 0
    },
    
    colors: ["#74B335", "rgb(144, 162, 174)"],

    grid: {
        color: '#646464',
        borderWidth: 1,
    },
    xaxis: {
        label: '%',
        tickColor: 'transparent',
        tickDecimals: 0
    },
    yaxis: {
        tickSize: 4
    }
};




jQuery(document).ready(function ($) {
  
   
   if (document.getElementById("flot-placeholder") !== null){
      $.plot($("#flot-placeholder"), dataset1, options);
   }
   
   if (document.getElementById("flot-placeholder1") !== null){
      $.plot($("#flot-placeholder1"), dataset2, options);
   }


    
});   
