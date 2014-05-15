// Predefine Variables
//
//
var animation;
var width;
var height;
var borderWidth;
var preset;
var lightup;
var lightups;
var old_lightup;
var content_blocks;
var stylesheet;
var target;
var stylesheets = new Array();

(function($)
{
	$.fn.lightup = function(method) 
	{  
    	// Method is specified
    	if ( methods[method] )
    	{
      		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	}
    	else if ( typeof method === 'object' || ! method )
    	{
      		return methods.init.apply( this, arguments );
    	}
    	else
    	{
      	  $.error( 'Method ' +  method + ' does not exist on Lightup' );
    	}  
	};

	// Determine path to the Lightup folder
	var scripts		= $('script');
	var path;
	$.each(scripts, function()
	{
		if ( $(this).attr('id') == 'lightup-script' )
		{
			path = $(this).attr('src').split('?')[0];
			path = path.split('/').slice(0, -1).join('/');
		}
	});

	var methods = 
	{
		// Initialize the plugin on all lightup boxes and load settings
		init : function(options)
		{
    		// Create some defaults, extending them with any options that were provided
    		var settings = $.extend(
    		{
    			style			: 'smooth',
        		path			: path,
				width			: 600,
				height 			: 'auto',
				borderWidth 	: 0,
				animation		: 'fade',
				animationSpeed	: 1000,
				overlay			: true,
				overlayColor	: '#fff',
				easing			: false
    		}, options);

    		var presets =
    		{
				smooth:
				{
					style			: 'smooth',
					borderWidth 	: 26,
					animation		: 'fade',
					animationSpeed	: 500,
					overlay			: true,
					overlayColor	: '#fff',
					easing			: false
				},
				soft:
				{
					style			: 'soft',
					borderWidth 	: 20,
					animation		: 'fade',
					animationSpeed	: 1000,
					overlay			: true,
					overlayColor	: '#fff',
					easing			: false
				},
				shadow:
				{
					style			: 'shadow',
					borderWidth 	: 48,
					animation		: 'fade',
					animationSpeed	: 1000,
					overlay			: true,
					overlayColor	: '#fff',
					easing			: false
				},
				sharp:
				{
					style			: 'sharp',
					borderWidth	 	: 0,
					animation		: 'fade',
					animationSpeed	: 1000,
					overlay			: true,
					overlayColor	: '#000',
					easing			: false
				}
    		};

			if ( settings.path == undefined )
			{
				var message = 
				"Path to Lightup jQuery plugin not specified! To correct, either add 'id=\"lightup-script\"' to the <script> tag of the Lightup plugin e.g. <script src=\"lightup/js/lightup.jquery.js\" id=\"lightup-script\"></script> "+
				"OR define the path to the Lightup folder as an option: $('.lightup').lightup({ path : 'lightup' });";
				alert(message);
			}
    		
			// Add the overlay layer to the page
			$('body').prepend('<div class="overlay"></div>');

			// Add default styles
			var default_stylesheet 	= '<link rel="stylesheet" href="'+settings.path+'/css/all.css" />';
			$('head').append(default_stylesheet);

			// Loop through all the Lightup boxes and apply settings
			this.each(function()
			{
				// Use HTML attribute to overwrite all settings and options
				if( $(this).attr('rel') != undefined )
				{
					$.extend(settings,presets[$(this).attr('rel')]);
				}
				if( $(this).attr('width') != undefined )
				{
					settings.width = $(this).attr('width');
				}
				if( $(this).attr('height') != undefined )
				{
					settings.height = $(this).attr('height');
				}

				// Add stylesheet to the DOM only if is hasn't been added yet
				stylesheet = '<link rel="stylesheet" href="'+settings.path+'/css/'+settings.style+'.css" />';
				if ( stylesheets[stylesheet] != 1 )
				{
					stylesheet 			= '<link rel="stylesheet" href="'+settings.path+'/css/'+settings.style+'.css" />';
					$('head').append(stylesheet);
					stylesheets[stylesheet] = 1;
				}

				// Wrap the lightup content in a box holder
				$(this).wrapInner('<div class="box" />');

				// Grab the content blocks to be inserted into the template
				content_blocks = $(this).find('.content');

				lightup = $(this);
				$.ajax(
				{
					type: 'GET',
					url: settings.path+'/templates/'+settings.style+'.html',
					async: false,
					success: function(html)
					{
						$.each(content_blocks,function()
						{
							html = html.replace('{{{block}}}',$(this).html());
							$(this).remove();
						});

						if ( settings.height != 'auto' )
						{
							settings.height = settings.height+'px';
						}

						// Store the HTML template in the Lightbox
						$(lightup).find('.box').append(html);

						$(lightup).find('div.box,div.box .holder').css("width",settings.width);
						$(lightup).find('div.box').css("left","50%");
						$(lightup).find('div.box').css("margin-left","-"+parseInt(settings.width/2)+"px");
					}
				});
			});
    		return this.each(function()
    		{
           	   $(this).data(settings, 
           	   {
               	   settings : settings
           	   });
    		});
		},
		show : function(settings)
		{
			settings = this.data(settings);
			$('div.overlay').css("display","block");
			this.css("display","block");
			this.find('div.box').css(
			{
				width: settings.width+'px',
				height: settings.height+'px'
			});
			$('div.box', this).fadeIn(settings.animationSpeed);
			$('div.overlay').css('height',$(document).height()+'px');
		},
		hide : function()
		{
			$('div.overlay').css('display','none');
  	  		this.css('display','none');
  	  		this.find('.box').css('display','none');
		}
	};

	// Triggers Lightup to hide
	$('div.overlay').live('click',function()
	{
		$('div.lightup').lightup('hide');
	});

	// Triggers Lightup to show
	$('[rel="lightup"]').live('click',function()
	{
		target 		= $(this);
		lightups 	= $('.lightup');
		$.each(lightups,function()
		{
			if ( target.hasClass($(this).attr('id')) )
			{
				lightup = '#'+$(this).attr('id');
			}
		});

		if ( lightup == undefined )
		{
			lightup = '.lightup';
		}

		$(lightup).lightup('show');
	});
})(jQuery);

