// JavaScript Document
jQuery.support.cors = true;
$(document).ready(function(){
	var params = getUrlVars();
	
	$('#idiv,.navbar,#articlecontent').hide();
	
	setupNavFeatures('#index');
	setipNavCalltype('#index');
	$('#feat_serv').click(function(){
			$('#feat_title').show();
			$('#guide_title').hide();
			$('.full_reset').show();
			$('#features').show();
			$('#index').hide();
			$('#idiv,#bottom_navbar').show();
			if(typeof $('#features .current_item').attr('id')!=='undefined'){
				$('#features .current_item').click();
			}
			else{
				$('#articlecontent').attr('src', 'about:blank');
				$('#articlecontent').hide();
			}
		});
	$("#reset").click(function(){
		$('#features .current_item').html($('#features .current_item').text().substr(2));
		$('#features .current_item').toggleClass('current_item');
		$('#features li').removeClass('check');
		$('#articlecontent').attr('src', 'about:blank');
		$('#articlecontent').hide();
		});
	$("#return").click(function(){backToIndex()});
	/* Commenting out - intranet-only process
	$("#feed_button").click(function(){sendfeedback()});*/
	$('#top_navbar').on('click','button',function(){
			if(!$(this).hasClass('pressed')){
				$('#top_navbar button').toggleClass('pressed');
			}
		});
	
	if(typeof params['calltype']=== 'undefined'||params['calltype']=='index'){
		loadXml('index.xml','index');
		loadXml('optional.xml','features');
	}
	else if(params['calltype']=='optional'){
		loadXml('optional.xml','features');
		$("#feat_serv").click();
		loadXml('index.xml','index');		
	}
	else{
		$('#index').hide();
		$('#idiv,.navbar').show();
		loadXml(params['calltype']+'.xml','calltype');
		loadXml('index.xml','index');
		loadXml('optional.xml','features');
	}
});

function setupNavFeatures(altTab){
	$("#nav_features").unbind();
	$("#nav_features").click(function(){
		$('#feat_title').show();
		$('#guide_title').hide();
		$('.full_reset').show();
		$('#features').show();
		$(altTab).hide();
		$('#idiv,.navbar').show();
		if(typeof $('#features .current_item').attr('id')!=='undefined'){
			$('#features .current_item').click();
		}
		else{
			$('#articlecontent').attr('src', 'about:blank');
			$('#articlecontent').hide();
		}
	});
}
function setipNavCalltype(thisTab){
	$("#nav_calltype").unbind();
	$("#nav_calltype").click(function(){
		$('#feat_title').hide();
		$('#guide_title').show();
		$('.full_reset').hide();
		$('#features').hide();
		$(thisTab).show();
		if(thisTab==='#calltype'){
			$('#calltype .current_item').click();
		}
		else{
			backToIndex();
		}
	});
}
function loadXml(fileName,listLoc){
	$.ajax({
		type: "GET",
		url: 'xml/'+fileName,
		dataType: "xml",
		cache: false,
		success: function(xml){
				if(listLoc==='index'){
					buildIndex(xml);
				}
				else{
					buildCallType(xml,listLoc);
				}
			},
		error: function(){
				if(listLoc==='calltype'){
					backToIndex();
				}
			}
	});
}
function buildIndex(xml){
	half = Math.ceil($(xml).find('link').length/2);
	containerId = '#list_1';
	$(xml).find('link').each(function(index){
		var tmp_id = 'index_'+index;
		var tmp_xml = $(this).find('linkxml').text();
		var index_html = '<div id="'+tmp_id+'" class="item bold">'+$(this).find('linkname').text()+'</div>';
		if(index==half){
			containerId = '#list_2';
		}
		$(index_html).appendTo(containerId);
		$('#'+tmp_id).click(function(){loadXml(tmp_xml,'calltype');$('#idiv,.navbar').show();});
	});
}
function buildCallType(xml,listLoc){
	var disclose = $(xml).find('disclosure').text();
	if(disclose!='none'){
		$('#'+listLoc+' .disclose').html($(xml).find('disclosure').text());
		$('#'+listLoc+' .disclose').show();
	}
	else{
		$('#'+listLoc+' .disclose').html('');
		$('#'+listLoc+' .disclose').hide();
	}
	$(xml).find('step').each(function(index){
		var tmp_id = listLoc+'_'+index;
		var check_id = 'check_'+index;
		var tmp_link = $(this).find('linkvariable').text();
		var step_html = '<li id="'+tmp_id+'" class="item">'+$(this).find('steplabel').text()+'</li>';
		$(step_html).appendTo('#'+listLoc+' ul');
		$('#'+tmp_id).click(function(){ selectStep($(this),check_id,listLoc,tmp_link) });
	});
	if(listLoc==='calltype'){
		var title = $(xml).find('guidetitle').text();
		$('#guide_title').html(title);
		$('#'+listLoc).show();
		$('#index').hide();
		$('#nav_calltype').addClass('pressed');
		setupNavFeatures('#calltype');
		setipNavCalltype('#calltype');
	}
}
function selectStep(step,check_id,listLoc,Url){
	$('#articlecontent').show();
	$('#articlecontent').attr('src', Url);
	$('#'+listLoc+' .current_item').html($('#'+listLoc+' .current_item').text().substr(2));
	$('#'+listLoc+' .current_item').toggleClass('current_item');
	step.html('> '+step.text());
	step.toggleClass('current_item');
	step.addClass('check');
}
function backToIndex(){
	setupNavFeatures('#index');
	setipNavCalltype('#index');
	$('#feat_title').hide();
	$('#guide_title').show();
	$('.full_reset').hide();
	$('#features').hide();
	$('#calltype').hide();
	$('#calltype ul').empty();
	$('#guide_title').html('CCD Tool');
	$('#index').show();
	$('#idiv,.navbar').hide();
	$('#articlecontent').attr('src', 'about:blank');
	$('#articlecontent').hide();
}
function getUrlVars() {     
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
		}
	return vars;
}
/* Commenting out - intranet-only process
function sendfeedback() {
	var subject = $('#guide_title').text() == 'CCD Tool'?'CCD Tool':'CCD Tool - '+$('#guide_title').text();
	$('#Subj').val(subject);
	$('#ref').val('***intranet-only URL***');
	$.post('***intranet-only URL***', { Cat: 'Content Feedback', Subj: subject, ref: '***intranet-only URL***'});
	$('#im').submit();
}*/