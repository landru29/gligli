const { readdirSync, readFileSync } = require('fs')

const getDirectories = source => {
  const table = readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .filter(dirent => dirent.name.match(new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\.json$/i)))
    .map(dirent => `${source}/${dirent.name}`)
    .map(filename => readFileSync(filename).toString())
    .map(data => {
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    })
    .reduce((prevArray, currentArray)=> [...prevArray, ...currentArray], [])
    .reduce((prev, current) => {
        prev[current.id] = current;
        return prev;
    }, {});

    return Object.keys(table).map(k => table[k]);
};

console.log(
    JSON.stringify(
        getDirectories(process.argv[process.argv.length-1]),
    )
);
