const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  days: {
    type: [String],
    required: [true, "Please provide the days you'll like to study on"],
  },
  timeSlots: {
    type: [String],
    required: [true, "Please provide the timeslots you' like to study during"],
  },
  subjects: {
    type: [String],
    required: [true, "Please provide the subjects you'll want to study"],
  },
  break: String,
  startDate: Date,
  timetable: {},
});

timetableSchema.pre("save", function (next) {
  console.log("generating your timetable...");
});

function initializePopulation(size) {
  let population = [];
  for (let i = 0; i < size; i++) {
    population.push(generateRandomTimetable());
  }
  return population;
}

function generateRandomTimetable() {
  let timetable = [];
  for (let day of this.days) {
    let daySchedule = [];
    let availableSlots = [...this.timeSlots];
    let numCourses = Math.floor(Math.random() * 3) + 2; // 2 to 4 courses per day

    for (let i = 0; i < numCourses; i++) {
      if (availableSlots.length === 0) break;
      let course =
        this.subjects[Math.floor(Math.random() * this.subjects.length)];
      let slotIndex = Math.floor(Math.random() * availableSlots.length);
      let timeSlot = availableSlots.splice(slotIndex, 1)[0];

      daySchedule.push({ course, timeSlot });
    }
    timetable.push({ day, schedule: daySchedule });
  }
  console.log(timetable);
  return timetable;
}

function evaluateTimetable(timetable) {
  let score = 0;

  for (let day of timetable) {
    let usedSlots = new Set();

    for (let entry of day.schedule) {
      let { start, end } = entry.timeSlot;
      if (usedSlots.has(start + "-" + end)) {
        score -= 10; // Overlap penalty
      } else {
        usedSlots.add(start + "-" + end);
        score += 1; // Valid entry reward
      }
    }

    if (day.schedule.length < 2 || day.schedule.length > 4) {
      score -= 5; // Invalid number of courses penalty
    }
  }
  return score;
}

function selectParents(population) {
  population.sort((a, b) => evaluateTimetable(b) - evaluateTimetable(a));
  return population.slice(0, population.length / 2);
}

function crossover(parent1, parent2) {
  let crossoverPoint = Math.floor(Math.random() * daysOfWeek.length);
  let child1 = parent1
    .slice(0, crossoverPoint)
    .concat(parent2.slice(crossoverPoint));
  let child2 = parent2
    .slice(0, crossoverPoint)
    .concat(parent1.slice(crossoverPoint));
  return [child1, child2];
}

function mutate(timetable) {
  let dayIndex = Math.floor(Math.random() * daysOfWeek.length);
  let daySchedule = timetable[dayIndex];
  let mutationType = Math.random();

  if (mutationType < 0.5) {
    // Change a course time slot
    let courseIndex = Math.floor(Math.random() * daySchedule.schedule.length);
    let availableSlots = timeSlots.filter(
      (slot) => !daySchedule.schedule.some((entry) => entry.timeSlot === slot)
    );
    if (availableSlots.length > 0) {
      daySchedule.schedule[courseIndex].timeSlot =
        availableSlots[Math.floor(Math.random() * availableSlots.length)];
    }
  } else {
    // Change a course
    let courseIndex = Math.floor(Math.random() * daySchedule.schedule.length);
    daySchedule.schedule[courseIndex].course =
      courses[Math.floor(Math.random() * courses.length)];
  }

  return timetable;
}

function runGeneticAlgorithm(generations, populationSize) {
  let population = initializePopulation(populationSize);

  for (let generation = 0; generation < generations; generation++) {
    let parents = selectParents(population);
    let nextPopulation = [];

    while (nextPopulation.length < populationSize) {
      let [parent1, parent2] = [
        parents[Math.floor(Math.random() * parents.length)],
        parents[Math.floor(Math.random() * parents.length)],
      ];
      let [child1, child2] = crossover(parent1, parent2);

      if (Math.random() < 0.1) child1 = mutate(child1);
      if (Math.random() < 0.1) child2 = mutate(child2);

      nextPopulation.push(child1, child2);
    }

    population = nextPopulation;
  }

  return population[0];
}

timetableSchema.pre("save", function (next) {
  console.log("Generating...");
  const bestTimetable = runGeneticAlgorithm(100, 50);
  this.timetable = bestTimetable;
  console.log(this.timetable);
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;

console.log("generating your timetable...");
