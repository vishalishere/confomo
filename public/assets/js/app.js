var Item = function(item) {
    for (var prop in item) {
        this[prop] = item[prop];
    }
    this.met = ko.observable(item.met);
    this.type = ko.observable(item.type);
    this.notes = ko.observable(item.notes);

    this.markThisItemMet = function() {
        item.met = item.met == 1 ? 0 : 1;
        $.ajax({
            url: '/friends/' + item.id,
            type: 'PUT',
            data: item,
            context: this,
            success: function(result) {
                this.met(item.met);
            }
        });
    };

    this.approveSuggested = function() {
        var new_type = item.type.replace(/_suggested/g, '');
        item.type = new_type;

        $.ajax({
            url: '/friends/' + item.id,
            type: 'PUT',
            data: item,
            context: this,
            success: function(result) {
                this.type(new_type);
            }
        });
    };

    this.addNotesPopup = function(targ, e) {
        var $target = $(e.target);
        $target.closest('li').find('.add-notes-popover').toggle();
    };

    this.hideNotesPopup = function(targ, e) {
        var $target= $(e.target);
        $target.closest('li').find('.add-notes-popover').toggle();
    };

    this.addNotes = function(form) {
        item.notes = this.notes();
        console.log(item);
        $.ajax({
            url: '/friends/' + item.id,
            type: 'PUT',
            data: item,
            context: this,
            success: function(result) {
                $(form).closest('.add-notes-popover').toggle();
            }
        });
    };
};

var itemModel = function(items) {
    var in_items = [];
    for (var item in items) {
        in_items.push(new Item(items[item]));
    }

    this.items = ko.observableArray(in_items);
    this.itemToAdd = ko.observable("");
    this.addItem = function(target) {
        var type = $(target).closest('div').attr('data-type'),
            met = type == 'new' ? '1' : '0';

        if (this.itemToAdd() != "") {
            var data = {
                    'twitter': this.itemToAdd(),
                    'type': type,
                    'met': met
                };

            $.ajax({
                url: '/friends',
                type: 'POST',
                data: data,
                context: this,
                success: function(returnedData) {
                    this.items.push(new Item(returnedData));
                    this.itemToAdd("");
                }
            });
        }
    }.bind(this);

    this.remove = function (item) {
        $.ajax({
            url: '/friends/' + item.id,
            type: 'DELETE',
            context: this,
            success: function(result) {
                this.items.remove(item);
            }
        });
    }.bind(this);
};

if ($('#old-friends').length && $('#new-friends').length) {
    $.getJSON("/friends", function(data) {
        // @todo sort to put suggested first
        oldFriends = ko.utils.arrayFilter(data, function(item) {
            return item.type.indexOf('old') > -1;
        });
        newFriends = ko.utils.arrayFilter(data, function(item) {
            return item.type.indexOf('new') > -1;
        });

        ko.applyBindings(new itemModel(oldFriends), document.getElementById('old-friends'));
        ko.applyBindings(new itemModel(newFriends), document.getElementById('new-friends'));
    });
}