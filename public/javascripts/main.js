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
            auction: auctionID,
            reserve: $(this).data('reserve')
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
                $.notify({
                    message: 'Sorry, not a valid bid!'
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


    //adding employee
    $('#employee-list').on('click', '.plus', function(){
        $('#add-employee').modal('show');


    });

    //adding new employee
    $('#addEmployee').on('submit', function(e){
        e.preventDefault();
        $.post('/manager/employee/', $(this).serialize(), function (data) {
            if (data.success) {
                console.log("SUCCESS");
                location.reload();

            } else {req
                console.log("FAIL");
            }
        });

    });

    //deleting employee
    $('#employee-list').on('click', '.minus', function(){
        var row = $(this).parent().parent();
        $.post('/manager/employee/' + row.attr('data-id'), $(this).serialize(), function (data) {
            if (data.success) {
                console.log("SUCCESS");
                row.remove();

            } else {
                console.log("FAIL");
                alert("Employee is being used");
            }
        });
    });

    //edit employee
    $('#employee-list').on('click', '.edit', function(){
        $('#edit-employee').modal('show');
        var row = $(this).parent().parent();
        console.log(row.attr('data-id'));
        $.ajax('/manager/employee/get/' + row.attr('data-id')).done( function (data) {
            //console.log(customer);
            $('#start-date2').val(data.employee.StartDate);
            $('#hourly-rate2').val(data.employee.HourlyRate);
            $('#employee-level2').val(data.employee.Level);
            $('#employee-id2').val(data.employee.EmployeeID);
        });
    });


    $('#edit-employee-form').submit(function(e) {
        e.preventDefault();

        $.post('/manager/employee/edit/', $(this).serialize(), function() {
            location.reload();
        });
    })

    //adding customer
    $('#customer-list').on('click', '.plus', function(){
        $('#add-customer').modal('show');


    });

    //adding new customer
    $('#addCustomer').on('submit', function(e){
        e.preventDefault();
        $.post('/customer', $(this).serialize(), function (data) {
            if (data.success) {
                console.log("SUCCESS");

            } else {
                console.log("FAIL");
            }
        });

    });

    //edit customer
    $('#customer-list').on('click', '.edit', function(){
        var row = $(this).parent().parent();
        console.log(row.attr('data-id'));
        $('#edit-customer').modal('show');
        $.ajax('/customer/get/' + row.attr('data-id')).done( function (data) {
            //console.log(customer);
            $('#card-number2').val(data.customer.creditcardnum);
            $('#customer-rating2').val(data.customer.Rating);
            $('#customer-id2').val(row.attr('data-id'));
        });
    });

    $('#edit-customer-form').submit(function (e) {
        e.preventDefault();

        $.post('/customer/edit2/', $(this).serialize(), function() {
            $('#edit-customer').modal('show');
            location.reload();
        });
    });

    //delete customer
    $('#customer-list').on('click', '.minus', function(){
        var row = $(this).parent().parent();
       // alert("delete");
        $.post('/customer/' + row.attr('data-id'), $(this).serialize(), function (data) {
            if (data.success) {
                console.log("SUCCESS");
                row.remove();
            } else {
                console.log("FAIL");
                alert("Customer is being used");
            }
        });
    });

});

function loadCustomerTables(){

    $.ajax({
        url: '/customer/get',
        context: document.body
    }).done(function (data) {
        var table = $('#customer-list');

        $.each(data, function (index, customer) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(customer.SSN))
                    .append($('<td>').html(customer.FirstName))
                    .append($('<td>').html(customer.LastName))
                    .append($('<td>').html(customer.Address))
                    .append($('<td>').html(customer.ZipCode))
                    .append($('<td>').html(customer.telephone))
                    .append($('<td>').html(customer.email))
                    .append($('<td>').html("<span class = 'minus'> <i class='fa fa-minus'></i></span>"))
                    .append($('<td>').html("<span class = 'edit'> <i class='fa fa-pencil'></i></span>"))
                    .attr('data-id', customer.SSN)
                    .addClass("customer-row")

            );
        });

        table.next('.loader').fadeOut();
    });

}


function loadNewCustomerTable(){

    $.ajax({
        url: '/customer/new',
        context: document.body
    }).done(function (data) {
        var table = $('#newCustomer-list');
        $.each(data, function (index, customer) {
            if(!customer.Level && !customer.creditcardnum) {
                table.append(
                    $('<tr>')
                        .append($('<td>').html(customer.SSN))
                        .append($('<td>').html(customer.FirstName))
                        .append($('<td>').html(customer.LastName))
                        .append($('<td>').html(customer.Address))
                        .append($('<td>').html(customer.ZipCode))
                        .append($('<td>').html(customer.telephone))
                        .append($('<td>').html(customer.email))
                );
            }
        });

        table.next('.loader').fadeOut();
    });

}

function loadNewEmployeeTable(){

    $.ajax({
        url: '/manager/employee/new',
        context: document.body
    }).done(function (data) {
        var table = $('#newEmployee-list');
        $.each(data, function (index, employee) {
            if(!employee.Level && !employee.creditcardnum) {
                table.append(
                    $('<tr>')
                        .append($('<td>').html(employee.SSN))
                        .append($('<td>').html(employee.FirstName))
                        .append($('<td>').html(employee.LastName))
                        .append($('<td>').html(employee.Address))
                        .append($('<td>').html(employee.ZipCode))
                        .append($('<td>').html(employee.telephone))
                        .append($('<td>').html(employee.email))
                );
            }
        });

        table.next('.loader').fadeOut();
    });

}


function  loadEmployeeTables(){
    $.ajax({
        url: '/manager/employee/get',
        context: document.body
    }).done(function (data) {
        var table = $('#employee-list');
        $.each(data, function (index, employee) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(employee.EmployeeID))
                    .append($('<td>').html(employee.FirstName))
                    .append($('<td>').html(employee.LastName))
                    .append($('<td>').html(employee.StartDate))
                    .append($('<td>').html(employee.HourlyRate))
                    .append($('<td>').html(employee.Level))
                    .append($('<td>').html("<span class = 'minus'> <i class='fa fa-minus'></i></span>"))
                    .append($('<td>').html("<span class = 'edit'> <i class='fa fa-pencil'></i></span>"))
                    .attr('data-id', employee.EmployeeID)
                    .addClass("employee-row")

            );
        });

        table.next('.loader').fadeOut();
    });

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

/////////////////////////////////////////////////////*********************************

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

function loadManagerSales(search) {
    $.ajax({
        url: '/manager/sales/customer/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#customer-sales-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.ItemName))
                    .append($('<td>').html(sales.Type))
                    .append($('<td>').html('$' + sales.Price))
                    .append($('<td>').html(sales.Date))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/sales/revenue/customer/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#customer-revenue-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.CustomerName))
                    .append($('<td>').html(sales.Revenue))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/sales/item/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#item-sales-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.Name))
                    .append($('<td>').html(sales.Type))
                    .append($('<td>').html('$' + sales.Price))
                    .append($('<td>').html(sales.Date))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/sales/revenue/item/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#item-revenue-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.Name))
                    .append($('<td>').html(sales.Type))
                    .append($('<td>').html(sales.Revenue))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/sales/type/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#type-sales-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.Name))
                    .append($('<td>').html(sales.Type))
                    .append($('<td>').html('$' + sales.Price))
                    .append($('<td>').html(sales.Date))
            );
        });

        table.next('.loader').fadeOut();
    });

    $.ajax({
        url: '/manager/sales/revenue/type/' + search,
        context: document.body
    }).done(function (data) {
        var table = $('#type-revenue-table');
        $.each(data, function (index, sales) {

            table.append(
                $('<tr>')
                    .append($('<td>').html(sales.Name))
                    .append($('<td>').html(sales.Type))
                    .append($('<td>').html(sales.Revenue))
            );
        });

        table.next('.loader').fadeOut();
    });
}