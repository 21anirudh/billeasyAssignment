const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server running on port', process.env.PORT || 3000);
    });
}).catch(err => console.error(err));
