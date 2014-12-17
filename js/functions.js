var pathRoot = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
var titleRoot = document.title;
var current = '';
/* THIS IS CONFIG DATA SPECIFIC TO SITE */
var pages = ['#titlepage','#reflection','#people','#best','#worst','#wishlist','#photos','#timeline'];
var galleries = ['#photos'];

function load_omniture() {
        var omni = $('#omniture').html();
        $('#omniture').after('<div id="new_omni">' + omni + '</div>');
}
function build_url(path) {
        var url = pathRoot + path;
        return url;
}
function rewrite_url(path, new_title) {
        var url = build_url(path);
        current = path;
        document.title = (new_title === 'root' ) ? titleRoot : new_title + ' - ' + titleRoot;
        window.history.replaceState('', new_title, url);
}
function revealSlides(galleries) {
    for (key in galleries) {
        $(galleries[key]).find('img').unveil();
        $(galleries[key]+'.centergallery').slick({
            centerMode: true,
            centerPadding: '15%',
            slidesToShow: 1,
            prevArrow: '<button type="button" class="slick-prev"><span>&lt;</span></button>',
            nextArrow: '<button type="button" class="slick-next"><span>&gt;</span></button>',
            responsive: [{
                breakpoint: 800,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '8%',
                    slidesToShow: 1
                }
            }]
        });
    }
}

function checkHash() {
    if (window.location.hash) {
        revealSlides(galleries);
        var hash = window.location.hash;
        if ($(hash).hasClass('hide')) {
            toggleSidebar(hash,hash + 'link');
        } else {
            scrollDownTo(hash);
        }
    }
}

function scrollDownTo(whereToScroll, scrollOffset) {
    scrollOffset = typeof scrollOffset !== 'undefined' ? scrollOffset : 60;
    $('html,body').animate({
        scrollTop: ($(whereToScroll).offset().top - scrollOffset)
    }, 300);
}

function toggleSidebar(toShow,toHide) {
    $(toShow).removeClass('hide');
    $(toHide).addClass('hide');
    scrollDownTo(toShow);
}

function playerCreator(embedId, playerId, divId) {
    divId = typeof divId !== 'undefined' ? divId : false;
    if (divId) {
        $(divId).animate({backgroundColor:'rgba(0,70,70,0.3)',paddingLeft:'.5em',paddingRight:'.5em'}, 350).delay(2000).animate({backgroundColor:'transparent',paddingLeft:'0',paddingRight:'0'},1000);
    }
    OO.Player.create(embedId, playerId, {'autoplay':true});
}

function playerScroller(embedId, playerId, divId) {
    scrollDownTo(('#' + embedId),100);
    playerCreator(embedId, playerId, divId);
}
function getNodePosition(node) {
    var eTop = $(node).offset().top;
    return Math.abs(eTop - $(window).scrollTop());
}
function isVisible(element) {
    var vidTop = $(element).offset().top;
    var vidBot = $(element).offset().top + $(element).height();
    var fromTop = $(window).scrollTop() + $(element).height() / 2;
    if ( fromTop > vidTop && fromTop < vidBot ) {
        return true;
    } else {
        return false;
    }
}

function isElementInViewport(el) {
    el = el.replace('#','');
    var rect = document.getElementById(el).getBoundingClientRect();

    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */ &&
        rect.top < (window.innerHeight || document. documentElement.clientHeight) /*or $(window).height() */;
}

$('.top-top').click(function(evt) {
    $('.toggle-topbar').click();
});

$('.vid-embed').on("mouseenter", function() {
    $(this).find('.playicon').fadeTo(300, 0);
    $(this).find('.playtext').fadeTo(300, 1);
});
$('.vid-embed').on("mouseleave", function() {
    $(this).find('.playicon').fadeTo(300, 1);
    $(this).find('.playtext').fadeTo(300, 0);
});

var moreAd = true;
var titleFade = true;

function fadeNavBar(reverse) {
    if (reverse) {
        $('#name1').animate({opacity:1},500);
        $('#name2').animate({opacity:0},500);
        titleFade = true;
    } else {
        $('#name1').animate({opacity:0},500);
        $('#name2').animate({opacity:1},500);
        titleFade = false;
    }
}

function checkFade() {
    if ( !isElementInViewport('titlepage') && titleFade ) {
        fadeNavBar(false);
    } else if (isElementInViewport('titlepage') && !titleFade) {
        fadeNavBar(true);
    }
}

function hideAdManual() {
    $('#adwrapper').fadeOut(300);
    $('#adwrapper a.boxclose').css('display', 'none');
    $('#footer-bar').delay(150).animate({marginBottom:'0'},300);
    $('#adframewrapper').html('');
    moreAd = false;
}

$(document).keyup(function(e) {
    if (!moreAd && e.keyCode == 27) {
        hideAdManual();
    }    
});

function getAdSize() {
    if ( $(window).width() >= 740 ) {
        var adSizes = ['ad=medium','728','90'];
        return adSizes;
    } else {
        return false;
    }
    /* else if ( $(window).width() >= 300 && $(window).width() < 740 ) {
        var adSizes = ['ad=small','300','50'];
        return adSizes;
    }*/
}

function showAd() {
    var adSize = getAdSize();
    if (moreAd && adSize) {
        $('#adframewrapper').html('<iframe src="' + pathRoot + 'ad.html?' + adSize[0] + '" seamless height="' + adSize[2] + '" width="' + adSize[1] + '" frameborder="0"></iframe>');
        $('#adwrapper').fadeIn(400);
        $('a.boxclose').fadeIn(400);
        var adH = $('#adwrapper').height();
        $('#footer-bar').css('margin-bottom',adH);
        moreAd = false;
    }
}

function getAdTimes(numAds) {
    var adReturns = [];
    var docHeight = $(document).height();
    var chunkHeight = docHeight / numAds;
    var innerHeight = (window.innerHeight * 2);
    for (i=1;i<=numAds;i++) {
        adReturns.push( Math.round( innerHeight + (chunkHeight * i) ) );
    }
    return adReturns;
}

var adTimes = getAdTimes(3);

function checkAdPos() {
    for (var i = 1; i < adTimes.length; i++) {
        if (adTimes[i] > ($(window).scrollTop() - 35) && adTimes[i] < ($(window).scrollTop() + 35)) {
            hideAdManual();
            moreAd = true;
        }
    }
    if ($(window).scrollTop() > adTimes[0] ) {
        if (moreAd) {
            showAd();
        }
    }
}

function checkPageState(pages) {
    for (key in pages) {
        var currentpage = pages[key];
        var next = (pages[parseInt(key) + 1]) ? pages[parseInt(key) + 1] : currentpage;
        var prev = (pages[parseInt(key) - 1]) ? pages[parseInt(key) - 1] : currentpage;
        if (isElementInViewport(currentpage) && !isElementInViewport(next) & !isElementInViewport(prev) && current != currentpage) {
            var triggerDiv = $(currentpage);
            rewrite_url($(triggerDiv).data('omniUrl'),$(triggerDiv).data('omniTitle'));
            if ($(triggerDiv).hasClass('omnitrig')) {
                load_omniture();
                $(triggerDiv).removeClass('omnitrig');
            }
        }
    }
}

$(document).ready(function() {
    checkHash();
    checkAdPos();
});

var didScroll = false;
$(window).scroll(function() {
    didScroll = true;    
});
setInterval(function() {
    if (didScroll) {
        checkFade();
        checkPageState(pages);
        checkAdPos();
    }
},250);