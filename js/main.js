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
      initialSlide: 1,
      loop: false,
      onSlideChangeStart: function(swiper) {
        // set category active
        that.setActive(
          options,
          swiper.activeIndex
        );
      }
    });

    // init whatCategory click
    $(options.whatCategory).on('click', function() {
      var slideIndex = $(this).data('slide-index');
      that.setActive(options, slideIndex);
      that.swiper.slideTo(slideIndex)
    });

  },

  setActive: function(options, index) {
    $(options.whatCategory).removeClass('active');
    var slideCount = $(options.whatCategory).length;
    $(options.whatCategory + options.whatSlideIndex.replace('__INDEX__', index % slideCount)).addClass('active');
  }

};

var contactForm = {
  isValidEmail: function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  },
  clearErrors: function () {
    $('#emailAlert').remove();
    $('#feedbackForm .help-block').hide();
    $('#feedbackForm .form-group').removeClass('has-error');
  },
  addError: function ($input) {
    $input.siblings('.help-block').show();
    $input.parent('.form-group').addClass('has-error');
  },
  addAjaxMessage: function(msg, isError) {
    $("#contactSubmit").after('<div id="emailAlert" class="alert alert-' + (isError ? 'danger' : 'success') + '" style="margin-top: 5px;">' + $('<div/>').text(msg).html() + '</div>');
  }
};

var smoothScroll = {

  init: function(options) {
    $('body').on('click', options.anchorScroll, this.scrollToAnchor);

    // scroll hash
    setTimeout(function() {
      this.scrollToAnchor(window.location.hash);
    }.bind(this), 500);
  },

  scrollToAnchor: function(href) {
    href = typeof(href) == "string" ? href : $(this).attr('href');

    if (href.indexOf('/') === 0) {
      href = href.substr(1);
    }

    // You could easily calculate this dynamically if you prefer
    var fromTop = 0;

    // If our Href points to a valid, non-empty anchor, and is on the same page (e.g. #foo)
    // Legacy jQuery and IE7 may have issues: http://stackoverflow.com/q/1593174
    if(href.indexOf('#') === 0) {
      var $target = $(href);

      // Older browser without pushState might flicker here, as they momentarily
      // jump to the wrong position (IE < 10)
      if($target.length) {
        $('html, body').animate(
          { scrollTop: $target.offset().top - fromTop },
          500
        );
        if(history && 'pushState' in history) {
          history.pushState({}, document.title, window.location.pathname + href);
          return false;
        }
      }
    }
  }
};


// doc ready
(function($, Swiper) {

  var options = {};
  options.whatSlider      = '.section-what--swiper';
  options.whatCategory    = '.section-what--what';
  options.whatSlideIndex  = '[data-slide-index="__INDEX__"]';
  options.anchorScroll    = '[data-anchor-scroll]';

  // init smooth scrolling
  smoothScroll.init(options);

  // init sections
  sectionWhat.init(options);

  // init contact form
  $('#contactSubmit').click(function() {
    contactForm.clearErrors();

    var hasErrors = false;
    $('#contactForm input,textarea').each(function() {
      if (!$(this).val()) {
        console.log("anderer error");
        hasErrors = true;
        contactForm.addError($(this));
      }
    });
    var $email = $('#contactmail');
    if (!contactForm.isValidEmail($email.val())) {
      console.log("email error");
      hasErrors = true;
      contactForm.addError($email);
    }

    //if there are any errors return without sending e-mail
    if (hasErrors) {
      return false;
    }
    var contactData = 'name='+$('#contactname').val()+'&email='+$email.val()+'&message='+$('#contactmessage').val();
    //send the feedback e-mail
    $.ajax({
      type: "POST",
      url: "lib/contact_mailer.php",
      data: contactData,
      success: function(data)
      {
        ga('send', 'event', 'button', 'click', 'messageSent');
        contactForm.addAjaxMessage(data.message, false);
      },
      error: function(response)
      {
        ga('send', 'event', 'button', 'click', 'messageError');
        contactForm.addAjaxMessage(response.responseJSON.message, true);
      }
    });
    return false;
  });

})($, window.Swiper);
