function slideShow(index){
    var slide = ["/img/slide1.jpg","/img/slide2.jpg","/img/slide3.jpg"];
    if(Number.isNaN(index)||index<0||index>2){
        return;
    }else{
        $('.header-content').animate({'background-size':'0%'},'slow',function(){
            $(this).css("background-image", "url("+ slide[index]+")");
            $(this).animate({'background-size':'100%'},'fast');
           
          //  $(this).css('background-image','url('+ slide[index]+')').animate({'background-size':'50%'});
        })
        $('.slide-button li').removeClass( "active" );
        $($('.slide-button li')[index]).addClass("active");
        // $('.header-content').animate(, 'slow', function() {
        //     $(this).css({'background-image': 'url('+ slide[index] +')'}).animate({opacity: 1});
        // });

    }
}