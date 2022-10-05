const fs = require('fs');
const path = require('path');

const mixTapesPath = path.join(__dirname, '/mixTapesData.json');

module.exports = {
    getMixTapes: async () => {
        return JSON.parse(fs.readFileSync(mixTapesPath).toString());
    },
    alterMixTapes: async (updatedMixTapes) => {
        fs.writeFileSync(mixTapesPath, JSON.stringify(updatedMixTapes, null, 2))
    },
}

