function addHoverTag() {
    $("p").each(function () {
        console.log("hi")
        $('p').each(function() {
            let $this = $(this);
            $this.html($this.text().replace(/\b(\w+)\b/g, "<hover>$1</hover>"));
        });

    });

    // bind to each hover
    $('hover').hover(
        function() { $('#word').text($(this).css({"background-color":"#b4b4b4", "transition-delay":".5s"}).text()); },
        function() { $('#word').text(''); $(this).css('background-color',''); }
    );
}