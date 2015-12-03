$(document).ready(function() {
    $('#submit-button').on('click', function () {
        console.warn("Submit!");
    });

    // hide the error if its visible when the modal opens
    $('#new-auction').on('shown.bs.modal', function () {
        $('#new-auction-error').hide();
    });

    // submit the new auction form and redirect if successful
    $('#new-auction-form').on('submit', function (e) {
        e.preventDefault();

        $.post('/auction/new', $(this).serialize(), function (data) {
            if (data.success) {
                window.location.href = '/auction/' + data.id + '?post=true';
            } else {
                $('#new-auction-error').fadeIn();
            }
        });
    });

    $('#bid-auction').on('submit', function (e) {
        e.preventDefault();

        $.post('/auction/bid/' + auctionID, $(this).serialize(), function (data) {
            if (data.success) {
                $('#new-bid-alert').fadeIn();
                setTimeout(function() {
                    location.reload();
                }, 500);
            } else {
                console.log("FAIL");
            }
        });
    });

    $('#bid-sold').on('submit', function (e) {
        e.preventDefault();

        $.post('/auction/bid/' + auctionID, $(this).serialize(), function (data) {
            if (data.success) {
                $('#new-bid-alert').fadeIn();
                setTimeout(function() {
                    location.reload();
                }, 500);
            } else {
                console.log("FAIL");
            }
        });
    });

    $('#user-auctions').on('click', '.auction-row', function () {
        window.location = '/auction/' + $(this).attr('data-id');
    })

    $('#EditTable tr').click(function() {
        return false;
    }).dblclick(function() {
        $(this).attr('data-id');
        console.log($(this).attr('data-id'));
        window.location = "http://localhost:4000/customer/newC/adding/" + $(this).attr('data-id');
    });



});

function loadBestSellers(id) {
    $.ajax({
        url: '/users/' + id + '/best/',
        context: document.body
    }).done(function (data) {
        var table = $('#best-sellers');
        $.each(data, function (index, item) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(item.ItemID))
                    .append($('<td>').html(item.Name))
                    .append($('<td>').html(item.Description))
                    .append($('<td>').html(item.Type))
                    .append($('<td>').html(item.NumberSold))
            );
        });

        table.next('.loader').fadeOut();
    });
}

function loadUserAuctions(id) {
    $.ajax({
        url: '/users/' + id + '/auctions/',
        context: document.body
    }).done(function (data) {
        var table = $('#user-auctions');
        $.each(data, function (index, auction) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(auction.AuctionID))
                    .append($('<td>').html(auction.BidIncrement))
                    .append($('<td>').html(auction.MinimumBid))
                    .append($('<td>').html(auction.CopiesSold))
                    .append($('<td>').html(auction.Monitor))
                    .append($('<td>').html(auction.ItemID))
                    .append($('<td>').html(auction.BuyerID))
                    .append($('<td>').html(auction.SellerID))
                    .append($('<td>').html(auction.Name))
                    .append($('<td>').html(auction.Description))
                    .append($('<td>').html(auction.Type))
                    .attr('data-id', auction.AuctionID)
                    .addClass('auction-row')
            );
        });

        table.next('.loader').fadeOut();
    });
}

function loadUserAuctionItems(id) {
    $.ajax({
        url: '/users/' + id + '/auctions/items/',
        context: document.body
    }).done(function (data) {
        var table = $('#user-auction-items');
        $.each(data, function (index, item) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(item.ItemID))
                    .append($('<td>').html(item.Name))
                    .append($('<td>').html(item.Description))
                    .append($('<td>').html(item.Type))
                    .append($('<td>').html(item.NumCopies))
                    .append($('<td>').html(item.AuctionID))
                    .append($('<td>').html(item.BidIncrement))
                    .append($('<td>').html(item.MinimumBid))
                    .append($('<td>').html(item.Monitor))
            );
        });

        table.next('.loader').fadeOut();
    });

}

function loadUserItems(id) {
    $.ajax({
        url: '/users/' + id + '/items/',
        context: document.body
    }).done(function (data) {
        var table = $('#user-items');
        $.each(data, function (index, item) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(item.ItemID))
                    .append($('<td>').html(item.Name))
                    .append($('<td>').html(item.Description))
                    .append($('<td>').html(item.Type))
                    .append($('<td>').html(item.NumCopies))
                    .append($('<td>').html(item.AuctionID))
                    .append($('<td>').html(item.BidIncrement))
                    .append($('<td>').html(item.MinimumBid))
                    .append($('<td>').html(item.Monitor))
            );
        });

        table.next('.loader').fadeOut();
    });
}

function loadItemSuggestions(id) {
    $.ajax({
        url: '/users/' + id + '/suggest/',
        context: document.body
    }).done(function (data) {
        var table = $('#user-suggestions');
        $.each(data, function (index, item) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(item.ItemID))
                    .append($('<td>').html(item.Name))
                    .append($('<td>').html(item.Description))
                    .append($('<td>').html(item.Type))
            );
        });

        table.next('.loader').fadeOut();
    });
}

function loadUserTables(id) {
    loadBestSellers(id);
    loadUserAuctions(id);
    loadUserAuctionItems(id);
    loadUserItems(id);
    loadItemSuggestions(id);
}