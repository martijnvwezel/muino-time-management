# Some database stuff for remembering 
```
**https://stackoverflow.com/questions/49047239/mongodb-multiple-match-conditions-and-return-documents-with-common-name**

$facet: {


"betweenDates": [ 
  {$match: {$and: [  
    {'time_start':{ $gte: new Date(2019, 1, 1) }}, 
    {'time_due':{ $lte: new Date(2019, 12, 31) }} 
    ]}
  }
  ]

}


db.examSheet.aggregate([{$facet: {
  "halfyr": [ {$match: {$and: [{'exam': 'halfyr_T'},{'std': '9'},{'year': "2017"},{'marks.p': {$gte: '25'}}]}}],
  "annual": [ {$match: {$and: [{'exam': 'annual_T'},{'std': '9'},{'year': "2017"},{'marks.p': {$gte: '35'}} ]}}] 
  }
},
{$unwind : "$annual"}
]);




            // $match: { 
            //     $or:
            //     "time_start": { $gte: new Date(year, 1, 1) }, // $gte: greater to equal
            //     "time_due": { $lte: new Date(year, 12, 31) }  // $lte: lower to equal
            // }
            // $facet: {


            //     "betweenDates": [ 
            //       {$match: {$and: [  
            //         {'time_start':{ $gte: new Date(2019, 1, 1) }}, 
            //         {'time_due':{ $lte: new Date(2019, 12, 31) }} 
            //         ]}
            //       }
            //       ]
                
            //     }
                
            // ,
            // $match: {
            //     "time_start": { $exists: false }, // $gte: greater to equal
            //     "time_due": { $lte: new Date(year, 12, 31) }  // $lte: lower to equal
            // },

```