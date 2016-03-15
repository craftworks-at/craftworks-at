/*
 * 
 * craftworks.at
 *
 * Copyright (c) 2015 craftworks - https://craftworks.at
 * All rights reserved.
 */

var sectionWhat = {
  swiper: null,

  init: function(options) {
    var that = this;
    // init swiper
    this.swiper = new Swiper(options.whatSlider, {
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      // autoplay: 5000,
      loop: true
    });

    // init whatCategory click
    $(options.whatCategory).on('click', function() {
      $(options.whatCategory).removeClass('active');
      $(this).addClass('active');
      that.swiper.slideTo($(this).data('slide-index'))
    });
  }
};

// doc ready
(function($, Swiper) {

  var options = {};
  options.whatSlider    = '.section-what--swiper';
  options.whatCategory  = '.section-what--what';


  // init sections
  sectionWhat.init(options);

})($, window.Swiper);
