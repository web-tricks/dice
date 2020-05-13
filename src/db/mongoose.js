const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});