/**
 * Created by chrisenabled on 6/17/16.
 */

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function setupEventListeners() {
  loginFormListeners();
  registerFormListeners();
  forgotPasswordFormEventListeners();
}

//-----------------LISTENERS----------------------------
function forgotPasswordFormEventListeners() {
  $('#forgot-email').on('keyup', function(e) {
    forgotPasswordFormValidation();
  });
}
function loginFormListeners() {
  $('#login-email').on('keyup', function(e) {
    loginFormValidation();
  });
  $('#login-password').on('keyup', function(e) {
    loginFormValidation();
  });
}
function registerFormListeners() {
  $('#register-email').on('keyup', function(e) {
    registerFormValidation();
  });
  $('#register-password').on('keyup', function(e) {
    registerFormValidation();
  });
  $('#register-re-password').on('keyup', function(e) {
    registerFormValidation();
  });
}
//-------------------------------------------------------

//-------------------VALIDATIONS--------------------------
function forgotPasswordFormValidation() {
  var $forgotEmail = $('#forgot-email'),
    $forgotSubmit = $('#forgot-submit');
  if ($forgotEmail.val().length > 1 && emailRegex.test($forgotEmail.val())) {
    $forgotSubmit.prop('disabled', false);
  } else {
    $forgotSubmit.prop('disabled', true);
  }
}

function loginFormValidation() {
  var $loginEmail = $('#login-email'),
    $loginPassword = $('#login-password'),
    $loginSubmit = $('#login-submit');

  if ($loginEmail.val().length == 0 || $loginPassword.val().length == 0) {
    $loginSubmit.prop('disabled', true);
  } else {
    if (!emailRegex.test($loginEmail.val())) {
      $loginSubmit.prop('disabled', true);
    } else {
      $loginSubmit.prop('disabled', false);
    }
  }
}

function registerFormValidation() {
  var $registerEmail = $('#register-email'),
    $registerPassword = $('#register-password'),
    $registerRePassword = $('#register-re-password'),
  $registerSubmit = $('#register-submit');

  if ($registerEmail.val().length == 0 || $registerEmail.val().length == 0
    || $registerRePassword.val().length == 0) {
    $registerSubmit.prop('disabled', true);
  } else {
    if (!emailRegex.test($registerEmail.val())) {
      $registerSubmit.prop('disabled', true);
    } else {
      if ($registerPassword.val() !== $registerRePassword.val()) {
        $registerSubmit.prop('disabled', true);
      } else {
        $registerSubmit.prop('disabled', false);
      }
    }
  }
}
//----------------------------------------------------------

function initialFormValidations() {
  loginFormValidation();
  forgotPasswordFormValidation();
  registerFormValidation();
}

function toggleFormsOnClick() {
  $('.message a').click(function (e) {
    e.preventDefault();
    var $link	= $(this),
    target	= $link.attr('rel'),
    $currentForm	= $("#form-wrapper").children('form.active');
    $currentForm.removeClass("active");
    $currentForm.animate({height: "toggle", opacity: "toggle"}, "slow");
    $currentForm = $('.' + target);
    $currentForm.addClass("active");
    $currentForm.animate({height: "toggle", opacity: "toggle"}, "slow");
    $(".form-title").text(target.toUpperCase().replace("-", " "))
  });
}

$(document).ready(function () {
  initialFormValidations();
  setupEventListeners();
  toggleFormsOnClick();
});

