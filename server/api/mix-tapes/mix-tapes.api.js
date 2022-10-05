const {
    getMixTapes,
    alterMixTapes,
} = require('../../db/db-utils');
const { v4 } = require('uuid');

const findExistingSong = (mixTapes, {
    key,
    value,
}) => mixTapes.find(song => song[key] === value);

const getMixTapesByQuery = (mixTapes, query) => {
    let data, pageData;
    const filteredMixTapes = [];
    const filteredIds = {}

    const queryParams = Object.entries(query).reduce((acc, [key, value]) => {
        if (key !== 'pageSize' && key !== 'page') {
            acc.push({
                key,
                value,
            })
        }

        return acc
    }, []);

    if (queryParams.length) {
        queryParams.forEach(({
                                 key,
                                 value,
                             }) => {
            for (let songIdx = 0; songIdx < mixTapes.length; songIdx++) {
                const song = mixTapes[songIdx];

                if (key === 'tag') {
                    if (Array.isArray(value)) {
                        let hasTag = false;

                        for (let tagIdx = 0; tagIdx < value.length; tagIdx++) {
                            if (song[key].some(songTag => songTag.toLowerCase() === value[tagIdx].toLowerCase())) {
                                hasTag = true;

                                break;
                            }
                        }

                        if (hasTag && !filteredIds[song.id]) {
                            filteredMixTapes.push(song)
                            filteredIds[song.id] = song.id
                        }
                    } else if (song[key].some(songTag => songTag.toLowerCase() === value.toLowerCase()) && !filteredIds[song.id]) {
                        filteredMixTapes.push(song);
                        filteredIds[song.id] = song.id
                    }

                    continue;
                }


                if (song[key].toLowerCase() === value.toLowerCase() && !filteredIds[song.id]) {
                    filteredMixTapes.push(song)
                    filteredIds[song.id] = song.id
                }
            }
        })

        data = filteredMixTapes;
    } else {
        data = mixTapes;
    }

    let hasPagination = false;
    if (query.pageSize !== undefined && query.page !== undefined) {
        hasPagination = true;

        const startingIndex = +query.pageSize * (+query.page - 1);
        const endIndex = startingIndex + (+query.pageSize);
        pageData = data.slice(startingIndex, endIndex)
    }

    return {
        mixTapes: {
            pageData,
            data,
        },
        pagination: hasPagination
            ? {
                totalPages: Math.ceil(data.length / query.pageSize),
                currentPage: query.page,
                songPerPage: query.pageSize,
            }
            : false,
    };
}


module.exports = {
    getAll: async (req, res, next) => {
        try {
            const mixTapes = await getMixTapes();

            res.locals = {
                data: getMixTapesByQuery(mixTapes, req.query),
                toastMessages: [],
                confirmMessage: '',
            };

            next();
        } catch (e) {
            res.status(500).send({
                error: 'Could not get mix tapes!',
                e,
            });
        }

    },
    create: async (req, res, next) => {
        try {
            const {
                name,
                artist,
                genre,
                tag,
            } = req.body;

            const currentMixTapes = await getMixTapes();
            const newSong = {
                id: v4(),
                name,
                artist,
                genre,
                tag: tag || [],
            };

            currentMixTapes.push(newSong);

            await alterMixTapes(currentMixTapes);

            res.locals = {
                data: getMixTapesByQuery(currentMixTapes, req.query),
                toastMessages: [],
                confirmMessage: '',
            };

            next();
        } catch (e) {
            next({
                statusCode: 400,
                message: `Song can not be added`,
                stack: JSON.parse(e),
            })
        }
    },
    remove: async (req, res, next) => {
        try {
            const {
                id,
                name,
                artist,
            } = req.params;

            const deleteBy = {
                key: '',
                value: '',
            };

            if (id) {
                deleteBy.key = 'id';
                deleteBy.value = id;
            }

            if (name) {
                deleteBy.key = 'name';
                deleteBy.value = name;
            }

            if (artist) {
                deleteBy.key = 'artist';
                deleteBy.value = artist;
            }

            if (!deleteBy.key || !deleteBy.value) {
                return res.status(500).send({ error: 'Empty Params Provided!' });
            }

            const currentMixTapes = await getMixTapes();
            const song = findExistingSong(currentMixTapes, {
                key: deleteBy.key,
                value: deleteBy.value,
            })

            if (song) {
                const updatedMixTapes = currentMixTapes.filter(song => song[deleteBy.key] !== deleteBy.value);

                await alterMixTapes(updatedMixTapes);

                res.locals = {
                    data: getMixTapesByQuery(updatedMixTapes, req.query),
                    toastMessages: [],
                    confirmMessage: '',
                };

                next();
            } else {
                res.status(500).send({ error: 'No such song in DB!' });
            }
        } catch (e) {
            next({
                statusCode: 400,
                message: `Song can not be deleted`,
                stack: JSON.parse(e),
            })
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            const {
                name,
                artist,
                genre,
                tag,
            } = req.body;

            const currentMixTapes = await getMixTapes();
            const song = findExistingSong(currentMixTapes, {
                key: 'id',
                value: id,
            })

            if (song) {
                const updatedSong = {
                    ...song,
                    name: name || song.name,
                    artist: artist || song.artist,
                    genre: genre || song.genre,
                    tag: tag || song.tag || [],
                }
                const updatedMixTapes = currentMixTapes.map(song => song.id === id ? updatedSong : song);

                await alterMixTapes(updatedMixTapes);

                res.locals = {
                    data: getMixTapesByQuery(updatedMixTapes, req.query),
                    toastMessages: [],
                    confirmMessage: '',
                };

                return next();
            } else {
                res.status(500).send({ error: 'No such song in DB!' });
            }
        } catch (e) {
            next({
                statusCode: 400,
                message: `Song can not be updated`,
                stack: JSON.parse(e),
            })
        }
    },
};
