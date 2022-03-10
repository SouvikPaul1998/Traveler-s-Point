const express = require('express');
const app =express();
var cors = require('cors')
const mongoose=require('mongoose');
const {MONGOURI}=require('./keys');


require('./models/user')
require('./models/post')

mongoose.connect(MONGOURI,{ useNewUrlParser: true }, 
    (err) => 
    {
       if (!err)
          console.log('NODEJS TO MongoDB Connection ESTABLISHeddddd.....');
       else
          console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
    });


app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'));
app.use(require('./routes/user'));
app.use(require('./routes/conversationrouter'));
app.use(require('./routes/messagerouter'));
app.listen(5000, () => {
 console.log('Example app is running → PORT 5000');
});
