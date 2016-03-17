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


// doc ready
(function($, Swiper) {

  var options = {};
  options.whatSlider    = '.section-what--swiper';
  options.whatCategory  = '.section-what--what';


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
