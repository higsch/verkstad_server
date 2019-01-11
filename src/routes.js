const LogController = require('./controllers/LogController');

const AuthenticationController = require('./controllers/AuthenticationController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');

const MachineController = require('./controllers/MachineController');

const TaskController = require('./controllers/TaskController');

module.exports = (app) => {
  app.get('/logbook',
    LogController.index
  );
  
  app.post('/addlog',
    LogController.add
  );

  app.post('/signup', 
    AuthenticationControllerPolicy.signUp,
    AuthenticationController.signUp
  );

  app.post('/login',
    AuthenticationController.login
  );

  app.get('/users',
    AuthenticationController.index
  );

  app.get('/machines',
    MachineController.index
  );

  app.post('/addmachine',
    MachineController.add
  );

  app.get('/tasks',
    TaskController.index
  );

  app.post('/addtask',
    TaskController.add
  );
};
