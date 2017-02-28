var limit = 12;
var offset = 0;
var pageNum = 1;
var sortingType = "";
$(document).ready(function(){
    $("#search").on('click',function(e){
      //Clear screen with old results if any
      document.getElementById("albums").innerHTML ="";
      document.getElementById("modeldiv").innerHTML ="";
      loadPage();
      e.preventDefault();
  });

    //Next Button Click event for paging
    $("#nextbtn").on('click', function(){
      nextPage();
    });

    //Back Button Click event for paging
    $("#backbtn").on('click', function(){
      backPage();
    });

    function nextPage(){
      pageNum++;
      offset+=limit;
      document.getElementById("albums").innerHTML ="";
      document.getElementById("modeldiv").innerHTML ="";
      loadPage();
    }

    function backPage(){
      pageNum--;
      offset-=limit;
      document.getElementById("albums").innerHTML ="";
      document.getElementById("modeldiv").innerHTML ="";
      loadPage();
    }

   document.getElementById("sortselect").onchange = function(e){
   	document.getElementById("albums").innerHTML ="";
   	document.getElementById("modeldiv").innerHTML ="";
    	sortingType = document.getElementById("sortselect").value;
    	loadPage();
    }

    function sortByAlbumName(itemsData, desc){
    	var sortedObjs = itemsData.sort(function(a, b){
        	var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
        if(desc)
                return sortedObjs.reverse();
            return sortedObjs;
    }

    function sortByArtistName(itemsData, desc){
	    var sortedObjs = itemsData.sort(function(a, b){
	        	var nameA = a.artists[0].name.toLowerCase(), nameB = b.artists[0].name.toLowerCase()
	        	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
	        });

	    console.log(sortedObjs);

	    if(desc)
	    	return sortedObjs.reverse();
	    return sortedObjs;	
    }

    function loadPage(){
      //get the value of user inputs
      var searchQuery = document.getElementById( "searchQuery" ).value;
      //Api call with Search query with user input of type album
      var url= "https://api.spotify.com/v1/search?q="+searchQuery+"&type=album&limit="+limit+"&offset="+offset;
      //GET call 
      $.get( url, function( data ) {
        //if response from api is not undefined (means, if we got results)
        if(typeof(data.albums.items)!="undefined"){
        	if(sortingType == "byAlbum")
        		var sortedObjs = sortByAlbumName(data.albums.items, false);
        	else if (sortingType == "byArtist")
        		var sortedObjs = sortByArtistName(data.albums.items, false);
        	else
        		var sortedObjs = data.albums.items;
          //loop over response (get each data item)
          for (var i = 0; i < sortedObjs.length; i++) {

          var item = sortedObjs[i];
          if(item.artists.length>1){
            var names="";
            for(var j=0; j<item.artists.length;j++){
              names=names+item.artists[j].name+", ";
            }
            names = names.substring(0, names.length-2);
          }
          else{
            names = item.artists[0].name;
          }
          title = item.name;
          //if album has any imagelink then assigned this url to variable image
          if(typeof(item.images)!="undefined"){
            var image = item.images[1].url;
          }
          //otherwise, assign variable image a url to no image found
          else{
            var image = "http://www.bookmysports.com/angular/assets/images/no_image.jpg";
          }

          var imgNum = i + offset;
          //create new html elements and append it to div albums to display the resutls
          $('#albums').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a role="button" data-toggle="modal" data-target="#myModal'+imgNum+'"><img style="width:150px; height:150px;" src="'+image+'" class="img-responsive"></a><div class="caption"><h6 class="text-center"><b>'+title+'</b></h6><p class="text-center">'+names+'</p></div></div>');
          $('#modeldiv').append('<div class="modal fade" id="myModal'+imgNum+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Image</h4></div><div class="modal-body"><img class="img-responsive" src="'+item.images[0].url+'"/></div></div></div></div>');
        }

        //Code For Paging Elements in the Html
        document.getElementById("pageText").style.display = "inline";
        document.getElementById("sortselect").style.display = "inline";
        document.getElementById("pageText").innerHTML = "Page# " + pageNum;
        document.getElementById("nextbtn").style.display="inline";
        if(pageNum > 1){
          document.getElementById("backbtn").style.display="inline";
        } 
        else{
          document.getElementById("backbtn").style.display="none";
        }
      }
      //if response is empty
      else{
        $('#albums').append('<div class="alert alert-danger">No results</div>');
      }
    });
    }



});
