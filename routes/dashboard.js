const router = require('express').Router();
const { dashboardController } = require('../controllers');

router.get('/', dashboardController.index);
router.get('/formulas', (req, res) => res.render('formulas', { title: 'Como calculamos' }));

module.exports = router;
