const { Log, Task, Machine, MachineTask } = require('../models');

function addDaysToDate(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDayDiff(date) {
  return (new Date - date) / (1000 * 60 * 60 * 24);
}

module.exports = {
  async index(req, res) {
    try {
      // collect all the MachineTasks available
      const machineTasks = await MachineTask.findAll({
        limit: 100,
        include: [
          {
            model: Task,
          },
          {
            model: Machine,
          },
        ],
      });
      
      // go to the log and find the MachineTask id there
      const dueMachineTasks = await Promise.all(machineTasks.map(async machineTask => {
        let lastMachineTaskDate = await Log.findAll({
          limit: 1,
          where: {
            machineTaskId: machineTask.id,
          },
          order: [[ 'doneDate', 'DESC' ]],
          attributes: ['doneDate'],
        });

        let interval = 0;
        if (lastMachineTaskDate.length === 0) {
          // there is no entry in the log
          lastMachineTaskDate = machineTask.Task.startDate;
        } else {
          // it is in the logs, get interval to calculate next date
          interval = machineTask.Task.interval;
        }

        const dueMachineTaskDate = addDaysToDate(lastMachineTaskDate, interval);

        const response = {
          machineTask: machineTask,
          nextDate: dueMachineTaskDate,
          dayDiff: getDayDiff(dueMachineTaskDate),
        }

        return response;
      }));

      res.send({
        machineTasks: dueMachineTasks,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to predict and fetch the coming tasks.',
      });
    }
  },
};