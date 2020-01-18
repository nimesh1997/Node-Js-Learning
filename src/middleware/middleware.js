const express = require('express')

/******************************************************************Express Middleware ***************************************************************** */

/// Goal setup a express middleware
// Using middleware: new request => do something => route handler
// simple middleware to show message when site is under maintenance
// this will always when any api request is hit
const siteMaintenanceMiddleWare = async (req, res, next) => {
    console.log('siteMaintenanceMiddleWare called...')
    res.status(500).send('Site is currently down')
}

module.exports = siteMaintenanceMiddleWare

/****************************************************************************************************************************************************** */