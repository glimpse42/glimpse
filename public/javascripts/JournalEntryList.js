'use strict';

function JournalEntryList(elementId, entries) {


    // The element Id containing the list
    this.elementId = elementId;

    // The list of journal entries
    this.entries = entries;

    this.resultSet = entries;

    // Display the entry list in its current state
    this.display = () => {

        let container = document.getElementById(this.elementId);

        // Clear the container before displaying
        container.innerHTML = "";

        // Create and append all elements
        this.resultSet.forEach((entry) => {

            let d = document.createElement('div');
            d.classList.add('search-result-container');

            let about = document.createElement('div');
            about.classList.add('search-result-text');
            about.textContent = entry.journalEntry;

            let timestamp = document.createElement('div');
            timestamp.classList.add('search-result-info');
            timestamp.textContent = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss');

            // Assemble the element
            d.append(about);
            d.append(timestamp);

            // Add element to page
            container.append(d);
        });
    };


    // Search the results
    this.search = (formData) => {

        console.log(formData);

        // Start with the full entry list
        this.resultSet = this.entries.slice();

        // Filter for each form field
        formData.forEach((field) => {

            if (field['name'] === 'search-text') {
                this.resultSet = this.resultSet.filter((entry) => {
                    return entry.journalEntry.toLowerCase().includes(field['value'].trim().toLowerCase());
                })
            } else if (field['name'] === 'near-me') {
                // Options for the GeoLocation lookup
                let options = {
                    "maximumAge": 10 * 1000
                };

                // Callback when user position is obtained
                let geoSuccess = (position) => {

                    const currPos = [
                        position.coords.longitude,
                        position.coords.latitude
                    ];

                    this.resultSet = this.resultSet.filter(function (elem) {

                        const d = distance(currPos[0], currPos[1], elem.pos.coordinates[0], elem.pos.coordinates[1]);

                        console.log(d);

                        return d < 30;
                    });

                    this.display();
                };

                // Callback when user position cannot be obtained
                let geoFailure = (error) => {

                    console.log("Failed to acquire user position");
                };

                // Get the user's location at time of submission
                navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure, options);
            } else if (field['name'] === 'team-skill-search-input') {

            }

        });

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
            return elem.journalEntry.toLowerCase().includes(searchTerm);
        });
    };

    const toRad = (n) => {
        return n * Math.PI / 180;
    };

    const distance = (lon1, lat1, lon2, lat2) => {
        let R = 6371; // Radius of the earth in km
        let dLat = toRad(lat2 - lat1);  // Javascript functions in radians
        let dLon = toRad(lon2 - lon1);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d * 1000; // Distance in m
    };

    // Find all entries near the given coordinates
    this.filterNear = function (radius) {

        // Options for the GeoLocation lookup
        let options = {
            "maximumAge": 10 * 1000
        };

        // Callback when user position is obtained
        let geoSuccess = (position) => {

            const currPos = [
                position.coords.longitude,
                position.coords.latitude
            ];

            this.resultSet = this.entries.filter(function (elem) {

                const d = distance(currPos[0], currPos[1], elem.pos.coordinates[0], elem.pos.coordinates[1]);

                console.log(d);

                return d < radius;
            });

            this.display();
        };

        // Callback when user position cannot be obtained
        function geoFailure(error) {

            console.log("Failed to acquire user position");
        }

        // Get the user's location at time of submission
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure, options);

    };

}