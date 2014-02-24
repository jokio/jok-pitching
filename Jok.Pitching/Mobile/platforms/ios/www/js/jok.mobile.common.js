

function navigate(url) {

        if (!url) return;
        
        // ჩატვირთვის ანიმაციის გამოჩენა
        $('body').append('<div id="MobileSiteContentLoadingBox"><img src="img/loading.gif" alt="Loading"/></div>');
        
        // ყველა შემდგომ დამატებული სტილის წაშლა
        $('head link:not([href^="css/"])').remove();
        
        // თუ შიდა ნავიგაციაა, მივუწეროთ თავში სრული მისამართი
        if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
            url = ROOT_LOCATION + url;
        }
        
	// ვუმატებთ აქტიურ sid-ს, ყველა რექუესტს
	url += ((url.indexOf('?') > -1) ? '&' : '?') + 'userSid=' + localStorage.sid;

        
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                "jok": "ge"
            },
            success: function (data) {
                
                $('body').html(data);
                
                refreshOnNavigate();
            },
            error: function (err) {
                
                $('#MobileSiteContentLoadingBox').remove();
                
                var noConnectionHtml = $('<div id="NoInternetConnection"></div>');
                noConnectionHtml.append('<i class="icon-meh"></i><br/><br/>');
                noConnectionHtml.append('No internet connection, please check internet settings and press retry button below<br/><br/>');
                noConnectionHtml.append('<a class="btn btn-warning" href="javascript:document.location.reload()">Retry</a>');
                
                $('body').html(noConnectionHtml);
            }
        });
        
        // function onConfirm(buttonIndex) {
        //     if (buttonIndex != 2) return;
            
        //     navigate(url);
        // }
}

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
        document.createTextNode(
            "@@-ms-viewport{width:auto!important}"
        )
    );
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

$(document).on(clickEvent, 'a', function () {
    var url = $(this).attr('href');
    
    if (url.indexOf('/') == 0) {
        navigate(url);

        return false;
    }
});


function refreshOnNavigate() {
    
    FastClick.attach(document.body);
    
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            try{
            if (this.url.indexOf('http://') == -1 && this.url.indexOf('https://') == -1) {
                this.url = ROOT_LOCATION + this.url;
            }
            }
            catch(err){
                console.log(err);
            }
        },
        error: function (xhr, status, error) {
            console.error("An AJAX error occured: " + status + "\nError: " + error + "\nUrl: " + this.url);
        }
    });
}
