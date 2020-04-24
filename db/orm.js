const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessTracker', {useNewUrlParser: true, useUnifiedTopology: true,});
mongoose.set('useCreateIndex', true);

// include mongoose models (it will include each file in the db directory)
const workouts = require( './workouts.js' );
const exercises = require( './exercises.js' );


async function createWorkout( data ){

        const newExercise = await exercises.create( { 
                type: data.type,
                name: data.name,
                duration: data.duration,
                weight: data.weight,
                reps:  data.reps,
                sets: data.sets,
                distance: data.distance
        } );

        console.log('New exercise id: ', newExercise._id)

        const newWorkout = await workouts.create({
        exercises: newExercise,
        totalDuration: data.duration
        })
        
        console.log( 'created workout in db', newWorkout);

        return newWorkout;
      
}

async function createNewWorkout( ){

    const newWorkout = await workouts.create({totalDuration: 0});
    
    console.log( 'created workout in db', newWorkout._id);

    return newWorkout;
  
}

async function addExercise( data, id){

    const newExercise = await exercises.create( { 
        type: data.type,
        name: data.name,
        duration: data.duration,
        weight: data.weight,
        reps:  data.reps,
        sets: data.sets,
        distance: data.distance
} );

console.log('New exercise id: ', newExercise._id)
    console.log('Workout id: ', id);
    const pullWorkout = await workouts.find({_id: String(id)})
    console.log( 'Current workout: ', pullWorkout)
    console.log( 'Previous duration: ',pullWorkout[0].totalDuration)
    let updateTotalDuration = pullWorkout[0].totalDuration+newExercise.duration;
    console.log('Duration: ', updateTotalDuration)
    const newExerciseId = mongoose.Types.ObjectId( newExercise._id );
    const addDurationWorkout = await workouts.updateOne({_id: String(id)}, {totalDuration: updateTotalDuration});
    const addToWorkout = await workouts.findByIdAndUpdate({_id: String(id)}, {$push: {exercises: newExerciseId}});
    console.log( "adding exercise to existing workout")

    return addToWorkout;  
}

async function listWorkouts(){

    const listWorkouts =  await workouts.find().populate('exercises')
    if (!listWorkouts){
        const noWorkoutsYet = 0
        console.log('No workouts posted in db yet ')
        return noWorkoutsYet; 
    } else {
        console.log('Displaying workouts found in db:', listWorkouts);
        return listWorkouts; 
    }

}


async function lastWorkout(){
    
    const previousWorkout =  await workouts.find().limit(1).sort({$natural:-1}).populate('exercises');
    return previousWorkout;
}


module.exports = { 
    createWorkout,
    createNewWorkout,
    listWorkouts,
    lastWorkout,
    addExercise
}