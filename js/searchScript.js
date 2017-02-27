var limit = 12;
var offset = 0;
var pageNum = 1;
$(document).ready(function(){
    $("#search").on('click',function(e){
      //Clear screen with old results if any
      document.getElementById("albums").innerHTML ="";
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
      loadPage();
    }

    function backPage(){
      pageNum--;
      offset-=limit;
      document.getElementById("albums").innerHTML ="";
      loadPage();
    }

    function loadPage(){
      //get the value of user inputs
      var searchQuery = document.getElementById( "searchQuery" ).value;
      //Api call with Search query with user input of type album
      var url= "https://api.spotify.com/v1/search?q="+searchQuery+"&type=album&limit="+limit+"&offset="+offset;
      //GET call 
      $.get( url, function( data ) {
        //if response from api is not undefined (means, if we got results)
        console.log(data.albums.items.length);
        if(typeof(data.albums.items)!="undefined"){

          //loop over response (get each data item)
          for (var i = 0; i < data.albums.items.length; i++) {

          var item = data.albums.items[i];
          console.log(item.artists.length);
          if(item.artists.length>1){
            var names="";
            for(var j=0; j<item.artists.length;j++){
              names=names+item.artists[j].name+", ";
            }
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

          //create new html elements and append it to div albums to display the resutls
          $('#albums').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a role="button" data-toggle="modal" data-target="#myModal'+i+'"><img style="width:150px; height:150px;" src="'+image+'" class="img-responsive"></a><div class="caption"><h6 class="text-center"><b>'+title+'</b></h6><p class="text-center">'+names+'</p></div></div>');
          $('#modeldiv').append('<div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Image</h4></div><div class="modal-body"><img class="img-responsive" src="'+item.images[0].url+'"/></div></div></div></div>');
        }

        //Code For Paging Elements in the Html
        document.getElementById("pageText").style.display = "inline";
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