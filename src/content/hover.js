function addHoverTag() {
    $("p").each(function () {
        console.log("hi")
        $('p').each(function() {
            let $this = $(this);
            $this.html($this.text().replace(/(?<!(<\/?[^>]*|&[^;]*))([^\s<]+)/g, '$1<hover data-tooltip="$2" data-tooltip-position="top">$2</hover>'));
        });

    });
}