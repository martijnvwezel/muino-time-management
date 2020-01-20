'use strict';
const express = require('express');
const passport = require('passport');
const projectCtrl = require('../controllers/prikklok/project.controller');
const taskCtrl = require('../controllers/prikklok/task.controller');
const eventCtrl = require('../controllers/prikklok/event.controller');
const accountingCtrl = require('../controllers/prikklok/accounting.controller');
const reportCtrl = require('../controllers/prikklok/report.controller');

const admin = require('../middleware/require-admin');
// const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

// get all the project/ tasks of a user
router.get('/users', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_users_get);



/*  /prikklok/project   */
// request for creating a project 
// NOTE must comes before get :id 
router.post('/project', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_create_post);

// get list of projects with the same name 
router.post('/project/search', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_search_post);

// put only active projects 
router.put('/project/premissions', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_premissions_put);

// request for updating a project
router.put('/project/:id', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_update_put);

// request for deleting a project
router.delete('/project/:id', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_delete);

// request for getting project details
router.get('/project/:id', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_detail_get);


// get all the projects of a user
router.get('/projects', passport.authenticate('jwt', { session: false }),admin, projectCtrl.project_list_get);

// request for getting projects details of a year
router.get('/projects/:id', passport.authenticate('jwt', { session: false }),admin, projectCtrl.projects_get_year);

// get only active projects 
router.get('/project', passport.authenticate('jwt', { session: false }), projectCtrl.project_prikklok_get);

// get all the projects there excist 
router.get('/projects_admin', passport.authenticate('jwt', { session: false }), admin, projectCtrl.admin_project_list_get);






/*  /prikklok/task   */
// NOTE must comes before get :id 

// request for creating a task 
router.post('/task', passport.authenticate('jwt', { session: false }),admin, taskCtrl.task_create_post);

// request for updating a task
router.put('/task/:id', passport.authenticate('jwt', { session: false }),admin, taskCtrl.task_update_put);

// request for deleting a task
router.delete('/task/:id', passport.authenticate('jwt', { session: false }),admin, taskCtrl.task_delete);

// request for getiing task details
router.get('/task/:id', passport.authenticate('jwt', { session: false }),admin, taskCtrl.task_detail_get);

// request for getting task list
router.get('/tasks', passport.authenticate('jwt', { session: false }),admin, taskCtrl.task_list_get);


/*  /prikklok/event   */
// NOTE must comes before get :id 

// request for creating a event 
router.post('/get_events', passport.authenticate('jwt', { session: false }), eventCtrl.get_event_post);
router.post('/event', passport.authenticate('jwt', { session: false }), eventCtrl.event_create_post);

// request for updating a event
router.put('/event/:id', passport.authenticate('jwt', { session: false }), eventCtrl.event_update_put);

// request for deleting a event
router.delete('/event/:id', passport.authenticate('jwt', { session: false }), eventCtrl.event_delete);

// request for getting event details
router.get('/event/:id', passport.authenticate('jwt', { session: false }), eventCtrl.event_detail_get);

// request for getting event list
router.get('/events', passport.authenticate('jwt', { session: false }), eventCtrl.event_list_get);



/*  /prikklok/accounting   */
// NOTE must comes before get :id 

// request for creating a event 
// router.post('/accounting', passport.authenticate('jwt', { session: false }), accountingCtrl.accounting_overview_get);

// request for getting project list with project IDs for that year
router.get('/accounting/projectlist/:id', passport.authenticate('jwt', { session: false }), admin, accountingCtrl.accounting_projects_get);


router.get('/accounting/project/:id', passport.authenticate('jwt', { session: false }), admin,  accountingCtrl.accounting_project_info_get);

// the main response
router.post('/accounting', passport.authenticate('jwt', { session: false }), admin, accountingCtrl.accounting_overview_post);



/*  /prikklok/accounting   */
// the main response
router.post('/report', passport.authenticate('jwt', { session: false }), reportCtrl.report_post); // TODO