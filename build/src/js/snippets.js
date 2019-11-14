/*eslint-env jquery*/
(function() {
  'use strict'; 

/*----------------------------------------------------------------------------*/
// Scripts
/*----------------------------------------------------------------------------*/  
  // debuging function
  var helloWorld = (a) => {
    console.log(a);
  };
  var detectElement = (a) => { // element, color,
    var elementLength = $(a).length;
    // $(a).css('border', '1px solid' + ' ' + b);
    console.log(elementLength); // counts element
    // $(a).addClass(c);
  };
  helloWorld();
  detectElement('div');   
  var intervarlRunner = () => {
    setInterval(function(funk) { 
      funk;
      }, 100); // 100 milliseconds
  };
  intervarlRunner(helloWorld('hi'));
  // end of debuggers
  var windowWidth = $(window).width();  
  var windowHeightVisible = window.innerHeight;
  function countElThis(a) {   
    console.log(a + ' element');
  };
  countElThis($('h4').length);// add a class or element to count how many are in the dom tree

  function equilizeElementWidth(a, b) { // finds height of element (a) and sets height (a) to element (b) 
    var gridWidth = $(a).width();
    $(b).css({
      'max-width': gridWidth,
    });     
  }
  equilizeElementWidth('.tile-card .text-center', '.tile-card .text-center'); 
  function equilizeElementHeight(a, b) { // finds height of element (a) and sets height (a) to element (b) 
    var gridHeight = $(a).height();
    $(b).css({
      'min-height': gridHeight,
    });     
  }

  // Equilizers to help give same height to elements
  equilizeElementHeight('.graphic-bg-payments', '.info-callout-copy'); 
  equilizeElementHeight('.graphic-bg-payments', '.employ-box');
  equilizeElementHeight('.info-works', '.info-works');
  equilizeElementHeight('.eq-el', '.eq-el');
  equilizeElementHeight('.tile-card > .text-center', '.tile-card > .text-center');
  equilizeElementHeight('.tile', '.tile');  
  equilizeElementHeight('.main-info', '.info-graphic');
  
  // detects certain screen sizes for debuggins layout issues
  function ifScreenSize(a) {
    if (windowWidth < a) {      
      $('.nine-60').removeClass('col');
      $('.nobr').removeClass('fl');
    } else {            
      $('.nine-60').addClass('col');
      $('.nobr').addClass('fl');        
    }
  } 

  ifScreenSize(960);
  // equilizer
  function equilizeContentBox() { // triggers functions on resize
    $(window).resize(function() {
      equilizeElementHeight('.graphic-bg-payments', '.info-callout-copy');
      equilizeElementHeight('.graphic-bg-payments', '.employ-box');
      ifScreenSize(960);
    });
  }
  equilizeContentBox();
  
  $(window).resize(function() { // if windowe is resized
    // location.reload();
    screenSizeTrigger();
  }); 
  var ajaxForm = function(e) {
    e.preventDefault();     
    var values = $(this).serialize();
    var action = 'contact_helper_json.php';       
    $.ajax({
      url: action,
      type: 'post',
      cache: false,
      data: values,
      success: ajaxSuccess,
      error: function(error) {
        console.log(error); 
      },
    });     
    return false;
  };    

  // active navigation
  function navBar() {
    var wrapper = $('#mainnav');
    var links = wrapper.find('a');
    var bar = wrapper.find('.active-bar');
    var active = wrapper.find('.active a'); 
    var aw = 0;
    var ax = 0;
    var w = 0;
    var x = 0;    
    var resize = function() {
      if (active.length) {
        ax = active.position().left;
        aw = active.outerWidth();   
      } else {
        ax = links.eq(0).position().left;
        aw = active.eq(0).outerWidth(); 
      }     
      bar.css({left: ax, width: aw});
    };
    resize();     

    var over = function() {
      x = $(this).position().left;
      w = $(this).outerWidth();     
      bar.css({left: x, width: w});
    };    
    var out = function() {
      if (active.length) {
        bar.css({left: ax, width: aw});
      } else {
        bar.css({left: x + w / 2, width: 0});
      }
    };    
    links.on('mouseover', over).on('mouseout', out);
    $(window).resize(resize);
    setTimeout(resize, 100);
  }
  
  function navTrigger() {
    window.onscroll = () => {
      const Ypos = window.pageYOffset;
      if (Ypos > 120) {     
        $('.navbar').addClass('navbar-full slide-bottom');
        navBar();
      } else {      
        if (windowWidth >= 768) {
          $('.navbar').removeClass('navbar-full slide-bottom');
        }
      }
    };    
  }   
  navTrigger();

  function screenSizeTrigger() {              
    if (windowWidth < 768) {        
        $('.navbar').addClass('navbar-full slide-bottom').removeClass('col-md-11');
        $('.dots').css('display', 'none');
        $('.sub-heading').addClass('sub-heading-mobile');
        $('.graph-1 , .graph-3 , .graph-5 , .graph-2 , .graph-4').addClass('img-graph-reset');
        $('.fa-chevron-left').addClass('fa-chevron-left-mobile');
        $('.fa-chevron-right').addClass('fa-chevron-right-mobile');
        $('.grid-content').removeClass('px-md-5 mx-md-5');
        $('.nobr').css('display', 'none').removeClass('pt-5 mt-5 ');  
        $('.supporting-graphic , .factors .content').addClass('col-md-12');
        navTrigger();       
    } else {  
      $('.supporting-graphic , .factors .content').removeClass('col-md-12');
      navTrigger();
      navBar();
    };  
    if (windowWidth === 768) {        
      navBar(); 
    };        
    if (windowWidth === 1024) {                     
      $('.nobr').css('display', 'none');
      navBar();
    };    
  } 
  intervarlRunner(navBar());  
  // Error States for form
  var ajaxSuccess = function(data) {
    $('form').find('input,textarea').removeClass('error');      
    if (data.errors) {
      var names = Object.keys(data.fields);     
      for (var i = 0; i < names.length; i++) $('form').find('[name="' + names[i] + '"]').addClass('error');
    } else {
      // window.location = 'contact-thank-you.html';
      window.open('mailto:jimmyvieng@gmail.com?subject=subject&body=body');
      alert('sent');
    }
  };    
  $('form').on('submit', ajaxForm);
  function heroSize() {   
    $('.hero-wrapper').css('min-height', windowHeightVisible);
  }
  heroSize();
  console.log(windowHeightVisible); 





      // Label Replace 
      function labelReplace(){
        var labels = document.querySelectorAll("p.pd-text label, p.pd-select label, p.pd-textarea label");
        var i = labels.length;
        while (i--) {
          var label = labels.item(i);
          var text = label.textContent;
          label.parentNode.classList.contains("required") && (text += " *");
          var nextElement = label.nextElementSibling;
          if (nextElement) {
            if (nextElement.tagName == 'SELECT') {
              nextElement.options[0].text = text;
            } else {
              nextElement.setAttribute("placeholder", text);
            }
            label.parentNode.removeChild(label);
          }
        }
        var elements = document.querySelectorAll('.errors');
        Array.prototype.forEach.call(elements, function(el, i) {
          el.parentNode.removeChild(el);
        });
      }
      
      // labelReplace();      
      
      // replaces hero image 
      function replaceHeroImg(heroEl){
          var imgAttriA = $('.hero-bg').attr('src'); // targets and stores dummy src
          var bgImage = $(heroEl); // targets element with styled background image
          bgImage.css("background-image", "url(" + imgAttriA + ")"); // updates targeted class background image with dummy
          }

        // detects template 
        function detectTemplate(){
          var pageTemplate = $('body');
          if (pageTemplate.is('.lp-tempate-one')){
            replaceHeroImg('.hero');
          }else {                    
            replaceHeroImg('.hero-cta');
          }
        }
        detectTemplate();        
        if ($('form.form p').first().is('.form-field')) {
          console.log('p tag with form-field class detected');     
        }else{
          console.log('p tag without form-field class detected adds class');     
          $('form.form p').first().addClass('p-first-of-type');        
        }          
        function formEquilizer(){
          var formHeight = $('body.lp-tempate-one .form-wrapper').height() - 450 + 'px';        
          $('body.lp-tempate-one .three-col-cta').css('margin-top', formHeight);                  
          console.log(formHeight);
        }            
        if ($(window).width() < 1200) {
           console.log('Less than 960');
           $('body.lp-tempate-one .three-col-cta').css('margin-top', '0');                            
        }
        else {
           console.log('More than 960');
           formEquilizer();
        }
    /**
     * Get the user IP throught the webkitRTCPeerConnection
     * @param onNewIP {Function} listener function to expose the IP locally
     * @return undefined
     */
    
    //   function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //     //compatibility for firefox and chrome
    //     var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    //     var pc = new myPeerConnection({
    //         iceServers: []
    //     }),
    //     noop = function() {},
    //     localIPs = {},
    //     ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    //     key;

    //     function iterateIP(ip) {
    //         if (!localIPs[ip]) onNewIP(ip);
    //         localIPs[ip] = true;
    //     }

    //      //create a bogus data channel
    //     pc.createDataChannel("");

    //     // create offer and set local description
    //     pc.createOffer().then(function(sdp) {
    //         sdp.sdp.split('\n').forEach(function(line) {
    //             if (line.indexOf('candidate') < 0) return;
    //             line.match(ipRegex).forEach(iterateIP);
    //         });
            
    //         pc.setLocalDescription(sdp, noop, noop);
    //     }).catch(function(reason) {
    //         // An error occurred, so handle the failure to connect
    //     });

    //     //listen for candidate events
    //     pc.onicecandidate = function(ice) {
    //         if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    //         ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    //     };
    // }

    // Usage

    // getUserIP(function(ip){
    //     alert("Got IP! :" + ip);
    // });  
})();
