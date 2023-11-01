const User = require('./User');
const userRoutes = require('./user-routes');
router.use('/users', userRoutes);

module.exports = { User };