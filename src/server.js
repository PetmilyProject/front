const express = require('express');
const app = express();

const server = async () => {
  try {
    const PORT =
      'http://ec2-13-125-244-38.ap-northeast-2.compute.amazonaws.com:8082/';
    if (!PORT) throw new Error('PORT is requrired');

    console.log('Entered into the server...');

    // await mongoose.connect(MONGO_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology:true,
    // //    useCreateIndex:true,
    // //    useFindAndModify: false
    // });

    app.listen(PORT, async () =>
      console.log(`server listening on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

server();
