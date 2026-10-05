$(document).ready(function () {

  if (window.innerWidth >= 992) {

    $('.top-header .dropdown, header .dropdown').hover(

      function () {

        const $menu = $(this).find('.dropdown-menu');

        const $toggle = $(this).find('.dropdown-toggle');

        $toggle.addClass('show');

        $menu.addClass('show');

      },

      function () {

        const $menu = $(this).find('.dropdown-menu');

        const $toggle = $(this).find('.dropdown-toggle');

        $toggle.removeClass('show');

        $menu.removeClass('show');

      }

    );

  }

});





$(document).ready(function () {



  // ⭐ 1. Generic Carousels - Exclude all specific ones

  $('.owl-carousel:not(.product-slider):not(.date-slider-alt):not(.date-slider-alt-two):not(.main-slider):not(.theme-carousel-wrapper .owl-carousel):not(.owl-carousel-special)').owlCarousel({

    loop: true,

    margin: 15,

    nav: true,

    navText: [

      '<span><i class="fas fa-chevron-left"></i></span>',

      '<span><i class="fas fa-chevron-right"></i></span>'

    ],

    autoplay: true,

    autoplayTimeout: 3000,

    autoplayHoverPause: true,

    dots: false,

    responsive: {

      0: { items: 1.1 },

      600: { items: 1 },

      1000: { items: 3 }

    }

  });



  // ⭐ 2. Product Slider

  $('.product-slider').owlCarousel({

    loop: true,

    margin: 15,

    nav: true,

    navText: [

      '<span><i class="fas fa-chevron-left"></i></span>',

      '<span><i class="fas fa-chevron-right"></i></span>'

    ],

    autoplay: true,

    autoplayTimeout: 3000,

    autoplayHoverPause: true,

    dots: false,

    responsive: {

      0: { items: 1 },

      600: { items: 2 },

      1000: { items: 3 }

    }

  });



  // ⭐ 3. Date Slider Alt Two

  $('.date-slider-alt-two').owlCarousel({

    loop: true,

    margin: 0,

    nav: true,

    dots: false,

    navText: [

      '<span><i class="fas fa-chevron-left"></i></span>',

      '<span><i class="fas fa-chevron-right"></i></span>'

    ],

    autoplay: true,

    autoplayTimeout: 5000,

    autoplayHoverPause: true,

    dots: false,

    responsive: {

      0: { items: 1 },

      576: { items: 1 },

      768: { items: 1 },

      992: { items: 1 },

      1200: { items: 1 }

    }

  });



  // ⭐ 4. Date Slider Alt

  $('.date-slider-alt').owlCarousel({

    loop: false,

    margin: 0,

    nav: true,

    dots: false,

    navText: [

      '<span><i class="fas fa-chevron-left"></i></span>',

      '<span><i class="fas fa-chevron-right"></i></span>'

    ],

    autoplay: true,

    autoplayTimeout: 3000,

    autoplayHoverPause: true,

    responsive: {

      0: { items: 3 },

      576: { items: 4 },

      768: { items: 5 },

      992: { items: 6 },

      1200: { items: 7 }

    }

  });



  // ⭐ 5. Main Slider + Thumbnail Sync

  var owl = $(".main-slider");

  owl.owlCarousel({

    items: 1,

    loop: false,

    margin: 0,

    nav: true,

    dots: false,

    autoplay: true,

    autoplayTimeout: 3000,

    autoplayHoverPause: true,

    navText: [

      '<span class="main-prev-arrow"><i class="fas fa-chevron-left"></i></span>',

      '<span class="main-next-arrow"><i class="fas fa-chevron-right"></i></span>'

    ]

  });



  $(".thumb-img").click(function () {

    var index = $(this).data("index");

    owl.trigger("to.owl.carousel", [index, 300]);

  });



  // ⭐ 6. Theme Carousel Wrapper (with custom prev/next)

  $('.theme-carousel-wrapper').each(function () {

    var $wrapper = $(this);

    var $carousel = $wrapper.find('.owl-carousel');



    $carousel.owlCarousel({

      loop: true,

      margin: 20,

      nav: true,

      dots: false,

      navText: [

        '<span><i class="fas fa-chevron-left"></i></span>',

        '<span><i class="fas fa-chevron-right"></i></span>'

      ],

      autoplay: true,

      autoplayTimeout: 3000,

      autoplayHoverPause: true,

      responsive: {

        0: { items: 1 },

        576: { items: 2 },

        768: { items: 3 },

        992: { items: 4 },

        1200: { items: 6 }

      }

    });



    $wrapper.find('.theme-prev').click(function () {

      $carousel.trigger('prev.owl.carousel');

    });

    $wrapper.find('.theme-next').click(function () {

      $carousel.trigger('next.owl.carousel');

    });

  });



  // ⭐ 7. Special Carousel (final working version)

  $('.owl-carousel-special').owlCarousel({

    loop: true,

    margin: 10,

    nav: true,

    dots: false,

    autoplay: true,

    navText: [

      '<span><i class="fas fa-chevron-left"></i></span>',

      '<span><i class="fas fa-chevron-right"></i></span>'

    ],

    autoplay: true,

    autoplayTimeout: 3000,

    autoplayHoverPause: true,

    responsive: {

      0: { items: 1 },

      576: { items: 2 },

      768: { items: 2 },

      992: { items: 3 },

      1200: { items: 4 }

    }

  });



});



$(document).ready(function () {

  // Departure Date Picker

  // flatpickr('input[name="departureDate"]', {

  //     dateFormat: "d-m-Y",

  //     minDate: "today",

  //     showMonths: 2 // ✅ Double month

  // });



  // // Return Date Picker

  // let returnPicker = flatpickr('input[name="returnDate"]', {

  //     dateFormat: "d-m-Y",

  //     minDate: "today",

  //     clickOpens: false, // Click se hi open hoga

  //     showMonths: 2, // ✅ Double month

  //     onChange: function(selectedDates, dateStr, instance) {

  //         $('input[name="returnDate"]').val(dateStr);

  //     }

  // });



  // Trip Type Change

  $('input[name="tripType"]').on('change', function () {

    if ($(this).val() === 'roundtrip') {

      // Enable Return Date Box

      // $('#returnDateBox').css({ 'opacity': '1', 'pointer-events': 'auto' });

      // $('input[name="returnDate"]').removeAttr('readonly').attr('placeholder', 'Select return date').val('');

    } else {

      // Disable Return Date Box

      $('#returnDateBox').css({ 'opacity': '0.4', 'pointer-events': 'none' });

      $('input[name="returnDate"]').attr('readonly', true).val('Book a round trip');

    }

  });



  // Return Date Click par open kare

  $('input[name="returnDate"]').on('click', function () {

    if (!$(this).attr('readonly')) {

      returnPicker.open();

    }

  });

});



// Responsive Dropdown Toggle

$(document).ready(function () {



  function setupDropdownToggles() {

    if ($(window).width() < 992) {

      $('.top-bar-items .dropdown-toggle').off('click').on('click', function (e) {

        e.preventDefault();

        const parent = $(this).closest('.dropdown');

        const isOpen = parent.hasClass('open');



        $('.top-bar-items .dropdown').removeClass('open');

        $('.top-bar-items .dropdown-toggle').removeClass('active');



        if (!isOpen) {

          parent.addClass('open');

          $(this).addClass('active');

        }

      });



      $('.navbar-nav .dropdown-toggle').off('click').on('click', function (e) {

        const $parent = $(this).closest('.dropdown');

        if ($(window).width() < 992) {

          e.preventDefault();

          const isOpen = $parent.hasClass('open');



          $('.navbar-nav .dropdown').removeClass('open');

          $('.navbar-nav .dropdown-toggle').removeClass('active');



          if (!isOpen) {

            $parent.addClass('open');

            $(this).addClass('active');

          }

        }

      });

    } else {

      $('.dropdown').removeClass('open');

      $('.dropdown-toggle').removeClass('active');

    }

  }



  setupDropdownToggles();

  $(window).resize(setupDropdownToggles);

});



// Mobile Search Bar Toggle

$(document).ready(function () {

  let isSearchVisible = false;



  $('.search-toggle, .mobile-search-btn').click(function () {

    if (!isSearchVisible) {

      $('.mobile-search-bar').slideDown();

      isSearchVisible = true;

    } else {

      $('.mobile-search-bar').slideUp();

      isSearchVisible = false;

    }

  });



  $(window).resize(function () {

    if ($(window).width() >= 992) {

      $('.mobile-search-bar').hide();

      isSearchVisible = false;

    }

  });

});



// Room Count Functions

function changeCount(btn, type, delta) {

  const input = btn.parentElement.querySelector('input[type="text"]');

  let value = parseInt(input.value) + delta;



  if (value < 0) value = 0;



  if (type === 'adult') {

    if (value < 1) value = 1;

    if (value > 8) value = 8;

  }


  if (type === 'child') {

    if (value > 4) value = 4;

  }



  input.value = value;



  // Handle child age dropdowns

  if (type === 'child') {

    const room = btn.closest('.room');

    const container = room.querySelector('.child-age-container');

    const roomIndex = parseInt(room.getAttribute('data-room')) - 1;



    container.innerHTML = '';



    for (let i = 0; i < value; i++) {

      const select = document.createElement('select');

      select.name = `child_age[${roomIndex}][]`;

      select.className = 'form-select form-select-sm child-age-dropdown';



      for (let age = 1; age <= 17; age++) {

        const option = document.createElement('option');

        option.value = age;

        option.textContent = `${age} year${age > 1 ? 's' : ''}`;

        select.appendChild(option);

      }



      container.appendChild(select);

    }

  }

}









function addRoom() {



  const roomContainer = document.getElementById('roomContainer');

  const addRoomBtn = document.querySelector('input[value="Add Room"]');

  const roomCount = roomContainer.querySelectorAll('.room').length;



  if (roomCount >= 6) return;



  const newRoom = document.createElement('div');

  newRoom.classList.add('room');

  newRoom.setAttribute('data-room', roomCount + 1);

  newRoom.innerHTML = `

    <div class="room-title">Room ${roomCount + 1}:</div>



    <div class="counter-box">

      <span>Adult <small>(Above 12 years)</small></span>

      <div class="box-drop">

        <input type="button" class="btn btn-outline-dark btn-sm" value="-" onclick="changeCount(this, 'adult', -1)">

        <input type="text" name="adult_count[]" value="2" readonly class="border-0 text-center" style="width: 30px;">

        <input type="button" class="btn btn-outline-dark btn-sm" value="+" onclick="changeCount(this, 'adult', 1)">

      </div>

    </div>



    <div class="counter-box">

      <span>Child <small>(Below 12 years)</small></span>

      <div class="box-drop">

        <input type="button" class="btn btn-outline-dark btn-sm" value="-" onclick="changeCount(this, 'child', -1)">

        <input type="text" name="child_count[]" value="0" readonly class="border-0 text-center" style="width: 30px;">

        <input type="button" class="btn btn-outline-dark btn-sm" value="+" onclick="changeCount(this, 'child', 1)">

      </div>

    </div>



    <div class="child-age-container"></div> 



    <hr>

  `;

  roomContainer.appendChild(newRoom);



  if (roomCount + 1 >= 6) {

    addRoomBtn.style.display = 'none'; // hide add button

  }



  const removeBtn = document.getElementById('removeRoomBtn');

  if (roomCount + 1 > 1) {

    removeBtn.style.display = 'inline-block';

  }

  document.getElementById('no_of_room').value = roomCount + 1;

}







function removeRoom() {



  const roomContainer = document.getElementById('roomContainer');

  const addRoomBtn = document.querySelector('input[value="Add Room"]');

  const removeBtn = document.getElementById('removeRoomBtn');

  const rooms = roomContainer.querySelectorAll('.room');



  if (rooms.length > 1) {

    roomContainer.removeChild(rooms[rooms.length - 1]);

  }



  const updatedRooms = roomContainer.querySelectorAll('.room');

  const updatedRoomCount = updatedRooms.length;



  updatedRooms.forEach((room, index) => {

    room.querySelector('.room-title').textContent = `Room ${index + 1}:`;

    room.setAttribute('data-room', index + 1);

  });



  document.getElementById('no_of_room').value = updatedRoomCount;

  removeBtn.style.display = updatedRoomCount > 1 ? 'inline-block' : 'none';

  addRoomBtn.style.display = updatedRoomCount < 3 ? 'inline-block' : 'none';

}



document.addEventListener("DOMContentLoaded", function () {

  const roomCount = document.querySelectorAll('#roomContainer .room').length;

  const removeBtn = document.getElementById('removeRoomBtn');

  const addRoomBtn = document.querySelector('input[value="Add Room"]');



  if (roomCount > 1) {

    removeBtn.style.display = 'inline-block';

  }



  if (roomCount >= 3) {

    addRoomBtn.style.display = 'none';

  }

});



function updateSummary() {

  const rooms = document.querySelectorAll('.room');

  let totalGuests = 0;

  rooms.forEach(room => {

    const inputs = room.querySelectorAll('input[type="text"]');

    totalGuests += parseInt(inputs[0].value) + parseInt(inputs[1].value);

  });



  document.getElementById('guestDropdown').value = `${rooms.length} Room ${totalGuests} Guests`;

  const dropdownEl = document.getElementById('guestDropdown');

  const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownEl) || new bootstrap.Dropdown(dropdownEl);

  dropdownInstance.hide();

}



function changeTravellers(type, delta) {

  const input = document.getElementById(type + 'Count');

  let val = parseInt(input.value) + delta;

  if (val < 0) val = 0;

  if (type === 'adult' && val < 1) val = 1;

  input.value = val;

}



function updateTravellerSummary() {

  const adult = parseInt(document.getElementById('adultCount').value);

  const child = parseInt(document.getElementById('childCount').value);

  const infant = parseInt(document.getElementById('infantCount').value);

  const total = adult + child + infant;

  const travelClass = document.querySelector('input[name="travelClass"]:checked').value;



  const label = `${total} Traveller${total > 1 ? 's' : ''}, ${travelClass}`;

  document.getElementById('travellerDropdown').value = label;



  const dropdownEl = document.getElementById('travellerDropdown');

  const dropdown = bootstrap.Dropdown.getInstance(dropdownEl) || new bootstrap.Dropdown(dropdownEl);

  dropdown.hide();

}

function closeTravellerDropdown() {
    updateTravellerSummary();
    
    const dropdownElement = document.getElementById('travellerDropdown');
    const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
    if (dropdown) {
        dropdown.hide();
    }
}



document.addEventListener("DOMContentLoaded", function () {

  const elements = document.querySelectorAll('.stats-number');

  elements.forEach(el => {

    const target = +el.getAttribute('data-count');

    const counter = new countUp.CountUp(el, target, { duration: 2 });

    if (!counter.error) {

      counter.start();

    } else {

      console.error(counter.error);

    }

  });

});



// Trip Type Change Effect

$(document).ready(function () {

  $('input[name="tripType"]').change(function () {

    let type = $(this).val();

    if (type === 'roundtrip') {

      $('.return-field').addClass('active');

    } else {

      $('.return-field').removeClass('active');

    }

  });

});



// Filter Panel Toggle

$(document).ready(function () {

  $('.filter-toggle-btn').on('click', function () {

    $('.flight-filter-panel').addClass('active');

  });



  $('.filter-close-btn').on('click', function () {

    $('.flight-filter-panel').removeClass('active');

  });

  $('.filter-close-btn-2').on('click', function () {

    $('.flight-filter-panel').removeClass('active');

  });



  $('.filter-header').on('click', function () {

    $(this).next('.filter-content').slideToggle(200);

    $(this).find('.toggle-icon').toggleClass('fa-chevron-down fa-chevron-up');

  });

});



// Sort & Tab UI

$(document).ready(function () {

  $('.sort-tab').click(function () {

    $('.sort-tab').removeClass('active');

    $(this).addClass('active');

  });



  $('.date-box').click(function () {

    $('.date-box').removeClass('active');

    $(this).addClass('active');

  });



  $('.flight-tab').click(function () {

    $('.flight-tab').removeClass('active');

    $(this).addClass('active');

  });

});













$(document).ready(function () {

  $('.flight-toggle').on('click', function () {

    const $details = $(this).closest('.row').next('.flight-details');



    if ($details.hasClass('d-none')) {

      $details.removeClass('d-none').addClass('visible');

    } else {

      $details.removeClass('visible');

      setTimeout(() => $details.addClass('d-none'), 600); // Match transition duration

    }

  });

});





$(document).ready(function () {

  $('#baseFareToggle').on('click', function () {

    $('#baseFareBody').stop().slideToggle(300);

    $('#baseIcon').toggleClass('fa-plus fa-minus');

  });



  $('#taxToggle').on('click', function () {

    $('#taxBody').stop().slideToggle(300);

    $('#taxIcon').toggleClass('fa-plus fa-minus');

  });

});







// multicity



$(document).ready(function () {



  // Trip Type Change Logic

  $('input[name="tripType"]').on('change', function () {

    var tripType = $(this).val();



    if (tripType === 'multicity') {

      $('#returnDateBox').hide();

      $('#singleTripWrapper').hide();     // Hide One Way / Round Trip fields

      $('#multiCityBox').show();          // Show Multi City section

      $('.click-hide').hide();            // Hide Search button in single trip layout

    } else {

      $('#returnDateBox').show();

      $('#singleTripWrapper').show();     // Show One Way / Round Trip fields

      $('#multiCityBox').hide();          // Hide Multi City section

      $('.click-hide').show();            // Show Search button in single trip layout

    }



    // Return Date enable/disable

    if (tripType === 'roundtrip') {

      $('#returnDateBox').css({ 'opacity': '1', 'pointer-events': 'auto' });

    } else {

      $('#returnDateBox').css({ 'opacity': '0.4', 'pointer-events': 'none' });

    }



  });



  // Trigger change on page load to set correct layout

  $('input[name="tripType"]:checked').trigger('change');



  // Add/Remove Multi City Rows

  window.addCityRow = function () {

    var rows = $('#multiTripContainer .multi-trip-row').length;

    if (rows >= 3) {

      alert('You can only add up to 3 cities.');

      return;

    }



    var count = rows + 1;

    var newRow = `

        <div class="row g-3 multi-trip-row mt-2">

          <div class="col-lg-6 pr-0 border-0">

            <div class="d-flex align-items-start justify-content-between mobile-style">

              <div class="box-form position-relative">

                <label class="form-title">From</label>

                <input type="text" autocomplete="off" name="fromCityMul[]" class="form-control mb-1 multi-from-city" placeholder="From" />

                <input type="hidden" name="fromCityCodeMul[]" class="multi-from-code" />

              </div>

              <div class="swap-icon text-center align-self-center">⇄</div>

              <div class="box-form-second position-relative">

                <label class="form-title">To</label>

                <input type="text" autocomplete="off" name="toCityMul[]" class="form-control mb-1 multi-to-city" placeholder="To" />

                <input type="hidden" name="toCityCodeMul[]" class="multi-to-code" />

              </div>

            </div>

          </div>

          <div class="col-lg-3 pl-0 dep_wdh">

            <div class="depature-box date-field">

              <label class="form-title">Departure</label>

              <input type="date" autocomplete="off" name="departureDateMul[]" class="form-control mb-1 dep_date_cls" />

            </div>

          </div>

        </div>`;





    $('#multiTripContainer').append(newRow);

    flatpickr(".dep_date_cls", {

      disableMobile: true,
      dateFormat: "Y-m-d",
      minDate: "today",

    });

    $('#removeBtn').show();

  };





  window.removeCityRow = function () {

    var rows = $('#multiTripContainer .multi-trip-row');

    if (rows.length > 1) {

      rows.last().remove();

    }

    if ($('#multiTripContainer .multi-trip-row').length <= 1) {

      $('#removeBtn').hide();

    }

  }



  // Traveller Counters

  window.changeTravellers = function (type, delta) {

    var adultInput = $('#adultCount');

    var childInput = $('#childCount');

    var infantInput = $('#infantCount');



    var adult = parseInt(adultInput.val());

    var child = parseInt(childInput.val());

    var infant = parseInt(infantInput.val());



    // Calculate new value for the type being changed

    var newValue;

    if (type === 'adult') {

      newValue = adult + delta;

      if (newValue < 1) newValue = 1; // Minimum 1 adult

      if (newValue + child > 9) newValue = 9 - child; // Max total 9 (adult + child)

      if (infant > newValue) infant = newValue; // One infant per adult

      adult = newValue;

      adultInput.val(adult);

      infantInput.val(infant); // Update infant if needed

    } else if (type === 'child') {

      newValue = child + delta;

      if (newValue < 0) newValue = 0;

      if (adult + newValue > 9) newValue = 9 - adult;

      child = newValue;

      childInput.val(child);

    } else if (type === 'infant') {

      newValue = infant + delta;

      if (newValue < 0) newValue = 0;

      if (newValue > adult) newValue = adult; // One infant per adult

      infant = newValue;

      infantInput.val(infant);

    }



    updateTravellerSummary();

  };



  window.updateTravellerSummary = function () {

    var adult = parseInt($('#adultCount').val()) || 0;

    var child = parseInt($('#childCount').val()) || 0;

    var infant = parseInt($('#infantCount').val()) || 0;

    var total = adult + child + infant;



    var travelClassValue = parseInt($('input[name="travelClass"]:checked').val());



    var travelClassNames = {

      1: 'All',

      2: 'Economy',

      3: 'Premium Economy',

      4: 'Business',

      5: 'Premium Business',

      6: 'First Class'

    };



    var travelClassLabel = travelClassNames[travelClassValue] || 'Unknown';



    var label = `${total} Traveller${total !== 1 ? 's' : ''}, ${travelClassLabel}`;

    $('#travellerDropdown').val(label);



    // If using Bootstrap dropdowns, hide it after selection

    var dropdownEl = document.getElementById('travellerDropdown');

    var dropdown = bootstrap.Dropdown.getInstance(dropdownEl) || new bootstrap.Dropdown(dropdownEl);

    // dropdown.hide();

  };





  updateTravellerSummary();





});







$(document).ready(function () {



  // Filter Button Click

  $('.filter-btn').click(function (e) {

    e.stopPropagation();



    

    var $dropdown = $(this).closest('.filter-dropdown').find('.dropdown-list');



    

    $('.dropdown-list').not($dropdown).fadeOut(200);

    $('.filter-btn').not(this).removeClass('active');



    

    if ($dropdown.is(':visible')) {

      $dropdown.fadeOut(200);

      $(this).removeClass('active');

    } else {

      $dropdown.fadeIn(200);

      $(this).addClass('active');

    }

  });



  

  $('.reset-btn').click(function (e) {

    e.stopPropagation();

    $('.dropdown-list').fadeOut(200);

    $('.filter-btn').removeClass('active');

  });



  

  $(document).click(function () {

    $('.dropdown-list').fadeOut(200);

    $('.filter-btn').removeClass('active');

  });



  

  $('.dropdown-list').click(function (e) {

    e.stopPropagation();

  });



});









$(document).ready(function () {

  // Open on filter icon click (mobile)

  $('.filter-toggle').on('click', function () {

    $('.filter-panel').addClass('open');

  });



  // Close on close button click (mobile)

  $('.close-filter').on('click', function () {

    $('.filter-panel').removeClass('open');

  });



  // Optional: Click outside to close (mobile only)

  $(document).on('click', function (e) {

    if (!$(e.target).closest('.filter-panel, .filter-toggle').length) {

      $('.filter-panel').removeClass('open');

    }

  });

});





$(document).ready(function () {

  $('.tab-btn').click(function () {

    var target = $(this).data('target');



    $('.tab-btn').removeClass('active');

    $(this).addClass('active');



    $('html, body').animate({

      scrollTop: $('#' + target).offset().top - 80

    }, 400);

  });

});



// flight-listing-multicity



function showForm(type) {

  if (type === 'multicity') {

    document.getElementById('multi_city_form').style.display = 'block';

    document.querySelector('.trip-form').style.display = 'none';



    // Clear previous rows and add one initial row without remove button

    $('#multi_city_container').html(getCityRow(false));

  } else {

    document.getElementById('multi_city_form').style.display = 'none';

    document.querySelector('.trip-form').style.display = 'block';

  }

}



function getCityRow(showRemove = true) {

  return `

        <div class="city-row">

            <div class="row align-items-center mb-2">

                <div class="col-12 col-lg-4">

                    <div class="input-icon">

                        <i class="fas fa-plane-departure"></i>

                        <input type="text" class="input-box" placeholder="From" />

                    </div>

                </div>

                <div class="col-12 col-lg-4 position-relative swap-wrapper">

                    <div class="input-icon">

                        <i class="fas fa-plane-arrival"></i>

                        <input type="text" class="input-box" placeholder="To" />

                    </div>

                    <div class="swap-btn"><i class="fas fa-exchange-alt"></i></div>

                </div>

                <div class="col-lg-3">

                    <div class="input-icon">

                        <label class="inside-label">Departure</label>

                        <i class="fas fa-calendar-alt"></i>

                        <input type="date" class="input-box date-filed" />

                    </div>

                </div>

                ${showRemove ? `

                <div class="col-lg-1">

                    <button type="button" class="btn btn-danger btn-sm remove-city">X</button>

                </div>` : ''}

            </div>

        </div>

    `;

}



$(document).ready(function () {

  $(document).on('click', '.add-city', function () {

    $('#multi_city_container').append(getCityRow(true));

  });



  $(document).on('click', '.remove-city', function () {

    $(this).closest('.city-row').remove();

  });

});




$(document).on('change', 'input[name="tripType"]', function () {

    $('.trip-radio').removeClass('active');
    $(this).closest('.trip-radio').addClass('active');

    const isRoundTrip = $(this).val() === 'roundtrip';

    const $returnField = $('.return-date-field');
    const $returnInput = $('.return-date-input');

    if (isRoundTrip) {
        $returnField.removeClass('disabled');
        $returnInput.val('').prop('readonly', false).removeClass('small-text');
    } else {
        $returnField.addClass('disabled');
        $returnInput.val('Book a round trip').prop('readonly', true).addClass('small-text');
    }

});


$(document).ready(function () {

  // Travel Date

  flatpickr('.travel-date-input', {

    dateFormat: "d-m-Y",

    minDate: "today"

  });



  // Return Date - Create flatpickr instance but don't open by default

  let returnPicker = flatpickr('.return-date-input', {

    dateFormat: "d-m-Y",

    minDate: "today",

    clickOpens: false, // Don't auto-open on focus

    onChange: function (selectedDates, dateStr, instance) {

      $('.return-date-input').val(dateStr);

    }

  });



  // Trip Type Change Logic

  $('input[name="tripType"]').on('change', function () {

    if ($(this).val() === 'roundtrip') {

      // Enable Return Date

      $('.return-date-input').removeAttr('readonly').attr('placeholder', 'Select return date').val('');

    } else {

      // Disable Return Date

      $('.return-date-input').attr('readonly', true).val('Book a round trip');

    }

  });



  // Return Date click

  $('.return-date-input').on('click', function () {

    if (!$(this).attr('readonly')) {

      returnPicker.open();

    }

  });

});