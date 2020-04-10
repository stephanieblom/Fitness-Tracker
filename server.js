const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs")

const PORT = process.env.PORT || 8080;
const orm = require( './db/orm.js' );
const app = express();


app.use( express.static('public') );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post( '/api/workouts/:id', async function( req, res ){
    console.log('Retrieved workout id: ', req.params.id)
    console.log('Adding new workout', req.body.name);
    await orm.addExercise( req.body, req.params.id );

    res.send( { message: 'Saved workout' +req.body.name } );
} );

app.post( '/api/firstWorkout/', async function( req, res ){
    console.log('Adding new workout', req.body);
    await orm.createWorkout( req.body, req.params.id );

    res.send( { message: 'Saved workout' +req.body.name } );
} );

app.post( '/api/newWorkouts/', async function( req, res ){
    console.log('Adding new workout');
    const newWorkout = await orm.createNewWorkout( );
    console.log(`Server retrieved new workout data id: `, newWorkout._id )

    res.send( newWorkout );
} );

app.get( '/api/workouts/', async function( req, res ){
    console.log('Called workout get function')
    const workoutsList = await orm.listWorkouts();
    console.log( 'Workouts List: ', workoutsList)
    res.send(workoutsList);
});

app.get( '/api/workouts/range', async function( req, res ){
    const previousWorkout = await orm.lastWorkout();
    console.log('Last workout recorded: ', previousWorkout);
    res.send(previousWorkout);
});



app.get("/exercise",  (req, res) => {
    const readExerciseFile =  fs.readFileSync('public/exercise.html','utf-8');
    res.send(readExerciseFile);
});
app.get("/stats",  (req, res) => {
    const readExerciseFile =  fs.readFileSync('public/stats.html','utf-8');
    res.send(readExerciseFile);
});




app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
 