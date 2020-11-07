db.movies.aggregate([
    {
        $match: {
            "imdb.rating": { $gte: 7 },
            genres: { $nin: ["Crime", "Horrow"] },
            rated: { $nin: ["PG", "G"] },
            languages: { $all: ["English", "Japanese"] },
        }
    },
    {
        $project: { _id: 0, title: 1, rating: "$imdb.rating" }
    },
    {
        $count: "total"
    }
])