
// Function called for post-load color switching
function onLoadPage()
{
	colorSvgSubstitution();
}

// Function to determine if light or dark mode should be used
function colorSvgSubstitution()
{
		var el = document.body;
		var newItem = document.createElement("div"); 
		newItem.setAttribute("class", "svgdark");
		el.insertBefore(newItem,el.childNodes[0]);
		var comp = getComputedStyle(newItem,null);
		var strVal = comp.display;
		el.insertBefore(newItem,el.childNodes[0]);
		el.removeChild(newItem);
		if( strVal.toLowerCase().search("inline") >= 0 ) 
		{
			replaceSvgImgEmbed();
		}
};

// Function to fetch the embedded document for the given embedding_element
function getSubDocument(embedding_element)
{
	if (embedding_element.contentDocument) 
	{
		return embedding_element.contentDocument;
	} 
	else 
	{
		var subdoc = null;
		try {
			subdoc = embedding_element.getSVGDocument();
		} catch(e) {}
		return subdoc;
	}
};

// Function to replace one color for one class style 
function replSvgThemeColor(s,a,c)
{
	try
	{
		var colorsfil = s.getElementsByClassName(a);
		for (var k = 0; k < colorsfil.length; k++)
		{
			var ob = colorsfil[k];
			if( ob != null )
				ob.style.fill =c;
		}
	}catch(e){
	}
};

// Function to set one item's color elements if dark mode
function replSvgThemeColors(a)
{
	var elms = document.querySelectorAll(".svg_inline_hint");
	for (var i = 0; i < elms.length; i++)
	{
		var subdoc = getSubDocument(elms[i]);
		if (subdoc)
		{
			//                  colorclass         darktheme         lighttheme
			replSvgThemeColor(subdoc,"svgFillBaseColor","#CCCCCC"); // was #333333
			replSvgThemeColor(subdoc,"svgFillAccent1",  "#FF6764"); // was #FF0000
			replSvgThemeColor(subdoc,"svgFillAccent4",  "#3FD873"); // was #009933
			replSvgThemeColor(subdoc,"svgFillAccent2",  "#EB5500"); // was #FF6600
			replSvgThemeColor(subdoc,"svgFillAccent3",  "#05A7F4"); // was #06A9F4
			replSvgThemeColor(subdoc,"svgFillAccent5",  "#E9AEFF"); // was #FFFF00
		}
    else
    {
      // Following line is temporary fix to show lighter background behind
      // SVG icons - until file: protocol is fixed
      elms[i].setAttribute("style","background: #AAA;border:1px solid #AAA");
    }
	}
};
	
// Function to replace colors for one image that matches svg_inline_hint class
function replaceSvgImgEmbed()
{
	var elms = document.querySelectorAll(".svg_inline_hint");
	for (var i = 0; i < elms.length; i++)
	{
		if( elms[i].tagName.toLowerCase() == "img" )
		{
			try {
				var newItem = document.createElement("embed"); 
				var a = elms[i].parentNode;
				newItem.setAttribute("src",   elms[i].attributes["src"].value);
				newItem.setAttribute("type","image/svg+xml");
				newItem.setAttribute("width", elms[i].attributes["width"].value);
				newItem.setAttribute("height",elms[i].attributes["height"].value);
				newItem.setAttribute("class", elms[i].attributes["class"].value);
				a.insertBefore(newItem,elms[i]);
				elms[i].parentNode.removeChild(elms[i]);
				newItem.addEventListener("load", function() { replSvgThemeColors(newItem); }, false );
			} catch( err ) {
				// Do nothing if failure...
			}
		}
		else
		{
			replSvgThemeColors(elms[i]);
		}
	}
};

// Add a post-load filter to retrigger color change (in case of dark/light switching)
try{
	window.addEventListener("load", onLoadPage, false);
} catch( err ) {
	 // Do nothing if failure
}

// Handle links from hints to main help
var imported = document.createElement('script');
imported.src = '../../Shared/help-redirect-config.js';
document.head.appendChild(imported);

function showTopic(helpID, language) {
	if (!helpURLs) return;
	
	var urlInfo = null;
	helpURLs.forEach(function(helpURL) {
		if (helpURL.lang === language) {
			urlInfo = helpURL;
		}
	});

	if (!urlInfo) return;
	
	var URLtoInvoke = urlInfo.url.replace("@", helpID);

	window.location = URLtoInvoke;
}
