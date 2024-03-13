const fs = require('fs');

// Function to read input files
function readInputFiles() {
    try {
        const destinationsData = fs.readFileSync('StreetAddresses.txt', 'utf-8');
        const driversData = fs.readFileSync('DriverNames.txt', 'utf-8');
        return [destinationsData, driversData];
    } catch (error) {
        console.error('Error reading input files:', error);
        return ['', '']; // Return empty strings in case of error
    }
}

// Function to parse input data and calculate suitability score
function assignShipments(destinations, drivers) {
    let totalSS = 0;
    const matches = new Map();

    // Placeholder logic: Assign each destination to the first available driver
    destinations.forEach(shipment => {
        for (const driver of drivers) {
            if (!matches.has(driver.name)) {
                matches.set(driver.name, shipment.destination);
                totalSS += calculateSuitability(shipment, driver);
                break;
            }
        }
    });

    return [totalSS, matches];
}



// Function to calculate suitability score based on shipment and driver
function calculateSuitability(shipment, driver) {
    let baseSS;
    if (shipment.streetNameLength % 2 === 0) {
        const vowels = countVowels(driver.name.toLowerCase());
        baseSS = vowels * 1.5;
    } else {
        const consonants = countConsonants(driver.name.toLowerCase());
        baseSS = consonants * 1;
    }

    let SS = baseSS;

    // Check if shipment's streetNameLength shares common factors with driver's length
    if (gcd(shipment.streetNameLength, driver.length) !== 1) {
        SS *= 1.5;
    }

    return SS;
}

// Function to count vowels in a string
function countVowels(str) {
    return str.match(/[aeiou]/g)?.length || 0;
}

// Function to count consonants in a string
function countConsonants(str) {
    return str.match(/[bcdfghjklmnpqrstvwxyz]/g)?.length || 0;
}

// Function to find greatest common divisor (gcd)
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}




// Main function
function main() {
    const [destinationsData, driversData] = readInputFiles();

    // Parse input data
    const destinations = destinationsData.split('\n').map(line => {
        const parts = line.trim().split(',');
        return { destination: parts[0], streetNameLength: parts[1].trim().length };
    });

    const drivers = driversData.split('\n').map(name => {
        return { name: name.trim(), length: name.trim().length };
    });

    // Call assignShipments function with parsed data
    const [totalSS, matches] = assignShipments(destinations, drivers);

    // Output results
    console.log("Total Suitability Score:", totalSS);
    console.log("Matching:");
    matches.forEach((destination, driver) => console.log(`${destination} -> ${driver}`));
}

// Run the main function
main();
