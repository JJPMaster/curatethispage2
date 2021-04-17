//<nowiki>
mw.loader.load('//en.uncyclopedia.co/w/index.php?title=User:JJPMaster/CurateThisPage2/markpatrolled1.js&action=raw&ctype=text/javascript');
mw.loader.load('//en.uncyclopedia.co/w/index.php?title=User:JJPMaster/CurateThisPage2/markpatrolled2.js&action=raw&ctype=text/javascript');
mw.util.addPortletLink('p-cactions', 'https://en.uncyclopedia.co/wiki/Special:NewPages#page', 'Mark as patrolled', '1', 'Just mark this goddamn page as patrolled!')
var uTemplate = [
	'subst:User:JJPMaster/defaultICU/generic',
	'subst:User:JJPMaster/defaultICU',
    'subst:User:JJPMaster/defaultNRV',
    'Expansion',
    'Construction',
    'Fix',
    'Cleanup',
];
 
// Text to be shown in Toolbox
var uText = [
	"Generic ICU",
	"ICU (short)",
	"ICU (NRV)",
    "Expand",
    "Construction",
    "Generic fix tag",
    "Cleanup",
];

// Mouseover help text for Toolbox
var uHelp = [
	"Add tag",
	"Add tag",
	"Add tag",
	"Add tag",
	"Add tag",
];

// Add the template
function template_mark(talkpage_fakeaction1) {
	var editlk = document.getElementById('ca-edit').getElementsByTagName('a')[0].href;
	document.location = editlk + '&tagaction=' + talkpage_fakeaction1;
}
 
// Add template to user talk page
function template_addTemplate(template) {
	var txt = '{{' + template + '}}';
	document.editform.wpTextbox1.value = document.editform.wpTextbox1.value + '\n' + txt;
	//  the edit summary for when you mark the image. You can change it if you want.
	document.editform.wpSummary.value = 'Adding tag (using [[User:JJPMaster/CurateThisPage2|CurateThisPage2]])';
	if (template_autosave) document.editform.wpSave.click();
}

function makeVectorFancySection()  {
	//wrap this in a try. this might be somewhat delicate at the moment.
	var pNotify = document.createElement('div');
	pNotify.id = 'p-Notify';
	pNotify.className = 'vectorMenu';
	pNotify.innerHTML = ' <h3><span>Add tag</span><a href="#"></a></h3> <div class="menu"> <ul> </ul> </div>';
	var rightNav = document.getElementById('right-navigation');
	var pViews = document.getElementById('p-views');
	pViewsCont = document.createElement('div');
	pViewsCont.id = 'p-views-continued';
	pViewsCont.className = 'vectorTabs';
	var pViewsUL = document.createElement('ul');
	pViewsCont.appendChild(pViewsUL);
	var pivot = (document.getElementById('ca-history') ? document.getElementById('ca-history') : document.getElementById('ca-addsection'));
	pivot = (pivot ? pivot : document.getElementById('ca-edit'));
	pViewsUL.appendChild(pivot);
	rightNav.insertBefore(pNotify, pViews.nextSibling);
	rightNav.insertBefore(pViewsCont, pNotify.nextSibling); 
}
 
// Add the menu, or add the template to the edit page
function template_onload() {
    try {
    if (mw.config.get('skin') === 'vector') {
        if (window.useFancyVectorDropdown || window.useFancyVectorDropdown === undefined) {
            try {
                makeVectorFancySection();
                useFancyVectorDropdown = 'done'; //this is for debug. can remove
            }
            catch (e) {
                document.getElementById('panel').innerHTML += '<div id="p-Notify" class="portal"><h3 lang="en" xml:lang="en">Add tag</h3><div class="body">\n <ul> </ul> </div> </div>';
            }
        }
        else {
            document.getElementById('panel').innerHTML += '<div id="p-Notify" class="portal"><h3 lang="en" xml:lang="en">Add tag</h3><div class="body">\n <ul> </ul> </div> </div>';
       }
    } else if (mw.config.get('skin') === 'monobook') {
        document.getElementById('column-one').innerHTML += '<div id="p-Notify" class="portlet"> <h3 lang="en" xml:lang="en">Add tag</h3> <div class="pBody">	<ul></ul></div>	</div>';
    }
    } catch (e) {} //ignore errors and just use tb if they happen.
    var portlet = (document.getElementById('p-Notify') ? 'p-Notify' : 'p-tb');
 
    for( var i = 0; i < uText.length; i++ ) {
	    var node = mw.util.addPortletLink(portlet, '', uText[i], 'mark-warn', uHelp[i], null, null);
	    $( node ).click( { template_idx: i }, function(e) {
	    	e.preventDefault();
	    	template_mark( e.data.template_idx );	
	    } );
    }
    var action_idx = -1;
	try {
		action_idx = parseInt (mw.util.getParamValue('tagaction'), 10);
	} catch (some_error) {
		action_idx = -1;    
	}
	if ( uTemplate[ action_idx ] !== undefined ) {
		template_addTemplate( uTemplate[ action_idx ] );
	}
}
 

if (
	mw.config.get( 'wgPageContentModel' ) === 'wikitext'
) {
	// Load dependencies and wait for page to be ready
	$.when( mw.loader.using( [ 'mediawiki.util' ] ), $.ready )
		.done( template_onload );
}
//</nowiki>
