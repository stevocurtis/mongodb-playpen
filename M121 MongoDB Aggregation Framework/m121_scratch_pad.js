db.solarSystem.aggregate([
    {
        $project: {
            _id: 0,
            gravity: 1,
            name: 1
        }
    }, {
        $addFields: {
            gravity: "$gravity.value"
        }
    }
]).pretty()


db.nycFacilities.aggregate([
    {
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [-73.98769766092299, 30.757345233626594]
            },
            distanceField: "distanceFromMongoDB",
            spherical: true
        }
    }
]).pretty()


db.solarSystem.find({}, { _id: 0, name: 1, numberOfMoons: 1 }).pretty()
db.solarSystem.find({}, { _id: 0, name: 1, numberOfMoons: 1 }).skip(5).pretty()
db.solarSystem.find({}, { _id: 0, name: 1, numberOfMoons: 1 }).limit(5).pretty()
db.solarSystem.find({}, { _id: 0, name: 1, numberOfMoons: 1 }).sort({ numberOfMoons: -1 }).pretty()

db.solarSystem.aggregate([
    {
        "$project": {
            _id: 0,
            name: 1,
            numberOfMoons: 1
        }
    },
    { "$limit": 5 }
]
)

db.solarSystem.aggregate([
    {
        "$project": {
            _id: 0,
            name: 1,
            numberOfMoons: 1
        }
    },
    { "$skip": 1 }
]
)

db.solarSystem.aggregate([
    {
        "$match": {
            type: "Terrestrial planet"
        }
    },
    {
        "$project": {
            _id: 0,
            name: 1,
            numberOfMoons: 1
        }
    },
    { "$count": "terrestrial planets" }
]
)

db.solarSystem.aggregate([
    {
        "$project": {
            _id: 0,
            name: 1,
            hasMagneticField: 1,
            numberOfMoons: 1
        }
    },
    { "$sort": { hasMagneticField: -1, numberOfMoons: -1 } }
], { allowDiskUse: true }
)

db.solarSystem.aggregate([
    {
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [-73.98769766092299, 30.757345233626594]
            },
            distanceField: "distanceFromMongoDB",
            spherical: true
        }
    }
]).pretty()

db.nycFacilities.aggregate([
    {
        $sample: { size: 200 }
    }
]).pretty()

db.nycFacilities.aggregate([
    {
        $sample: { size: 200 }
    }
]).pretty()

db.movies.aggregate([
    {
        $group: {
            _id: "$year",
            num_films_in_year: { $sum: 1 }
        }
    }
])


db.movies.aggregate([
    {
        $group: {
            _id: {
                numDirectors: {
                    $cond: [{ $isArray: "$directors" }, { $size: "$directors" }, 0]
                },
                numFilms: { $sum: 1 },
                averageMetacritic: { $avg: "$metacritic" }
            }
        }
    },
    {
        $sort: { "_id.numDirectors": -1 }
    }
])




// aggregator accumulator expressions

db.movies.aggregate([
    {
        $group: {
            _id: "$year",
            num_films_in_year: { $sum: 1 } // calculate a new field using $sum, sum 1 to the value of 1 in year group
        }
    }
])

db.movies.aggregate([
    {
        $group: {
            _id: "null",
            count: { $sum: 1 } // calculate a new field using $sum, sum 1 to the value of 1 in year group
        }
    }
])


db.icecream_data.aggregate([
    {
        $project: {
            _id: 0,
            max_high: {
                $reduce: {
                    input: "$trends",
                    initialValue: -Infinity,
                    in: {
                        $cond: [
                            { $gt: ["$$this.avg_high_tmp", "$$value"] },
                            "$$this.avg_high_tmp",
                            "$$value"
                        ]
                    }
                }
            }
        }
    }
])

db.icecream_data.aggregate([
    {
        $project: {
            _id: 0,
            max_high: {
                $max: "$trends.avg_high_temp"
            }
        }
    }
])

//
// $unwind
//
db.movies.aggregate([
    {
        $match: {
            "imdb.rating": { $gt: 0 },
            year: { $gte: 2010, $lte: 2015 },
            runtime: { $gte: 90 }
        }
    },
    {
        $unwind: "$genres"
    },
    {
        $group: {
            _id: {
                year: "$year",
                genre: "$genres"
            },
            average_rating: { $avg: "$imdb.rating" }
        }
    },
    {
        $sort: {
            "_id.year": -1,
            average_rating: -1
        }
    },
    {
        $group: {
            _id: "$_id.year",
            genre: { $first: "$_id.genre" },
            average_rating: { $first: "$average_rating" }
        }
    },
    {
        $sort: { _id: -1 }
    }
])

//
// $lookup (left outer join)
//
db.air_airlines.findOne()
db.air_alliances.findOne()

db.air_alliances.aggregate([
    {
        $lookup: {
            from: "air_airlines",
            localField: "airlines",
            foreignField: "name",
            as: "airlines"
        }
    }
])

//
// $graphLookup (left outer join)
//
db.parent_reference.findOne()

db.parent_reference.aggregate([
    {
        $match: {
            name: "Eliot"
        }
    },
    {
        $graphLookup: {
            from: "parent_reference",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "reports_to",
            as: "all_reports"
        }
    }
])

//
// $facets
//
use startups
db.companies.findOne()

db.companies.aggregate([
    {
        $match: { "$text": { "$search": "network" } }
    },
    {
        $sortByCount: "$category_code"
    }
])

db.companies.aggregate([
    {
        $match: { "$text": { "$search": "network" } }
    },
    {
        $unwind: "$offices"
    },
    {
        $match: {
            "offices.city": { "$ne": "" }
        }
    },
    {
        $sortByCount: "$offices.city"
    }
])

//
// $bucket
//
db.companies.aggregate([
    {
        $match: {
            "founded_year": { "$gt": 1980 },
            "number_of_employees": { "$ne": null }
        }
    },
    {
        $bucket: {
            "groupBy": "$number_of_employees",
            "boundaries": [0, 20, 50, 100, 500, 1000, Infinity],
            "default": "Other",
            "output": {
                "total": { "$sum": 1 },
                "average": { $average: "$number_of_employees" },
                "categories": { "$addToSet": "$category_code" }
            }
        }
    }
])

//
// $bucketAuto
//
db.companies.aggregate([
    {
        $match: { "offices.city": "New York" }
    },
    {
        $bucketAuto: {
            "groupBy": "$founder_year",
            "buckets": 5
        }
    }
])

