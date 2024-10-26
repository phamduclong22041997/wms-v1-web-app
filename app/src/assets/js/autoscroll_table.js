

var my_time;
function pageScroll(height, speed = 1) {
    let objDiv = document.getElementById("contain-table");
    if (objDiv.scrollTop === 0) objDiv.scrollTop = speed;
    objDiv.scrollTop = Math.ceil(objDiv.scrollTop + speed);
    let _stop = Math.ceil(objDiv.scrollTop + height);
    if (_stop === objDiv.scrollHeight) {
        objDiv.scrollTop = 0;
    } else {
    }
    my_time = setTimeout(`pageScroll(${height})`,25);

}

function getWidthHeader(id_header, id_scroll) {
    var colCount = 0;
    $('#' + id_scroll + ' tr:nth-child(1) td').each(function (e) {
        if ($(this).attr('colspan')) {
            colCount += +$(this).attr('colspan');
        } else {
            colCount++;
        }
    });
    for (var i = 1; i <= colCount; i++) {
        var th_width = $('#' + id_scroll + ' > tbody > tr:first-child > td:nth-child(' + i + ')').width();
        $('#' + id_header + ' > thead th:nth-child(' + i + ')').css('width', th_width + 'px');
    }
}

function autoScrollTable(height) {
    pageScroll(height);
    $("#contain-table").mouseover(function () {
        clearTimeout(my_time);
    }).mouseout(function () {
        pageScroll(height);
    });

    getWidthHeader('table_fixed', 'table_scroll');
}
