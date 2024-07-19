class TimetableGenerator {
  constructor(timetable, courses, timeSlots, daysOfWeek) {
    this.timetable = timetable;
    this.courses = courses;
    this.timeSlots = timeSlots;
    this.daysOfWeek = daysOfWeek;
    this.timetableOptions = timetableOptions;
  }

  formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  initializePopulation(size) {
    let population = [];
    for (let i = 0; i < size; i++) {
      population.push(this.generateRandomTimetable());
    }
    return population;
  }

  generateRandomTimetable() {
    let timetable = [];
    for (let day of daysOfWeek) {
      let daySchedule = [];
      let availableSlots = [...this.timeSlots];
      let numCourses = Math.floor(Math.random() * 3) + 2; // 2 to 4 courses per day

      for (let i = 0; i < numCourses; i++) {
        if (availableSlots.length === 0) break;
        let course =
          this.courses[Math.floor(Math.random() * this.courses.length)];
        let slotIndex = Math.floor(Math.random() * availableSlots.length);
        let timeSlot = availableSlots.splice(slotIndex, 1)[0];

        daySchedule.push({ course, timeSlot });
      }
      this.timetable.push({ day, schedule: daySchedule });
    }
    return this;
  }

  evaluateTimetable(timetable) {
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

  selectParents(population) {
    population.sort(
      (a, b) => this.evaluateTimetable(b) - this.evaluateTimetable(a)
    );
    return population.slice(0, population.length / 2);
  }

  crossover(parent1, parent2) {
    let crossoverPoint = Math.floor(Math.random() * daysOfWeek.length);
    let child1 = parent1
      .slice(0, crossoverPoint)
      .concat(parent2.slice(crossoverPoint));
    let child2 = parent2
      .slice(0, crossoverPoint)
      .concat(parent1.slice(crossoverPoint));
    return [child1, child2];
  }

  mutate(timetable) {
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

  runGeneticAlgorithm(generations, populationSize) {
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
}
