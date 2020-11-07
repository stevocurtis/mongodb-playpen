db.movies.aggregate([
    {
        $project: {
            numTitleWords: {
                $size: { $split: ["$title", " "] }
            }
        }
    },
    {
        $match: { numTitleWords: { $eq: 1 } }
    }
]).itcount()