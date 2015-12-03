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

    $('#bid-sold').on('click', function () {

        var buyer = $(this).data('buyer');
        var price = $(this).data('price');

        $.post('/auction/sell/', {
            buyer: buyer,
            seller: $(this).data('seller'),
            price: price,
            item: $(this).data('item'),
            auction: auctionID
        }, function (data) {
            if (data.success) {
                $.notify({
                    message: 'Item SOLD to buyer ' + buyer + ' for $' + price + '!'
                },{
                    type: 'success',
                    newest_on_top: true,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });

            } else {
                $.notify({
                    message: 'Error selling item. Is it already sold?'
                },{
                    type: 'danger',
                    newest_on_top: true,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });
            }
        });
    });

    $('#bid-auction').on('submit', function (e) {
        e.preventDefault();

        $.post('/auction/bid/' + auctionID, $(this).serialize(), function (data) {
            if (data.success) {
                $.notify({
                    message: 'You have successfully placed a bid! Good luck!'
                },{
                    type: 'success',
                    newest_on_top: true,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });

                setTimeout(function () {
                    location.reload();
                }, 800);
            } else {
                console.log("FAIL");
            }
        });
    });

    $('#user-auctions').on('click', '.auction-row', function () {
        window.location = '/auction/' + $(this).attr('data-id');
    })

    //this opens a link to add new customer info
    $('#EditTable tr').click(function() {
        return false;
    }).dblclick(function() {
        $(this).attr('data-id');
        console.log($(this).attr('data-id'));
        window.location = "http://localhost:4000/customer/newC/adding/" + $(this).attr('data-id');
    });

    //this opens a link to edit customer
    $('#EditCustomerTable tr').click(function() {
        return false;
    }).dblclick(function() {
        $(this).attr('data-id');
        console.log($(this).attr('data-id'));
        window.location = "http://localhost:4000/customer/editC/" + $(this).attr('data-id');
    });


});

function deleteRow(i, id){

    $.post('/customer/' + id, $(this).serialize(), function (data) {
        if (data.success) {
            document.getElementById('EditCustomerTable').deleteRow(i);
        } else {
            console.log("FAIL");
        }
    });


}

function loadCustomers(id){

}

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

function loadUserTables(id) {
    loadBestSellers(id);
    loadUserAuctions(id);
    loadUserAuctionItems(id);
    loadUserItems(id);
    loadItemSuggestions(id);
    loadCustomers(id);
}

function searchByName(name) {
    $.ajax({
        url: '/search/' + name + '/name/',
        context: document.body
    }).done(function (data) {
        var table = $('#search-name');
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

function searchByType(type) {
    $.ajax({
        url: '/search/' + type + '/type/',
        context: document.body
    }).done(function (data) {
        var table = $('#search-type');
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

function loadSearchTables(keyword) {
    searchByName(keyword);
    searchByType(keyword);
}

function managerBest() {
    $.ajax({
        url: '/manager/best/',
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

function managerRevenue() {
    $.ajax({
        url: '/manager/revenue/best/reps',
        context: document.body
    }).done(function (data) {
        var table = $('#best-customer-reps');
        $.each(data, function (index, person) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(person.SSN))
                    .append($('<td>').html(person.FirstName))
                    .append($('<td>').html(person.LastName))
                    .append($('<td>').html('$' + person.TotalRevenue))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/revenue/best/customers',
        context: document.body
    }).done(function (data) {
        var table = $('#best-customers');
        $.each(data, function (index, person) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(person.SSN))
                    .append($('<td>').html(person.FirstName))
                    .append($('<td>').html(person.LastName))
                    .append($('<td>').html('$' + person.TotalRevenue))
            );
        });

        table.next('.loader').fadeOut();
    });
}

function loadManagerTables() {
    managerBest();
    managerRevenue();
}