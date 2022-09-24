$(document).ready(function () {
        var el = $('.owl-carousel');

        var carousel;
        var carouselOptions = {
            margin: 0,
            navigation: true,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
            slideBy: 'page',
            pagination: false,
            dots: false,
            autoplay: true,
            responsive: {
                0: {
                    nav: true,
                    loop: true,
                    items: 2,
                    rows: 1 //custom option not used by Owl Carousel, but used by the algorithm below
                },
                768: {
                    nav: true,
                    loop: true,
                    items: 4,
                    rows: 2 //custom option not used by Owl Carousel, but used by the algorithm below
                },
                991: {
                    nav: true,
                    loop: true,
                    items: 4,
                    rows: 2 //custom option not used by Owl Carousel, but used by the algorithm below
                }
            }
        };

        //Taken from Owl Carousel so we calculate width the same way
        var viewport = function () {
            var width;
            if (carouselOptions.responsiveBaseElement && carouselOptions.responsiveBaseElement !== window) {
                width = $(carouselOptions.responsiveBaseElement).width();
            } else if (window.innerWidth) {
                width = window.innerWidth;
            } else if (document.documentElement && document.documentElement.clientWidth) {
                width = document.documentElement.clientWidth;
            } else {
                console.warn('Can not detect viewport width.');
            }
            return width;
        };

        var severalRows = false;
        var orderedBreakpoints = [];
        for (var breakpoint in carouselOptions.responsive) {
            if (carouselOptions.responsive[breakpoint].rows > 1) {
                severalRows = true;
            }
            orderedBreakpoints.push(parseInt(breakpoint));
        }

        //Custom logic is active if carousel is set up to have more than one row for some given window width
        if (severalRows) {
            orderedBreakpoints.sort(function (a, b) {
                return b - a;
            });
            var slides = el.find('[data-slide-index]');
            var slidesNb = slides.length;
            if (slidesNb > 0) {
                var rowsNb;
                var previousRowsNb = undefined;
                var colsNb;
                var previousColsNb = undefined;

                //Calculates number of rows and cols based on current window width
                var updateRowsColsNb = function () {
                    var width = viewport();
                    for (var i = 0; i < orderedBreakpoints.length; i++) {
                        var breakpoint = orderedBreakpoints[i];
                        if (width >= breakpoint || i == (orderedBreakpoints.length - 1)) {
                            var breakpointSettings = carouselOptions.responsive['' + breakpoint];
                            rowsNb = breakpointSettings.rows;
                            colsNb = breakpointSettings.items;
                            break;
                        }
                    }
                };

                var updateCarousel = function () {
                    updateRowsColsNb();

                    //Carousel is recalculated if and only if a change in number of columns/rows is requested
                    if (rowsNb != previousRowsNb || colsNb != previousColsNb) {
                        var reInit = false;
                        if (carousel) {
                            //Destroy existing carousel if any, and set html markup back to its initial state
                            carousel.trigger('destroy.owl.carousel');
                            carousel = undefined;
                            slides = el.find('[data-slide-index]').detach().appendTo(el);
                            el.find('.fake-col-wrapper').remove();
                            reInit = true;
                        }


                        //This is the only real 'smart' part of the algorithm

                        //First calculate the number of needed columns for the whole carousel
                        var perPage = rowsNb * colsNb;
                        var pageIndex = Math.floor(slidesNb / perPage);
                        var fakeColsNb = pageIndex * colsNb + (slidesNb >= (pageIndex * perPage + colsNb) ? colsNb : (slidesNb % colsNb));

                        //Then populate with needed html markup
                        var count = 0;
                        for (var i = 0; i < fakeColsNb; i++) {
                            //For each column, create a new wrapper div
                            var fakeCol = $('<div class="fake-col-wrapper"></div>').appendTo(el);
                            for (var j = 0; j < rowsNb; j++) {
                                //For each row in said column, calculate which slide should be present
                                var index = Math.floor(count / perPage) * perPage + (i % colsNb) + j * colsNb;
                                if (index < slidesNb) {
                                    //If said slide exists, move it under wrapper div
                                    slides.filter('[data-slide-index=' + index + ']').detach().appendTo(fakeCol);
                                }
                                count++;
                            }
                        }
                        //end of 'smart' part

                        previousRowsNb = rowsNb;
                        previousColsNb = colsNb;

                        if (reInit) {
                            //re-init carousel with new markup
                            carousel = el.owlCarousel(carouselOptions);
                        }
                    }
                };

                //Trigger possible update when window size changes
                $(window).on('resize', updateCarousel);

                //We need to execute the algorithm once before first init in any case
                updateCarousel();
            }
        }

        //init
        carousel = el.owlCarousel(carouselOptions);
    });


      (function () {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }

                    form.classList.add('was-validated')
                }, false)
            })
    })()


    jQuery(".searchable input").focus(function () {
        jQuery(this).closest(".searchable").find("ul").show();
        jQuery(this).closest(".searchable").find("ul li").show();
    });
    jQuery(".searchable input").blur(function () {
        let that = this;
        setTimeout(function () {
            jQuery(that).closest(".searchable").find("ul").hide();
        }, 300);
    });

    jQuery(document).on('click', '.searchable ul li', function () {
        jQuery(this).closest(".searchable").find("input").val(jQuery(this).text()).blur();
        //onSelect(jQuery(this).text())
    });

    jQuery(".searchable ul li").hover(function () {
        jQuery(this).closest(".searchable").find("ul li.selected").removeClass("selected");
        jQuery(this).addClass("selected");
    });




    /*Select functions */
    function filterFunction(that, event) {
        let container, input, filter, li, input_val;
        container = jQuery(that).closest(".searchable");
        input_val = container.find("input").val().toUpperCase();

        if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
            keyControl(event, container)
        } else {
            li = container.find("ul li");
            li.each(function (i, obj) {
                if (jQuery(this).text().toUpperCase().indexOf(input_val) > -1) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });

            container.find("ul li").removeClass("selected");
            setTimeout(function () {
                container.find("ul li:visible").first().addClass("selected");
            }, 100)
        }
    }

    function keyControl(e, container) {
        if (e.key == "ArrowDown") {

            if (container.find("ul li").hasClass("selected")) {
                if (container.find("ul li:visible").index(container.find("ul li.selected")) + 1 < container.find("ul li:visible").length) {
                    container.find("ul li.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
                }

            } else {
                container.find("ul li:first-child").addClass("selected");
            }

        } else if (e.key == "ArrowUp") {

            if (container.find("ul li:visible").index(container.find("ul li.selected")) > 0) {
                container.find("ul li.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
            }
        } else if (e.key == "Enter") {
            container.find("input").val(container.find("ul li.selected").text()).blur();
            //onSelect(container.find("ul li.selected").text())

        }

        container.find("ul li.selected")[0].scrollIntoView({
            behavior: "smooth",
        });
    }