document.addEventListener('DOMContentLoaded', () => {

    // --- listen to startBtn so that ppl can get in to map ---
    const startBtn = document.getElementById('start-btn');
    const modal = document.getElementById('welcome-modal');

    startBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 400);
    });

    // --- drop the data in ---
    const rawData = [
        {lng: -73.98419, lat: 40.71532, address: "18 Pitt Street", year: 1890, direct: "n"},
        {lng: -73.98325, lat: 40.71885, address: "113 Ridge Street", year: 1890, direct: "n"},

        {lng: -73.9828, lat: 40.71972, address: "229 Stanton Street", year: 1900, direct: "y"},
        {lng: -73.98476, lat: 40.7178, address: "51 Attorney St", year: 1900, direct: "y"},

        {lng: -73.98621, lat: 40.72065, address: "171 Norfolk St", year: 1910, direct: "n"},
        {lng: -73.99013, lat: 40.72174, address: "212 Eldridge St", year: 1910, direct: "n"},
        {lng: -73.98143, lat: 40.71686, address: "86 Sheriff St", year: 1910, direct: "y"},
        {lng: -74.00389, lat: 40.72108, address: "357 Canal Street", year: 1910, direct: "n"},

        {lng: -73.9779, lat: 40.72764, address: "626 E 12th St", year: 1920, direct: "y"},
        {lng: -73.98033, lat: 40.72628, address: "189 Avenue B", year: 1920, direct: "y"},
        {lng: -73.98311, lat: 40.71538, address: "6 Willett St", year: 1920, direct: "y"},

        {lng: -73.9253, lat: 40.66998, address: "261 Buffalo Avenue", year: 1930, direct: "y"},
        {lng: -73.94267, lat: 40.70559, address: "124 Graham Avenue", year: 1930, direct: "n"},
        {lng: -73.94686, lat: 40.79161, address: "104 East 105th Street", year: 1930, direct: "n"},

        {lng: -73.96032, lat: 40.70557, address: "166 Ross Street", year: 1940, direct: "n"},
        {lng: -73.87279, lat: 40.75233, address: "35-35 95th Street", year: 1940, direct: "y"},
        {lng: -73.98252, lat: 40.72328, address: "57 Avenue B", year: 1940, direct: "y"},

        {lng: -73.87334, lat: 40.75264, address: "35-05 94th Street", year: 1950, direct: "y"},
        {lng: -73.9974, lat: 40.61124, address: "1814 78th Street", year: 1950, direct: "n"},

        {lng: -73.97815, lat: 40.71292, address: "453 FDR Drive", year: 1960, direct: "y"},

        {lng: -73.94713, lat: 40.72479, address: "68A Newel St", year: 1970, direct: "n"},
        {lng: -73.94857, lat: 40.6855, address: "264 Monroe Street", year: 1970, direct: "n"},
        {lng:-73.98991, lat: 40.74150, address: "186 5th Ave", year: 1970, direct: "y"},  // 

        {lng: -73.95806, lat: 40.67462, address: "601 Park Pl", year: 1980, direct: "y"},
        {lng: -73.96665, lat: 40.68619, address: "386 Waverly Avenue", year: 1980, direct: "n"},

        {lng: -73.89203, lat: 40.88416, address: "3980 Orloff Ave", year: 1990, direct: "n"},
        {lng: -73.97256, lat: 40.74842, address: "305 E 40th", year: 1990, direct: "y"}, 

        {lng: -73.97653, lat: 40.74004, address: "jittered for privacy", year: 2000, direct: "y"}, // w

        {lng: -73.98868, lat: 40.74540, address: "jittered for privacy", year: 2010, direct: "n"}, // i
        {lng: -73.95065, lat: 40.67575, address: "jittered for privacy", year: 2010, direct: "y"}, // ch
        {lng: -73.95272, lat: 40.77394, address: "jittered for privacy", year: 2010, direct: "n"},  // h
        {lng: -73.94522, lat: 40.77741, address: "jittered for privacy", year: 2010, direct: "n"}  // h2
    ];

const decadeColors = {
        1890: '#00184a', // dark blue
        1900: '#30237d',
        1910: '#6129a3', 
        1920: '#9227ba', // purple
        1930: '#c020c0', 
        1940: '#e31cba',
        1950: '#fa1da8', // hot pink
        1960: '#ff2a91', 
        1970: '#ff3d7b', 
        1980: '#ff5266', 
        1990: '#f96754', // orange/coral
        2000: '#ed7c45', 
        2010: '#df9039'  // bronze/yellow
    };

const geojson = {
        type: 'FeatureCollection',
        features: rawData.map(loc => {
            const decade = Math.floor(loc.year / 10) * 10;
            
            // add a jitter to prevent perfect overlaps. implementing randomly
            // is kinda dumb, and 0.0005 degrees is about 100 meters which... idk
            const jitterLng = (Math.random() - 0.5) * 0.001;
            const jitterLat = (Math.random() - 0.5) * 0.001;

            return {
                type: 'Feature',
                geometry: { 
                    type: 'Point', 
                    coordinates: [loc.lng + jitterLng, loc.lat + jitterLat]  // actual jitter
                },
                properties: {
                    address: loc.address,
                    year: loc.year,
                    decade: decade,
                    direct: loc.direct,
                    color: decadeColors[decade] || '#888'
                }
            };
        })
    };

    // --- legend ---
    const legendDiv = document.getElementById('legend');
    Object.keys(decadeColors).forEach(decade => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        let label = `19${decade.substring(2)}s`;
        if(decade === "1890") label = "1890s";
        if(decade === "2000") label = "2000s";
        if(decade === "2010") label = "2010s";
        item.innerHTML = `<div class="legend-color" style="background:${decadeColors[decade]}"></div> ${label}`;
        legendDiv.appendChild(item);
    });

    // --- add the map ---
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1kMTEyIiwiYSI6ImNtbnhxNHVsbjA0dDUycHExZWRqN2dtaWEifQ.RchV-MZSTqwC8fMtMIy_Xg'; 
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.00397, 40.77669],
        zoom: 10.2
    });

    // --- when it loads, add the locations of family data and show as point ---
    map.on('load', () => {
        map.addSource('family-data', {
            type: 'geojson',
            data: geojson
        });

        map.addLayer({
            id: 'family-points',
            type: 'circle',
            source: 'family-data',
            paint: {
                'circle-color': ['get', 'color'],
                'circle-radius': 6,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
            }
        });

        // ---------------------------------------------------------------------------
        // interactivity 
        // ---------------------------------------------------------------------------

        // make the cursor look like a pointer when you're hovering so they know to click
        map.on('mouseenter', 'family-points', () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', 'family-points', () => map.getCanvas().style.cursor = '');

        // build html popup so it can be formatted cute
        map.on('click', 'family-points', (e) => {
            const coords = e.features[0].geometry.coordinates.slice();
            const props = e.features[0].properties;
            const lineageText = props.direct === 'y' ? "Direct Lineage" : "Extended Family";

            const html = `
                <div>
                    <div class="popup-year">
                        <span class="popup-decade-badge" style="background:${props.color}"></span>
                        ${props.year}
                    </div>
                    <div class="popup-address">${props.address}</div>
                    <div class="popup-lineage">${lineageText}</div>
                </div>
            `;

        	// actually put in the popup
            new mapboxgl.Popup().setLngLat(coords).setHTML(html).addTo(map);
        });

        // ---------------------------------------------------------------------------
        // implement filters in header
        // ---------------------------------------------------------------------------
        const buttons = document.querySelectorAll('.filter-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const filterType = e.target.getAttribute('data-filter');
                
                // implement the right kind of filter of the data based on which button
                if (filterType === 'all') {
                    map.setFilter('family-points', null);
                } else if (filterType === 'direct') {
                    map.setFilter('family-points', ['==', ['get', 'direct'], 'y']);
                } else if (filterType === 'extended') {
                    map.setFilter('family-points', ['==', ['get', 'direct'], 'n']);
                } else if (filterType === 'early') {
                    map.setFilter('family-points', ['<', ['get', 'year'], 1950]);
                } else if (filterType === 'late') {
                    map.setFilter('family-points', ['>=', ['get', 'year'], 1950]);
                }
            });
        });
    });
});