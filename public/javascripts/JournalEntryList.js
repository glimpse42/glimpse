'use strict';

function JournalEntryList(elementId, entries) {


    // The element Id containing the list
    this.elementId = elementId;

    // The list of journal entries
    this.entries = entries;

    this.resultSet = entries;

    // Display the entry list in its current state
    this.display = function () {

        let entryHtml = this.resultSet.map((entry) => {

            let text = '<div class="journal-entry-text partial-border center-text-content">' + '<p>' + entry.text + '</p>';

            let date = '<div class="journal-entry-info">' + moment(entry.timestamp).format('YYYY-MM-DD HH:mm') + '</div>' + '</div>';

            return text + date;
        });

        document.getElementById(this.elementId).innerHTML = entryHtml.join("");
    };

    //
    this.sort = function (oldestFirst = false) {

        const factor = (oldestFirst === true) ? -1 : 1;

        this.resultSet.sort((a, b) => {

            return factor * Math.sign(b.timestamp - a.timestamp);
        });
    };

    // Find all entries containing a search term
    this.filter = function (rawSearchTerm) {

        // Ignore case when searching
        const searchTerm = rawSearchTerm.toLowerCase();

        this.resultSet = this.entries.filter(function (elem) {
            return elem.text.includes(searchTerm);
        });
    };

    // Find all entries near the given coordinates
    this.near = function (coords, radius) {

        this.resultSet = this.entries.filter(function (elem) {

            // TODO: call haversine function
            return 0;
        });

    };

}